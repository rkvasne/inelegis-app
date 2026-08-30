---
trigger: always_on
---

# 🤖 GEMINI.md - Inelegis

> **Hub Link:** `.agent/hub/` (READ-ONLY)
> **Priority:** P0 (GEMINI.md) > P1 (Persona) > P2 (Skill)
> **Hub Version:** v0.10.8
> **Isolamento:** Hub ↔ Satélite (Governança Bidirecional)

Este projeto consome inteligência centralizada do Agents Hub através de links para `.agent/hub/` (`junction` no Windows; `symlink` em Linux/WSL).

> **Convenção de exemplos:** se este documento mostrar caminhos/comandos de um shell específico, isso serve como **exemplo operacional**. O contrato geral do Hub continua **neutro e cross-platform**, com equivalentes locais quando o projeto rodar fora desse ambiente.

**⚠️ GOVERNANÇA:** Este projeto possui AUTONOMIA LIMITADA, estando vinculado às regras e padrões do Agents Hub.
O Hub governa a inteligência e o DNA; este projeto as aplica localmente.
Satélites NÃO alteram o Hub. Hub é READ-ONLY nesta instância.

---

## 🚨 STOP GATES (VERIFICAÇÃO OBRIGATÓRIA)

**⚠️ ANTES de QUALQUER ação, você DEVE verificar:**

### Gate 1: Proteção do Hub (READ-ONLY)

```
PERGUNTA: O arquivo que vou editar está em `.agent/hub/`?
├─ SIM → 🛑 PARE IMEDIATAMENTE. VIOLAÇÃO DE MEMÓRIA.
│        Informe: "Este arquivo está na zona READ-ONLY do Hub."
│        Ação: Alterações devem ser feitas no repositório original.
└─ NÃO → ✅ Continue para o próximo Gate.
```

### Gate 2: Comandos Destrutivos

```
PERGUNTA: O comando que vou sugerir é destrutivo?
├─ DESTRUTIVOS (REQUEREM AUTORIZAÇÃO EXPLÍCITA):
│   • git checkout -- / git restore / git reset --hard
│   • git clean -fd / git clean -fx
│   • rm -rf / rimraf / del /s /q
│   • Qualquer comando que apaga dados não versionados
├─ SIM → 🛑 PEÇA AUTORIZAÇÃO antes de sugerir.
│        Liste exatamente o que será perdido.
└─ NÃO → ✅ Continue para o próximo Gate.
```

### Gate 3: Identificação Correta

```
PERGUNTA: Estou identificando meu modelo corretamente?
├─ Use EXATAMENTE o valor da sua identidade real.
├─ NÃO invente (ex: não diga "Gemini" se você é "Claude").
└─ ✅ Prossiga com a ação.
```

### Gate 4: Âncora de Identidade (Anti-Alucinação)

```
PERGUNTA: O projeto que estou editando é realmente o "meu" projeto atual?
├─ VALIDE via: Corpus Mapping, status de memória e âncora GEMINI.
├─ SE OPERANDO FORA DA RAIZ DO PROJETO IDENTIFICADO:
│   • 🛑 PARE IMEDIATAMENTE. Você está em **Transgressão de Jurisdição**.
│   • PEÇA autorização explícita para cruzar fronteiras.
└─ ✅ Prossiga se estiver dentro da sua **competência de execução**.
```

---

## 🔐 AUTO-DETECÇÃO DE CAMINHO (Obrigatório)

**ANTES de editar QUALQUER arquivo:**

1. **Verifique** se o caminho contém `.agent/hub/`
2. **SE CONTÉM** → RECUSE a edição imediatamente
3. **INFORME** ao usuário: "Este arquivo está na zona READ-ONLY do Hub."

**Caminhos PROIBIDOS para edição:**

- `.agent/hub/*` (TODO o conteúdo)
- Qualquer caminho que resolva para o Hub central via `.agent/hub/` (ex.: `D:\Agents`)

**Caminhos PERMITIDOS:**

- `.agent/memory/*` (memória local do projeto)
- Qualquer outro arquivo do projeto

---

## 📥 REQUEST CLASSIFIER

Classifique antes de agir:

- **SIMPLE:** Fix/Change pontual -> Edição Direta.
- **COMPLEX:** Build/Feature/Refactor -> Exige Plano (`task-slug.md`).

