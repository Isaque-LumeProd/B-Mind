---
name: end
description: Use when the user types /end or asks to finish the work session, update handoff state, verify safety, commit everything cleanly, and push to GitHub for syncing across computers.
metadata:
  origin: user-custom
---

# /end — Encerramento de Sessão & Sync para o Git

Workflow executado sempre que o usuário chamar `/end` para finalizar a sessão de trabalho e enviar tudo ao repositório `origin/main` para continuar no outro computador.

## Passos Obrigatórios

1. **Atualizar o registro de continuidade (`HANDOFF_SESSAO.md`):**
   - Leia `d:\Antigravity 3.0\HANDOFF_SESSAO.md` (se existir) para **preservar** o histórico resumido sem apagar referências importantes de projetos ativos.
   - Atualize a seção **Sessão Mais Recente** com:
     - Data/hora atual e nome do computador (`$env:COMPUTERNAME`).
     - Clientes/projetos trabalhados nesta sessão (caminhos relativos ao workspace).
     - Arquivos novos ou versões criadas (`_v2`, `_v3`, etc.).
     - Pendências, próximos passos exatos e se houve render pesado (`.mov`/`.mp4`) gerado localmente que precise ser copiado via Drive/HD para o outro PC.

2. **Verificação rápida de segurança e integridade:**
   - Execute `git status --short` na raiz `d:\Antigravity 3.0`.
   - Se houver alteração em `.ts`/`.tsx` dentro de `Operacional/video-seguranca-residencial`, rode `npx.cmd tsc --noEmit` lá antes de commitar.
   - Confirme que **nenhum** arquivo sensível (`.env`, `.key`, `.pem`, tokens) nem arquivo `> 90 MB` está listado fora do `.gitignore` (`git ls-files --others --exclude-standard` + arquivos modificados). Se detectar qualquer arquivo `> 50 MB` rastreável ou segredo, **PARE** e avise o usuário antes de comitar.

3. **Commit e Push seguro para `origin/main`:**
   - Rode na raiz do workspace (`d:\Antigravity 3.0`):
     ```powershell
     git add -A
     ```
   - Se houver alterações staged (`git diff --cached --quiet` retornar diferente de `0`):
     ```powershell
     $ts = Get-Date -Format "yyyy-MM-dd HH:mm"
     git commit -m "chore(session): encerra sessao $ts ($env:COMPUTERNAME)"
     ```
   - Busque atualizações remotas e envie sem nunca usar `--force`:
     ```powershell
     git pull --rebase origin main
     git push origin main
     ```
     *(Nota: no PowerShell, faça checagem do `$LASTEXITCODE`; se houver conflito no `rebase`, aborte ou pause e peça orientação ao usuário).*

4. **Confirmação Final:**
   - Rode `git status -sb` e `git log -1 --oneline`.
   - Responda em português confirmando:
     - O hash do commit enviado para `origin/main` (ou que já estava 100% sincronizado).
     - Que [HANDOFF_SESSAO.md](file:///D:/Antigravity%203.0/HANDOFF_SESSAO.md) foi atualizado.
     - Eventual aviso se foram gerados novos `.mov`/`.mp4` nesta sessão para copiar por Drive/HD.
