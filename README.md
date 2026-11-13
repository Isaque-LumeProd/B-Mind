# Workspace B-Mind (Antigravity 3.0)

Repositório central de trabalho sincronizado entre dois computadores:

- **`Mind/`** — Agentes, Regras e Skills conectados a `.agents/` (inclui preferências aprendidas).
- **`Clientes/`** — Pastas individuais por cliente com `IDENTIDADE_VISUAL.md`, `REGRAS_ESPECIFICAS.md`, ativos compartilhados e subpasta `projetos/` (XMLs Premiere, legendas `.srt`, guias e áudios `.wav`).
- **`Operacional/`** — Motor Remotion (`video-seguranca-residencial/`) e repositórios de apoio (não editar manualmente).
- **`Ideias/`** — Área reservada para novos projetos e roteiros.

> **O que fica fora do Git (sincronizar por Drive / HD externo):** arquivos brutos de câmera (`Video Pax/`), `.mov` ProRes 4444 e `.mp4` renderizados para manter o repositório leve e rápido.

---

## Como configurar no 2º Computador (Windows)

1. Clone o repositório (preferencialmente no mesmo caminho `D:\Antigravity 3.0` para compatibilidade imediata dos XMLs do Premiere):
   ```powershell
   git clone https://github.com/Isaque-LumeProd/B-Mind.git "D:\Antigravity 3.0"
   ```
2. Copie as pastas de mídia pesada (`Video Pax/` e os `.mov`/`.mp4` de `Clientes/`) do Drive/HD para o mesmo caminho.
3. Execute o script de configuração inicial para recriar os atalhos (`Mind/`, `00_BRUTOS_ORIGINAIS`), clonar repositórios de apoio e instalar `node_modules`:
   ```powershell
   cd "D:\Antigravity 3.0"
   .\setup_segundo_pc.ps1
   ```
4. No uso diário entre os dois PCs:
   - Ao sentar no PC: digite `/start-mind` (ou rode `git pull`) para puxar as novidades e carregar o contexto salvo em `HANDOFF_SESSAO.md`
   - Ao encerrar alterações: digite `/end` (ou rode `git add .` → `git commit -m "chore: atualiza projetos"` → `git push`)

