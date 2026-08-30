<!--
  AUTO-GERADO por system/generators/build-ide.js (--target omp)
  NÃO edite este arquivo manualmente. Toda execução do target omp SOBRESCREVE sem aviso.
-->

> Slot sticky do OMP: re-anexado perto do turno atual a cada rodada.
> Fonte canônica: `.agent/hub/brain/constitution/rule-critical-safety.md` (Hub).

# 🛑 Trava Crítica de Comandos Destrutivos (Safety Floor)

> **SSoT operacional anti-destruição.** Fonte canônica injetada em slots de alta prioridade dos harnesses/CLIs (ex: `.omp/RULES.md`) e referenciada pela governança de satélites.
> **Mantenha este arquivo curto:** em slots sticky ele é re-anexado perto do turno a cada rodada — cada token custa em toda sessão.
> Doutrina completa: `rule-universal-principles.md` (protocolos destrutivos). Em divergência de lista, ESTA lista vence.

---

## ❌ OPERAÇÕES PROIBIDAS SEM AUTORIZAÇÃO EXPLÍCITA DO USUÁRIO

### Git destrutivo de worktree (apaga trabalho NÃO commitado)

- `git checkout -- <caminho>` / `git checkout HEAD -- <caminho>` / `git restore <caminho>` (qualquer forma)
- `git reset --hard` (qualquer forma)
- `git clean -fd` / `git clean -fx` (qualquer `git clean` com força)
- `git stash` / `git stash drop` / `git stash clear` sobre worktree com alterações não commitadas
- Equivalentes por GUI, script, alias ou automação

### Filesystem destrutivo

- `rm -rf` / `rm -fr` / `rimraf` / `del /s /q` / `Remove-Item -Recurse -Force` sobre conteúdo não versionado

### Dados em massa

- `seed`, `reset`, `clear`, `cleanup`, `wipe`, `purge`, `rescue` e equivalentes que alterem ou apaguem dados em massa

### Anti-bypass

- ❌ Criar script alternativo, alias novo, SQL avulso ou automação paralela para contornar uma trava de segurança existente.
- ❌ Editar, remover ou enfraquecer guardrails de segurança sem autorização explícita.

---

## 🔐 SEGREDO NUNCA SAI DO ARQUIVO

> Vazar credencial não custa um `git revert`. Custa rotação **manual** em `.env.local`, Vercel,
> GitHub, Google Auth, Resend, banco e cada serviço restante — um a um, no painel de cada um.
> Nenhum agente pode apresentar rotação como passo trivial do usuário.

### ❌ PROIBIDO — sem exceção, e nenhuma autorização torna isto aceitável

- Imprimir valor de credencial, token, chave, senha, `DATABASE_URL` ou connection string em **resposta de chat, log, commit, PR, issue, telemetria ou nome de arquivo**.
- Rodar comando que despeje segredo na saída: `cat .env*`, `Get-Content .env*`, `printenv`, `env`, `echo $TOKEN`, `git show` de arquivo de segredo.
- Mascarar em parte e mostrar assim mesmo (`sk-…a1b2`): o sufixo identifica a chave e o valor inteiro continua no histórico da sessão.
- Copiar valor de segredo entre arquivos, projetos ou mensagens "só para conferir".
- Gravar valor real em arquivo rastreado pelo Git, ainda que com intenção de remover depois.

### ✅ COMO TRABALHAR COM `.env` SEM LER VALOR

- Saber se a variável existe: liste **só as chaves** — `grep -o '^[A-Z_][A-Z0-9_]*' .env.local`. Nunca `cat`.
- Comparar ambientes: compare **conjuntos de chaves**, jamais valores.
- Precisa de exemplo: use `.env.example` com placeholder.
- "O valor deve estar errado" é hipótese, não fato: peça ao usuário conferir, não leia para confirmar.

### 🚨 SE VAZOU — é incidente, não observação de rodapé

1. **PARE** a tarefa em curso; não a conclua "e depois avisa".
2. **DIGA no primeiro parágrafo**: o que vazou, onde apareceu (chat, commit, log) e desde quando.
3. **LISTE serviço por serviço** o que precisa de rotação, com o passo concreto de cada painel. Nunca escreva apenas "rotacione as credenciais".
4. Se foi para o **Git**: avise que apagar o arquivo NÃO invalida a chave — o valor fica no histórico e a rotação é obrigatória mesmo em repositório privado.
5. **Não retome** a tarefa original antes da resposta do usuário.

> Gate mecânico: `npm run lint:secrets` (staged, roda no pre-commit). Ele cobre o caminho do
> commit. O caminho do chat **não tem gate possível** — depende desta regra.

---

## ✅ PROTOCOLO OBRIGATÓRIO (nesta ordem)

1. **PARE.** Não execute no impulso, mesmo com pedido ambíguo do usuário.
2. **LISTE** exatamente o que será perdido (arquivos, alterações não commitadas, dados).
3. **PERGUNTE** ao usuário citando o comando exato e a perda esperada.
4. **SÓ EXECUTE** após confirmação explícita do usuário neste turno.

> Trava encontrada é sinal para interromper — nunca para improvisar.
