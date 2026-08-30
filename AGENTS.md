# 🤖 AI Agents - Inelegis

> **Link do Hub:** `.agent/hub/` (Obrigatório)
> **Modo:** Hub-First & SSoT (Single Source of Truth)
> **Hub Version:** v0.10.9

Este projeto integra o ecossistema Agents Hub. O Agente de IA deve priorizar as definições centralizadas no Hub para comportamento e governança.

> **Convenção de exemplos:** quando este arquivo ou a documentação local mostrar comandos/caminhos de um shell específico, trate isso como **exemplo operacional**, não como contrato exclusivo. A regra geral do ecossistema continua **neutra e cross-platform**.

---

## 🖥️ Identidade & Ambiente Local

- **Objetivo:** Sistema de Consulta de Inelegibilidade Eleitoral para análise jurídica rápida e precisa.
- **Stack:** HTML/JS estático + CSS + Supabase (PostgreSQL) + API Routes serverless na Vercel.
- **OS Context:** Windows 11 (host); pipeline cross-platform.
- **Documentação Local:** `README.md`, `CHANGELOG.md` e `docs/`

---

## 🧠 Governança Local (Injeção de Contexto)

Para garantir a qualidade e o nível sênior de execução, siga as regras do Hub Central em tempo real:

1. **⚓ Âncora de Identidade (Anti-Alucinação):**
   - **MANTATÓRIO:** Antes de agir, valide sua **jurisdição**. Sua atuação é limitada estritamente ao repositório do projeto local.
   - Consulte: Mapeamento de Corpus (`user_information`), `.agent/memory/project-status.md` e o `GEMINI.md` local.
   - 📖 Siga o protocolo em: `.agent/hub/brain/constitution/rule-universal-principles.md` (Seção ⚓).

2. **🚫 Jurisdição de Atuação (Anti-Transgressão):**
   - **MANDATÓRIO:** Você deve agir EXCLUSIVAMENTE dentro da raiz deste projeto. É terminantemente PROIBIDO realizar diagnósticos, auditorias ou edições em outros diretórios visíveis no workspace. Sua única interface externa autorizada é o link `.agent/hub/`.
   - Se o usuário solicitar ações em outros projetos enquanto você estiver instanciado aqui, pare imediatamente e declare **Incompetência de Escopo por Limite de Jurisdição**.

3. **🧭 Diagnóstico Sistêmico (Causa Raiz Real):**
   - Se o gargalo principal não estiver no código, você PODE dizer isso claramente e classificar o achado como `problema no projeto`, `problema no ambiente de desenvolvimento` ou `problema no setup do notebook/host`.
   - Isso inclui casos em shell, IDE, PATH, VS Code, Codex, Git, Node, Windows ou tooling do host.
   - **Limite mantido:** você NÃO pode sair executando mudanças fora da raiz por conta própria. Fora da raiz, só com autorização explícita do usuário e, quando fizer sentido, com o fluxo do Prompt 31 de jurisdição temporária.

4. **Princípios Universais (Comportamento/Comunicação):**
   - 📖 Leia: `.agent/hub/brain/constitution/rule-universal-principles.md`
   - Aplique: Honestidade, Anti-concordância, Regra de Commits (pt-BR) e protocolos de segurança.
   - Responda em português com o resultado e o impacto primeiro; use linguagem simples, frases curtas e termos técnicos somente quando ajudarem.
   - Em conclusões simples ou moderadas, mire cerca de 80–180 palavras e não repita a mesma informação em seções diferentes.
   - Feche respostas técnicas significativas com `Fonte | Ausência | Suposição`. Inclua `Sugestões opcionais` somente para ações adicionais que não repitam o próximo passo ou a rota.

5. **🛡️ Proteção de Dados Destrutivos (Anti-Bypass):**
   - Sem autorização explícita do usuário, não execute `seed`, `reset`, `clear`, `cleanup`, `wipe`, `purge`, `rescue` nem qualquer script/comando que altere ou apague dados em massa.
   - Se o projeto já tiver trava de segurança, é proibido criar script alternativo, alias novo ou outro caminho para contorná-la.
   - Também é proibido editar, remover ou enfraquecer essa trava sem autorização explícita.
   - Ao encontrar um bloqueio, pare, explique a trava e peça autorização.

