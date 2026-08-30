-- =====================================================
-- Migration: keepalive contract consolidation (SSoT)
-- =====================================================
-- Reafirma, em UM único arquivo, o contrato completo de keepalive já
-- distribuído entre:
--   20260225000300_keepalive.sql            (tabelas + RLS base)
--   20260226000100_keepalive_hub_compat.sql (status_code / response_time_ms)
--   20260303000100_keepalive_events_rls_service_only.sql (hardening events)
--
-- Motivo: o validador do Hub (audit:keepalive) lê apenas a última migration
-- keepalive por ordem lexical; sem um arquivo consolidado ele não enxerga as
-- tabelas/políticas criadas nas migrations anteriores.
--
-- 100% idempotente: CREATE ... IF NOT EXISTS, ADD COLUMN IF NOT EXISTS e
-- DROP POLICY IF EXISTS + CREATE POLICY. NUNCA faz DROP TABLE. Preserva dados.
-- Data: 30/08/2026
-- =====================================================

-- 1. Tabela keepalive (Singleton / status atual)
CREATE TABLE IF NOT EXISTS public.keepalive (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT 1,
    project_slug TEXT NOT NULL DEFAULT 'project',
    environment TEXT NOT NULL DEFAULT 'prod',
    region TEXT,
    source TEXT NOT NULL DEFAULT 'unknown',
    last_ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_success_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_error TEXT,
    latency_ms INTEGER,
    schema_version INTEGER NOT NULL DEFAULT 1,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT keepalive_singleton_check CHECK (id = 1)
);

-- 2. Tabela keepalive_events (histórico de pings)
CREATE TABLE IF NOT EXISTS public.keepalive_events (
    id BIGSERIAL PRIMARY KEY,
    project_slug TEXT NOT NULL,
    environment TEXT NOT NULL,
    region TEXT,
    source TEXT NOT NULL,
    ping_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'ok',
    latency_ms INTEGER,
    error TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.1 Colunas de compliance do Hub (padrão status_code / response_time_ms)
ALTER TABLE public.keepalive_events ADD COLUMN IF NOT EXISTS status_code INTEGER;
ALTER TABLE public.keepalive_events ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;

COMMENT ON COLUMN public.keepalive_events.status_code IS 'Código HTTP do ping recebido pelo receptor de keepalive.';
COMMENT ON COLUMN public.keepalive_events.response_time_ms IS 'Tempo de resposta em ms (padrão Hub). Campo legado: latency_ms.';

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_keepalive_events_project_env ON public.keepalive_events (project_slug, environment);
CREATE INDEX IF NOT EXISTS idx_keepalive_events_ping_at ON public.keepalive_events (ping_at DESC);

-- 4. RLS
ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keepalive_events ENABLE ROW LEVEL SECURITY;

-- 4.1 keepalive: leitura pública (dashboard), escrita apenas service_role
DROP POLICY IF EXISTS "Allow public read access" ON public.keepalive;
CREATE POLICY "Allow public read access"
ON public.keepalive
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow service role full access" ON public.keepalive;
CREATE POLICY "Allow service role full access"
ON public.keepalive
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4.2 keepalive_events: acesso interno restrito a service_role
DROP POLICY IF EXISTS "Allow authenticated read access" ON public.keepalive_events;
DROP POLICY IF EXISTS "Allow public read access" ON public.keepalive_events;
DROP POLICY IF EXISTS "Allow service role full access" ON public.keepalive_events;
CREATE POLICY "Allow service role full access"
ON public.keepalive_events
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
