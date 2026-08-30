# 🛠️ Keepalive no Inelegis (Hub Keepalive Pattern)

Guia unificado de configuração do monitoramento externo para **reduzir o risco** de o Supabase suspender o banco por inatividade.

> **Importante:** O Hub define o **Keepvasne Keepalive Cloudflare Worker (centralizado)** como o único pinger oficial da frota.
>
> **Limitação Crítica:** Nenhum pinger consegue acordar um banco **já suspenso**. O objetivo é gerar tráfego regular para evitar a suspensão. Reativação é manual via Dashboard do Supabase.

---

## 🏗️ Arquitetura

O Inelegis usa a variante **Decoupled** do padrão Hub:

1. **Pinger:** Keepvasne Keepalive Cloudflare Worker (a cada 30 min).
2. **Receptor:** Vercel Serverless Function (`api/keepalive.js`, rota `/api/keepalive`).
3. **Persistência:** Tabelas `keepalive` e `keepalive_events` no Supabase.

```
Frontend:  Vanilla JS/HTML estático (Vercel)
Backend:   API Routes serverless (Vercel /api/*)
Keepalive: Vercel Serverless (/api/keepalive)
Database:  PostgreSQL (Supabase)
```

**Por que Vercel Serverless e não Edge Function?** O receptor foi migrado para `/api/keepalive` a fim de concentrar toda a superfície serverless na Vercel (mesma stack de `/api/analytics`, `/api/dashboard`), reaproveitar `SUPABASE_SERVICE_ROLE_KEY` já configurada e simplificar deploy/observabilidade. Vercel Serverless Functions não exigem Next.js/SSR — funcionam em projeto estático. A Edge Function `supabase/functions/keepalive/index.ts` permanece no repositório como fallback legado e não é mais o alvo oficial do pinger.

**Referência:** `.agent/hub/docs/guides/guide-keepalive-monitoring.md` e `.agent/hub/system/scaffolding/keepalive/ARCHITECTURE.md`

---

## ✅ Checklist de Configuração

### 1. Keepvasne Keepalive Worker (Central)

| Variável                | Valor/Formato                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `KEEPALIVE_URLS`        | CSV de destinos. Para o Inelegis incluir: `https://inelegis.vercel.app/api/keepalive` |
| `KEEPALIVE_TOKEN`       | Mesmo segredo configurado na Vercel (`KEEPALIVE_TOKEN`).                              |
| `KEEPALIVE_ADMIN_TOKEN` | Opcional para trigger manual autenticado do worker central.                           |

**Cron Trigger:** `*/30 * * * *` (a cada 30 minutos).

**Operação:** o worker ativo roda de forma centralizada no keepvasne (fora deste repositório).

**Referência de contrato:** `.agent/hub/system/scaffolding/keepalive/cloudflare-worker.js`

---

### 2. Vercel Serverless Function (Receptor)

**Arquivo:** `api/keepalive.js` — rota `POST /api/keepalive`

| Variável (Vercel)                       | Descrição                                                         |
| --------------------------------------- | ----------------------------------------------------------------- |
| `KEEPALIVE_TOKEN`                       | Mesmo valor do Cloudflare (Bearer ou header `x-keepalive-token`). |
| `NEXT_PUBLIC_SUPABASE_URL`              | URL do projeto Supabase.                                          |
| `SUPABASE_SERVICE_ROLE_KEY`             | Chave service role (upsert na tabela singleton `keepalive`).      |
| `KEEPALIVE_EVENTS_ENABLED`              | `true` para gravar histórico em `keepalive_events` (opcional).    |
| `KEEPALIVE_PROJECT_SLUG`                | Default do slug quando ausente no payload (fallback `inelegis`).  |
| `KEEPALIVE_ENVIRONMENT`                 | Default do ambiente (fallback `prod`).                            |
| `KEEPALIVE_REGION` / `KEEPALIVE_SOURCE` | Defaults opcionais de metadados.                                  |

Respostas: `200` heartbeat aceito · `401` token inválido/ausente · `405` método ≠ POST · `500` credenciais do servidor ausentes.

**Dashboard:** `https://vercel.com/rkvasne/inelegis-app/settings/environment-variables`

> **Legado:** `supabase/functions/keepalive/index.ts` continua versionado como fallback, mas não recebe mais tráfego do pinger oficial.

