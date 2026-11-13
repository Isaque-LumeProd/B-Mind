# Operacional — Motores e Bibliotecas Internas (Não Alterar)

Esta pasta reúne as ferramentas internas, códigos-fonte e repositórios de apoio usados pelo assistente para renderizar gráficos, processar vídeo/áudio e construir timelines. **Evite editar ou apagar arquivos aqui manualmente.**

## Conteúdo
- `video-seguranca-residencial/` — Projeto **Remotion** ativo responsável pela renderização dos GCs em ProRes 4444 com Canal Alfa e previews MP4 (inclui os códigos de composição da **Pax Vida** em `src/paxvida/`, `src/paxvida_v2/` e `src/paxvida_shared/`).
- `lemo-opuscar/` — Repositório base de direção de motion design orgânico e sistema de câmera.
- `ECC/` — Conjunto base do framework Everything Claude Code (fonte de agentes, hooks e regras).
- `vercel-skills/` — Repositório de skills instaladas.
- `roteiros/` — Roteiros e rascunhos de produção anteriores já finalizados.

> Nota de sistema: a pasta oculta `.agents/` na raiz permanece vinculada em tempo real pela pasta `Mind/` para que o ambiente Antigravity continue carregando todas as regras e skills automaticamente.

