/**
 * Suíte real de produto executada pelo runner nativo do Node (`node --test`).
 * Cobre os utilitários puros de segurança/validação usados antes de qualquer
 * chamada ao Supabase e em toda interpolação de HTML.
 *
 * Rodar: npm run test:node
 */
import test from "node:test";
import assert from "node:assert/strict";

import { escapeHtml } from "../../src/js/utils/escape-html.js";
import { InputValidator } from "../../src/js/utils/input-validator.js";

test("escapeHtml neutraliza os metacaracteres de HTML/atributo", () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')">`),
    "&lt;img src=x onerror=&quot;alert(&#x27;x&#x27;)&quot;&gt;",
  );
  assert.equal(escapeHtml("a & b"), "a &amp; b");
  assert.equal(escapeHtml("path/to"), "path&#x2F;to");
});

test("escapeHtml coage entradas não-string sem lançar", () => {
  assert.equal(escapeHtml(42), "42");
  assert.equal(escapeHtml(null), "null");
  assert.equal(escapeHtml(undefined), "undefined");
});

test("InputValidator.validateLawCode aceita só o formato canônico", () => {
  assert.equal(InputValidator.validateLawCode("lei_64"), "LEI_64");
  assert.equal(InputValidator.validateLawCode("  cp  "), "CP");
  assert.equal(InputValidator.validateLawCode("lei-64"), null);
  assert.equal(InputValidator.validateLawCode("x".repeat(21)), null);
  assert.equal(InputValidator.validateLawCode(""), null);
  assert.equal(InputValidator.validateLawCode(null), null);
});

test("InputValidator.validateArticle normaliza ordinais e travessões", () => {
  assert.equal(InputValidator.validateArticle("121º"), "121");
  assert.equal(InputValidator.validateArticle("1 – A"), "1-A");
  assert.equal(InputValidator.validateArticle(121), "121");
  assert.equal(InputValidator.validateArticle("DROP TABLE"), null);
  assert.equal(InputValidator.validateArticle(null), null);
});

test("InputValidator.normalizeDetail mapeia variações de parágrafo único e caput", () => {
  assert.equal(InputValidator.normalizeDetail("Único"), "unico");
  assert.equal(InputValidator.normalizeDetail("§ único"), "unico");
  assert.equal(InputValidator.normalizeDetail("caput"), "caput");
  assert.equal(InputValidator.normalizeDetail("  III  "), "iii");
  assert.equal(InputValidator.normalizeDetail(null), null);
});

test("InputValidator.validateText respeita o limite e descarta vazios", () => {
  assert.equal(InputValidator.validateText("  ok  "), "ok");
  assert.equal(InputValidator.validateText("   "), null);
  assert.equal(InputValidator.validateText("abc", 2), null);
  assert.equal(InputValidator.validateText(123), null);
});
