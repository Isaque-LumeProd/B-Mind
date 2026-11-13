---
name: start-mind
description: Use when the user types /start-mind or opens a new session on either computer to pull the latest Git changes, verify local workspace links and dependencies, and resume exactly from where the last session ended.
metadata:
  origin: user-custom
---

# /start-mind — Abertura de Sessão & Retomada do Trabalho

Workflow executado sempre que o usuário chamar `/start-mind` para sincronizar este computador com o repositório remoto e retomar exatamente de onde parou.

## Passos Obrigatórios

1. **Puxar atualizações do Git (`origin/main`):**
   - Na raiz `d:\Antigravity 3.0`, execute:
     ```powershell
     git fetch origin
     git status -sb
     ```
   - Se a working tree estiver limpa, rode `git pull --ff-only origin main`.
   - Se houver mudanças locais não commitadas neste PC, avise brevemente e rode `git pull --rebase --autostash origin main` (se ocorrer conflito, pare e mostre os arquivos em conflito sem sobrescrever nada).

2. **Verificar integridade local do ambiente (2º PC / atalhos / dependências):**
   - Cheque se existem:
     - `Mind\Agentes`, `Mind\Regras`, `Mind\Skills`, `Mind\Workflows` (junctions)
     - `Operacional\ECC`, `Operacional\lemo-opuscar`, `Operacional\vercel-skills`
     - `Operacional\video-seguranca-residencial\node_modules`
   - Se **qualquer** desses itens faltar neste computador, execute automaticamente:
     ```powershell
     .\setup_segundo_pc.ps1
     ```
   - Cheque também se `Video Pax\` existe localmente (necessário caso vá renderizar ou abrir XMLs da Pax Vida no Premiere deste PC).

3. **Carregar contexto de continuidade:**
   - Leia [HANDOFF_SESSAO.md](file:///D:/Antigravity%203.0/HANDOFF_SESSAO.md).
   - Leia [learned-preferences.md](file:///D:/Antigravity%203.0/.agents/rules/learned-preferences.md).
   - Rode `git log -5 --oneline` para ver as últimas sessões.

4. **Apresentar ponto de retomada:**
   - Responda em português de forma clara e objetiva com:
     - Status do `git pull` (se puxou novos commits ou já estava em dia).
     - Status do ambiente local (`Mind/`, dependências, presença dos brutos `Video Pax/`).
     - **De onde paramos:** resumo da última sessão registrada no `HANDOFF_SESSAO.md` e próximos passos prontos para continuar.