6. **🛑 Trava Crítica de Comandos Destrutivos:**
   - Sem autorização explícita do usuário, é PROIBIDO executar `git checkout -- <caminho>`, `git restore <caminho>`, `git reset --hard`, `git clean -fd`/`-fx` ou `git stash`/`drop`/`clear` sobre worktree com alterações não commitadas — esses comandos apagam trabalho NÃO commitado e são irreversíveis.
   - Também entram na trava: filesystem destrutivo (`rm -rf`, `rimraf`, `del /s /q`, `Remove-Item -Recurse -Force`) e dados em massa (`seed`, `reset`, `clear`, `cleanup`, `wipe`, `purge`, `rescue`), incluindo equivalentes por GUI, script ou alias.
   - Protocolo obrigatório: **PARE → LISTE** o que será perdido → **PERGUNTE** citando o comando exato → **SÓ EXECUTE** após confirmação explícita do usuário neste turno.
   - 📏 Lista canônica curta (SSoT): `.agent/hub/brain/constitution/rule-critical-safety.md`. Em divergência de lista, a canônica vence.

7. **Personas & Brainstorming:**
   - 🎭 Índice: `.agent/hub/brain/personas/INDEX.md` — descubra o modo pelos triggers e invoque diretamente.
   - ▶️ Invocar: `@.agent/hub/brain/personas/mode-[nome].md` (não carregue a pasta inteira).
   - Siga: Protocolo Socrático antes de qualquer implementação complexa, com uma única rodada de até 3 perguntas em lote.
   - Na mesma resposta das perguntas, inclua sempre uma seção fixa `Respostas recomendadas`.
   - Essa seção deve trazer uma resposta consolidada, curta e pronta para uso, com `Suposição` explícita quando houver incerteza.
   - Se o usuário responder `ok`, `segue`, `pode usar as recomendadas`, `aprovado` ou equivalente, implemente na rodada seguinte sem abrir nova bateria de perguntas.

8. **Capacidades (Skills):**
   - 🛠️ Índice: `.agent/hub/capabilities/SKILLS-INDEX.md` — **antes de implementar lógica nova de um domínio conhecido** (banco, deploy, testes, segurança, `.env`, SEO, i18n, etc.), confira primeiro se existe uma skill aplicável. Não assuma que não existe — o índice é rápido de escanear e evita reinventar um padrão que o Hub já resolveu.
   - ▶️ Invocar: `@.agent/hub/capabilities/[categoria]/[nome]/SKILL.md` (não carregue a pasta inteira).
   - 🔗 Prompt oficial: consulte `executionProfiles.<id>` em `.agent/hub/brain/prompts/prompt-registry.json` e carregue completamente somente as skills vinculadas antes de executar a rodada.
   - 🔐 **`.env.local`/`.env.example`:** ao criar um projeto novo ou organizar/migrar variáveis de ambiente, carregue `@.agent/hub/capabilities/ops/env-setup/SKILL.md` ANTES de escrever qualquer coisa — define o padrão de 8 seções do Hub (template + guia + `env:audit`/`env:reorganize`) e evita reinventar a estrutura a cada satélite.

   - 📚 **Documentação externa:** quando a tarefa depender de API, biblioteca, framework, SDK, runtime, ferramenta ou padrão sujeito a mudança, consulte a fonte oficial atualizada; use `Context7` se estiver disponível e, caso contrário, não bloqueie o fluxo — registre a fonte e a versão utilizadas. `Context7` é documentação versionada, diferente do MCP `context-mode`, que otimiza o uso de contexto.

9. **Operação do Hub no Satélite:**
   - 📘 Leia: `.agent/hub/docs/guides/guide-satellite-hub-operations.md`
   - Use esse guia como leitura base para entender quando aplicar `verify`, `verify:full`, `audit:quality`, `doctor:satellite`, `governance:bootstrap` e os prompts `18`, `19`, `23`, `29` e `33`.
   - Trate `verify` e `verify:full` como governança/integridade; o comando `test` deve continuar reservado à suíte real do produto.
   - Para mudanças funcionais, prefira testes unitários e de integração; E2E/Playwright só entram quando houver justificativa real.
   - Nos scripts principais do Hub, use a linha `Hub vX.X.X` no começo ou no fim da saída para confirmar rapidamente qual pacote de governança o satélite está executando.
   - Para CLIs com descoberta própria de contexto (ex: OMP, em que `.github/copilot-instructions.md` ofusca o `AGENTS.md`), rode `node .agent/hub/system/generators/build-ide.js --target omp` para gerar `.omp/AGENTS.md` + `.omp/RULES.md` (bridge de prioridade máxima + trava crítica sticky). 📖 Detalhes: `.agent/hub/docs/guides/guide-build-ide.md`.

