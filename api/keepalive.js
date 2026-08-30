/**
 * Keepalive Endpoint (padrão Hub)
 * Recebe heartbeats do Cloudflare Worker e atualiza o status de vitalidade.
 *
 * Deploy: Vercel Serverless Function
 * Database: Supabase (PostgreSQL)
 */

import { timingSafeEqual } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

/** Trim seguro: só age em string; qualquer outro tipo vira null. */
function str(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Latência em ms a partir do payload. Tenta cada candidato na ordem, coage
 * string numérica, e rejeita NaN/Infinity/negativo. Retorna null se nenhum
 * candidato for válido.
 */
function parseLatency(...candidates) {
  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "")
      continue;
    const value = Number(candidate);
    if (Number.isFinite(value) && value >= 0) return value;
  }
  return null;
}

/** Comparação de token em tempo constante (evita timing attack). */
function tokensMatch(provided, expected) {
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function getTokenFromRequest(req) {
  const direct = req.headers["x-keepalive-token"];
  if (direct) return direct;

  const authorization = req.headers["authorization"];
  if (!authorization) return null;

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // 1. Validação de Segurança
  const expectedToken = process.env.KEEPALIVE_TOKEN;
  if (!expectedToken) {
    res
      .status(500)
      .json({ error: "KEEPALIVE_TOKEN não configurado no servidor" });
    return;
  }

  const providedToken = getTokenFromRequest(req);
  if (!providedToken || !tokensMatch(providedToken, expectedToken)) {
    res.status(401).json({ error: "Token inválido ou ausente" });
    return;
  }

  // 2. Conexão Supabase (Service Role)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    res
      .status(500)
      .json({ error: "Credenciais do Supabase (URL/ServiceRole) ausentes" });
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  // 3. Processamento do Payload
  const payload = typeof req.body === "object" && req.body ? req.body : {};
  const now = new Date().toISOString();

  const projectSlug =
    str(payload.project_slug) ||
    process.env.KEEPALIVE_PROJECT_SLUG ||
    "inelegis";
  const environment =
    str(payload.environment) || process.env.KEEPALIVE_ENVIRONMENT || "prod";
  const region = str(payload.region) || process.env.KEEPALIVE_REGION || null;
  const source =
    str(payload.source) || process.env.KEEPALIVE_SOURCE || "external-cron";
  // Aceita response_time_ms (chave primária do receptor legado) com fallback
  // para latency_ms; coage strings numéricas e descarta valores negativos.
  const latencyMs = parseLatency(payload.response_time_ms, payload.latency_ms);
  const lastError =
    typeof payload.last_error === "string" ? payload.last_error : null;
  const status = str(payload.status) || (lastError ? "error" : "ok");
  const isError = status === "error" || lastError !== null;
  const metadata =
    payload.metadata &&
    typeof payload.metadata === "object" &&
    !Array.isArray(payload.metadata)
      ? payload.metadata
      : {};

  // 4. Heartbeat (Status Atual) - Tabela Singleton
  const { error } = await supabase.from("keepalive").upsert(
    {
      id: 1,
      project_slug: projectSlug,
      environment,
      region,
      source,
      last_ping_at: now,
      last_success_at: isError ? undefined : now,
      last_error: lastError,
      latency_ms: latencyMs,
      schema_version: 1,
      metadata,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("Erro ao atualizar keepalive:", error);
    res.status(500).json({ error: error.message });
    return;
  }

  // 5. Histórico de Eventos (Opcional)
  const eventsEnabled = process.env.KEEPALIVE_EVENTS_ENABLED === "true";
  let eventsError = null;

  if (eventsEnabled) {
    const { error: insertError } = await supabase
      .from("keepalive_events")
      .insert({
        project_slug: projectSlug,
        environment,
        region,
        source,
        ping_at: now,
        status,
        latency_ms: latencyMs,
        error: lastError,
        metadata,
      });

    if (insertError) {
      eventsError = insertError.message;
      console.error("Erro ao inserir evento:", insertError);
    }
  }

  // 6. Resposta Final
  if (eventsError) {
    res.status(200).json({
      ok: true,
      last_ping_at: now,
      events_logged: false,
      events_error: eventsError,
    });
    return;
  }

  res
    .status(200)
    .json({ ok: true, last_ping_at: now, events_logged: eventsEnabled });
}