---

### 3. Vercel — O que configurar

| Variável                                           | Necessário para                                            |
| -------------------------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                         | Frontend (RPC `verificar_elegibilidade`)                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                    | Frontend autenticar chamadas                               |
| `SUPABASE_SERVICE_ROLE_KEY`                        | API Routes (`/api/analytics`, `/api/dashboard`) bypass RLS |
| `HISTORY_RETENTION_DAYS`                           | Limpeza de histórico                                       |
| `CRON_SECRET`                                      | Endpoints de manutenção                                    |
| `ANALYTICS_ADMIN_TOKEN`                            | Dashboard admin                                            |
| `KEEPALIVE_TOKEN`                                  | Receptor `/api/keepalive` autenticar o pinger              |
| `KEEPALIVE_EVENTS_ENABLED`                         | Ligar histórico em `keepalive_events` (opcional)           |
| `KEEPALIVE_PROJECT_SLUG` / `KEEPALIVE_ENVIRONMENT` | Defaults do receptor (opcional)                            |

### ❌ NÃO configurar na Vercel

- `KEEPALIVE_URLS` (variável do worker central no Cloudflare)
- `SUPABASE_ANON_KEY` do lado servidor (o receptor usa a service role)

---

### 4. `.env.local` (Desenvolvimento)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://btdbfspuazgerdbmurza.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Keepalive receptor /api/keepalive (opcional para dev)
KEEPALIVE_TOKEN=...
KEEPALIVE_PROJECT_SLUG=inelegis
KEEPALIVE_ENVIRONMENT=dev
KEEPALIVE_EVENTS_ENABLED=true

# Sistema
HISTORY_RETENTION_DAYS=90
CRON_SECRET=...
ANALYTICS_ADMIN_TOKEN=...
```

---

## ✅ Validação

1. **Confirmar inclusão no keepvasne:** endpoint do Inelegis presente no `KEEPALIVE_URLS` central.
2. **Ping manual no receptor:** `curl -X POST https://inelegis.vercel.app/api/keepalive -H "Authorization: Bearer [TOKEN]"` → espera `{"ok":true,...}`.
3. **Logs:** verificar a function `/api/keepalive` no painel da Vercel para confirmar pings recebidos do Cloudflare.
4. **Dashboard:** `/admin/sistema.html` — status de Uptime em tempo real.

### Colunas de Compliance (Hub)

Para compliance de auditoria, `keepalive_events` deve conter:

- `project_slug`
- `environment`
- `status_code`
- `response_time_ms`

No Inelegis, a migration de compatibilidade é:
`supabase/migrations/20260226000100_keepalive_hub_compat.sql`
(mantém retrocompatibilidade com `status` e `latency_ms`).

---

## 🚨 Troubleshooting

| Problema                           | Solução                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| **Keepalive 401**                  | Tokens diferentes. Cloudflare e Vercel devem ter `KEEPALIVE_TOKEN` idêntico.         |
| **Sem ping no Inelegis**           | Verifique se a URL do Inelegis foi adicionada ao `KEEPALIVE_URLS` do worker central. |
| **Build: ANON_KEY não encontrada** | Adicione `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel e redeploy.                       |
| **API Routes 500**                 | Verifique `SUPABASE_SERVICE_ROLE_KEY` na Vercel.                                     |
| **Frontend não carrega**           | Adicione ambas as variáveis `NEXT_PUBLIC_*` na Vercel.                               |

Ver também: [troubleshooting-vercel-deploy.md](troubleshooting-vercel-deploy.md)

---

## 🔗 Links

- [Vercel Dashboard](https://vercel.com/rkvasne/inelegis-app/settings/environment-variables)
- [Supabase Dashboard](https://supabase.com/dashboard/project/btdbfspuazgerdbmurza)
- [.agent/hub/docs/guides/guide-keepalive-keepvasne-runbook.md](../../.agent/hub/docs/guides/guide-keepalive-keepvasne-runbook.md)
- [variaveis-ambiente.md](variaveis-ambiente.md)
- [auditoria-e-monitoramento.md](../operations/auditoria-e-monitoramento.md)

---

_Última atualização: 29/08/2026 • v0.3.29 (Hub v0.6.4)_
_Editado via: Claude Code (VS Code) | Modelo: Claude Sonnet 5 | OS: Windows 11_