10. **♻️ Reuso Primeiro (Hooks & Helpers):**

- Antes de escrever lógica nova, procure hook, helper ou utilitário equivalente já existente no projeto (`hooks/`, `utils/`, `helpers/`, `lib/`, `services/` ou pastas equivalentes).
- Se a mesma lógica aparecer em 2 ou mais lugares (fetch, validação, formatação, efeitos, acesso a dados), **sempre sugira** a extração para um custom hook (React) ou helper/serviço nomeado — mesmo que a extração fique para uma rodada futura.
- A extração só é aplicada com aprovação explícita do usuário (Regra Máxima de Alteração); sem aprovação, registre a sugestão no checklist final.
- Não abstraia prematuramente: uma ocorrência única não vira helper "por precaução" (YAGNI).
- 📖 Detalhes: `.agent/hub/brain/constitution/rule-universal-principles.md` (Seção "REUSO PRIMEIRO").

---

## 🚫 READ-ONLY HUB ZONE (CRITICAL - VIOLAÇÃO GRAVE)

A pasta `.agent/hub/` é um **Link do Hub Central**. Em Windows, use `junction`; em Linux/WSL, `symlink`. Exemplo canônico do Hub em ambiente Windows nativo: `D:\Agents`.

### ⛔ PROIBIÇÕES ABSOLUTAS

| Ação                                       | Status      | Consequência                  |
| ------------------------------------------ | ----------- | ----------------------------- |
| Editar arquivos em `.agent/hub/`           | ❌ PROIBIDO | VIOLAÇÃO DE MEMÓRIA           |
| Criar arquivos em `.agent/hub/`            | ❌ PROIBIDO | VIOLAÇÃO DE MEMÓRIA           |
| Deletar arquivos em `.agent/hub/`          | ❌ PROIBIDO | VIOLAÇÃO DE MEMÓRIA           |
| Commitar `.agent/hub/`                     | ❌ PROIBIDO | Corrompe o submodule/junction |
| Sugerir `git checkout --` em `.agent/hub/` | ❌ PROIBIDO | Comando destrutivo            |

### ✅ AÇÕES PERMITIDAS

- **LER** arquivos do Hub para consulta de regras
- **USAR** personas e skills do Hub
- **REFERENCIAR** documentação do Hub

### 🔴 Exemplos de VIOLAÇÕES (NUNCA FAÇA ISSO)

```bash
# ❌ VIOLAÇÃO: Editar arquivo do Hub
edit .agent/hub/brain/personas/mode-backend.md

# ❌ VIOLAÇÃO: Commitar o Hub
git add .agent/hub/
git commit -m "atualizar hub"

# ❌ VIOLAÇÃO: Comandos destrutivos no Hub
git checkout -- .agent/hub/
git restore .agent/hub/
```

### ✅ Como Alterar Regras do Hub

1. **Navegue** até o repositório original do Hub (exemplo canônico em Windows nativo: `D:\Agents`)
2. **Faça** as alterações lá
3. **Commit e push** no repositório do Hub
4. **Sincronize** nos satélites (se necessário)

### 📁 Memória Local

Use `.agent/memory/` para armazenar informações **deste** projeto:

- `project-status.md` - Estado atual, fase e objetivos do projeto
- `gotchas.md` - Problemas conhecidos e workarounds descobertos (consulte no início de cada sessão)
- `tasks/` - Planejamento de tarefas complexas e roadmaps
- `templates/` — Via link do Hub: `.agent/hub/memory/templates/` (ADRs, preferências, gotchas)
- `ui-patterns.md` — Registro de padrões canônicos de UI (header, busca+filtros, paginação, etc.), gerado sob demanda pela skill `page-composition-consistency` quando o projeto tem páginas frontend do mesmo tipo — sem template próprio, a skill cria na primeira vez que precisar

---

