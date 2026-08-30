// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Inelegis Keepalive Receiver (Supabase Edge Function)
 * Padrão: Hub-First / Hub Keepalive Pattern
 * @version 0.3.15
 */

const KEEPALIVE_TOKEN = Deno.env.get("KEEPALIVE_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

/** Comparação de token em tempo constante (evita timing attack). */
function tokensMatch(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  // 1. Método HTTP (Apenas POST)
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Validação de Token
  const authHeader = req.headers.get("Authorization");
  const providedToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.headers.get("x-keepalive-token");

  if (!KEEPALIVE_TOKEN) {
    console.error(
      "[Keepalive] ERRO: KEEPALIVE_TOKEN não configurado nos segredos do Supabase.",
    );
    return new Response(
      JSON.stringify({ error: "Server configuration missing" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (!tokensMatch(providedToken, KEEPALIVE_TOKEN)) {
    console.warn("[Keepalive] 401: token inválido ou ausente.");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
      },
    });

    const payload = await req.json().catch(() => ({}));
    const now = new Date().toISOString();

    // Payload tem precedência; env vars são o default; por último, o fallback fixo.
    const source =
      payload.source || Deno.env.get("KEEPALIVE_SOURCE") || "external-trigger";
    const projectSlug =
      payload.project_slug ||
      Deno.env.get("KEEPALIVE_PROJECT_SLUG") ||
      "inelegis";
    const environment =
      payload.environment || Deno.env.get("KEEPALIVE_ENVIRONMENT") || "prod";
    const region = payload.region || Deno.env.get("KEEPALIVE_REGION") || "edge";
    const eventsEnabled = Deno.env.get("KEEPALIVE_EVENTS_ENABLED") !== "false";

    // Latência: coage string numérica, rejeita NaN/negativo. response_time_ms
    // (chave do padrão Hub) tem precedência sobre latency_ms (legado).
    const parseLatency = (...candidates: unknown[]): number | null => {
      for (const candidate of candidates) {
        if (candidate === null || candidate === undefined || candidate === "")
          continue;
        const value = Number(candidate);
        if (Number.isFinite(value) && value >= 0) return value;
      }
      return null;
    };
    const latencyMs = parseLatency(
      payload.response_time_ms,
      payload.latency_ms,
    );

    // 3. Heartbeat (Status Principal)
    const { error: heartbeatError } = await supabase.from("keepalive").upsert({
      id: 1,
      project_slug: projectSlug,
      environment: environment,
      region: region,
      source: source,
      last_ping_at: now,
      last_success_at: now,
      latency_ms: latencyMs,
      schema_version: 1,
    });

    if (heartbeatError) throw heartbeatError;

    // 4. Registro de Evento Histórico (opcional; padrão ligado)
    if (eventsEnabled) {
      const { error: eventError } = await supabase
        .from("keepalive_events")
        .insert({
          project_slug: projectSlug,
          environment: environment,
          source: source,
          ping_at: now,
          status: "ok",
          status_code: 200,
          latency_ms: latencyMs,
          response_time_ms: latencyMs,
          metadata: { region: region },
        });

      if (eventError)
        console.error("[Keepalive] Erro ao gravar evento:", eventError);
    }

    return new Response(
      JSON.stringify({ ok: true, timestamp: now, source: source }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[Keepalive] Erro Fatal:", errorMessage);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