## 🛑 SOCRATIC GATE (Obrigatório)

Pare e pergunte antes de codar:

- **New Feature:** até 3 perguntas estratégicas em uma única rodada.
- **Bug Fix:** Confirme impacto e causa raiz.
- **Saída obrigatória:** na mesma resposta das perguntas, inclua uma seção fixa `Respostas recomendadas`.
- **Formato:** uma resposta consolidada, curta e pronta para uso, deixando `Suposição` explícita quando houver incerteza.
- **Aprovação rápida:** se o usuário responder `ok`, `segue`, `pode usar as recomendadas`, `aprovado` ou equivalente, implemente na rodada seguinte sem abrir nova bateria de perguntas.

---

## 🏗️ AGENT PROTOCOL (Hub-First)

1. **Personas:** Sempre carregue a persona adequada de `.agent/hub/brain/personas/mode-[especialista].md`.
2. **Skills:** Utilize as ferramentas em `.agent/hub/capabilities/` conforme demanda.
3. **Architecture:** Siga as regras globais em `.agent/hub/brain/constitution/rule-universal-principles.md` e `AGENTS.md`.

---

## 📚 Documentação externa atualizada

Para comportamento atual ou versionado de biblioteca, framework, SDK, runtime, ferramenta ou padrão sujeito a mudança, consulte a fonte oficial. Use `Context7` quando estiver disponível; se ele não estiver conectado, não bloqueie o trabalho e registre a fonte e a versão consultadas. `Context7` é documentação versionada, diferente do MCP `context-mode`, que otimiza o uso de contexto.

---

## 🧹 Clean Code & Standards

- **Code:** Conciso, direto, sem over-engineering.
- **Testing:** AAA Pattern (Arrange, Act, Assert). Prefira unitário + integração como baseline; Playwright/E2E só com justificativa.
- **Git:** Commits em Português (pt-BR) seguindo Conventional Commits.
- **Encoding:** UTF-8 BOM em todos os arquivos Markdown.
- **Resposta:** Resultado e impacto primeiro, linguagem simples, cerca de 80–180 palavras em conclusões comuns e sem repetir informações.
- **Fechamento:** `Fonte | Ausência | Suposição`; `Sugestões opcionais` somente quando acrescentarem algo fora do próximo passo e da rota.

---

## 🧭 Navegação Proativa

Ao finalizar uma tarefa:

1. **Consulte internamente** o lifecycle em `.agent/hub/brain/prompts/prompt-registry.json` pelo roteador; use o README da biblioteca como índice humano.
2. **Informe o próximo passo imediato** com prompt/ação e motivo, sem delegar `prompt:next` ao terminal do usuário.
3. **Mostre a rota recomendada restante** e classifique cada etapa como `obrigatória`, `condicional`, `recomendada` ou `opcional`.
4. **Não volte no ciclo por reflexo:** etapas anteriores devem aparecer como concluídas/dispensadas, nunca como nova recomendação.
5. **Mantenha proporcionalidade:** testes e review após implementação; Prompt 34 conforme risco; documentação conforme impacto; Prompt 19 opcional e parametrizado.
6. **Mostre `Prompts executados`** em uma linha quando o lifecycle tiver uma cadeia oficial. Não reconstrua a sequência pela memória do chat.
7. **Evite repetição:** `Próximo Passo` e `Rota recomendada` concentram as ações; `Sugestões opcionais` só acrescentam alternativas.
8. **Fechamento honesto:** em task/plano, separe `Entregue` de `Pendências`. Nunca chame uma onda parcial de conclusão; sem backlog, declare `Pendências: nenhuma`.

> **Exemplo — feature:** **Próximo Passo:** `08-feature-build.md` — implementar o escopo fechado. **Rota recomendada:** `[condicional] 04/05/06/07 → [obrigatório] 08 → 11 → [condicional] 34 → [obrigatório] code review → [condicional] 17 → [obrigatório] 36 → [opcional] 19`.

---

_Configurado via Agents Hub (v0.10.8)_

---

_Última atualização: 30/08/2026 • v0.10.8_
_Editado via: Claude Code (VS Code) | Modelo: Claude Sonnet 5 | OS: Windows 11_