## 🎭 Modos de Operação Disponíveis

Ative o modo especialista para a tarefa atual. Cole `@modo` no chat ou use `/comando` em IDEs com slash commands.

| Modo                 | Quando Usar                                     | Ativar (Cursor)       | Ativar (VSCode/TRAE) |
| -------------------- | ----------------------------------------------- | --------------------- | -------------------- |
| `mode-frontend`      | React, Next.js, CSS, componentes UI             | `@mode-frontend`      | `/frontend`          |
| `mode-backend`       | API, banco de dados, Node.js, Python            | `@mode-backend`       | `/backend`           |
| `mode-security`      | Auditoria de segurança, OWASP, vulnerabilidades | `@mode-security`      | `/security`          |
| `mode-debugger`      | Investigação de bugs, causa raiz                | `@mode-debugger`      | `/debugger`          |
| `mode-planner`       | Planejamento técnico, roadmap, ADRs             | `@mode-planner`       | `/planner`           |
| `mode-quality`       | Testes, cobertura, refatoração limpa            | `@mode-quality`       | `/quality`           |
| `mode-devops`        | CI/CD, deploy, infra, Docker                    | `@mode-devops`        | `/devops`            |
| `mode-orchestrator`  | Tarefas complexas multi-domínio                 | `@mode-orchestrator`  | `/orchestrator`      |
| `mode-architect`     | Design de sistema, decisões de arquitetura      | `@mode-architect`     | `/architect`         |
| `mode-git`           | Commits, branches, PR, histórico                | `@mode-git`           | `/git`               |
| `mode-documentation` | Docs técnicos, READMEs, guias                   | `@mode-documentation` | `/documentation`     |
| `mode-mobile`        | React Native, Flutter, apps mobile              | `@mode-mobile`        | `/mobile`            |
| `mode-code-reviewer` | Code review, boas práticas, qualidade de PR     | `@mode-code-reviewer` | `/code-reviewer`     |

> Arquivos completos em `.agent/hub/brain/personas/` (via link do Hub — READ-ONLY).
> Em TRAE: `npm run build:ide:trae` no Hub gera `.trae/rules/project_rules.md` (constituição, injetada em toda sessão) e uma Skill por modo em `.trae/skills/<slug>/SKILL.md` (carregada só quando a tarefa exigir). Peça pelo modo (ex.: `backend`) para o Trae carregar a Skill.
> Em Claude Code CLI: use este `AGENTS.md` como fonte canônica (bridge opcional `CLAUDE.md` via `npm run build:ide:claude` no Hub).
> Em Kiro, Codex, Gemini CLI, Grok Build, OpenCode e Google Antigravity: o contexto persistente vem de `AGENTS.md` ou `GEMINI.md`, conforme o harness. Rode o target correspondente para receber uma Skill por modo. Codex, Gemini e Antigravity convergem em `.agents/skills/`; Kiro, Grok e OpenCode mantêm seus caminhos próprios documentados em `guide-build-ide.md`.
> Em OMP (também conhecido como oh-my-pi): rode `npm run build:ide:omp` para o bridge de contexto e a trava crítica sticky — ver `guide-build-ide.md` para o porquê.

---

## 🧠 Abertura de Sessão — consulte o estado antes de propor trabalho (OBRIGATÓRIO)

Na primeira resposta de cada sessão:

```powershell
node .agent/hub/system/scripts/hub-state.js --project .
```

Devolve, numa chamada: tasks abertas com estado real, coerência entre versão declarada / CHANGELOG / log de sessão, e se a telemetria deste projeto está perdendo histórico.

**Consulte internamente e em silêncio.** Não peça ao usuário para rodar o comando, e **não relate quando não há pendência** — anunciar "está tudo certo" a cada sessão vira ruído, e ruído treina todo mundo a ignorar o aviso que importa. Mencione só o que estiver pendente.

Se um coletor falhar, o campo vem como `unavailable` com o motivo. **Ausência de achado não é prova de que não há trabalho** — só das dimensões observadas.

**Documentação externa junto:** quando a tarefa depender de comportamento versionado de biblioteca, framework, SDK ou runtime, consulte a documentação atual antes de decidir. Conhecimento de treinamento envelhece; contrato de biblioteca muda sem avisar.

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
8. **Fechamento honesto:** se houver task/plano, separe `Entregue` de `Pendências`; nunca chame uma onda parcial de conclusão. Com pendência, mostre próximo passo e rota. Sem pendência, declare `Pendências: nenhuma`.

> **Exemplo — feature:** **Próximo Passo:** `08-feature-build.md` — implementar o escopo fechado. **Rota recomendada:** `[condicional] 04/05/06/07 → [obrigatório] 08 → 11 → [condicional] 34 → [obrigatório] code review → [condicional] 17 → [obrigatório] 36 → [opcional] 19`.

---

## 🏷️ Assinatura de Edição (Doc Signature)

Ao alterar qualquer documento Markdown neste projeto, o agente DEVE adicionar/atualizar a assinatura no footer:

```markdown
_Última atualização: DD/MM/AAAA • vX.Y.Z_
_Editado via: [IDE ou CLI] | Modelo: [modelo] | OS: [sistema operacional]_
```

Para docs com frontmatter YAML, usar campos no frontmatter (sem duplicar no footer):

```yaml
last-edited: DD/MM/AAAA
last-edited-via: [IDE ou CLI]
last-edited-model: [modelo]
last-edited-os: [sistema operacional]
```

---

## 🚫 PUBLIC/ASSETS/JS/ É READ-ONLY (CRITICAL)

A pasta `public/assets/js/` é **gerada automaticamente** pelo script `sync-js.js` a partir de `src/js/`.

### ⛔ PROIBIÇÕES ABSOLUTAS

| Ação                                   | Status      | Consequência                                |
| -------------------------------------- | ----------- | ------------------------------------------- |
| Editar arquivos em `public/assets/js/` | ❌ PROIBIDO | Alteração será sobrescrita no próximo build |
| Criar arquivos em `public/assets/js/`  | ❌ PROIBIDO | Arquivo será sobrescrito ou ignorado        |

`public/assets/js/supabase-config.js` também é gerado (via `npm run supabase:config` a partir das env vars) e não é versionado.

### ✅ O QUE FAZER

| Ação                            | Caminho Correto         |
| ------------------------------- | ----------------------- |
| Editar JavaScript               | `src/js/**/*.js`        |
| Editar HTML                     | `public/*.html`         |
| Editar CSS                      | `public/styles/*.css`   |
| Editar imagens/assets estáticos | `public/assets/images/` |

### 🔴 Fluxo SSoT (Single Source of Truth)

```
src/js/  ←── SSoT (EDITE AQUI)
   ↓ sync-js.js (copia automaticamente)
public/assets/js/  ←── DESTINO (NÃO EDITE)
   ↓ build.js (copia para produção)
dist/  ←── PRODUÇÃO (Vercel serve daqui)
```

### 🔴 Exemplos de VIOLAÇÕES (NUNCA FAÇA ISSO)

```bash
# ❌ VIOLAÇÃO: Editar JS no destino
edit public/assets/js/components/components.js

# ❌ VIOLAÇÃO: Editar admin JS no destino
edit public/assets/js/admin/auth-service.js
```

### ✅ Exemplos CORRETOS

```bash
# ✅ CORRETO: Editar JS na fonte
edit src/js/components/components.js

# ✅ CORRETO: Editar admin JS na fonte
edit src/js/admin/auth-service.js

# ✅ CORRETO: Editar HTML (estes NÃO têm SSoT em src/)
edit public/index.html
edit public/consulta.html
```

### ⚠️ LIÇÕES APRENDIDAS (HISTÓRICO DE VIOLAÇÕES)

> **2026-02-11:** Agente editou `public/assets/js/` ao invés de `src/js/`. O script `sync-js.js` sobrescreveu as mudanças. **Correção perdida.**

> **2026-02-13:** O MESMO erro aconteceu novamente em outra sessão. A IA editou `public/assets/js/components/components.js` múltiplas vezes, mas o build sempre sobrescrevia. A causa raiz (arquivo em `src/js/`) só foi identificada após perda significativa de tempo. **SEMPRE VERIFIQUE O FLUXO DE BUILD ANTES DE EDITAR QUALQUER JS.**

---

_Última atualização: 30/08/2026 • v0.10.9_
_Editado via: Claude Code (VS Code) | Modelo: Claude Sonnet 5 | OS: Windows 11_
