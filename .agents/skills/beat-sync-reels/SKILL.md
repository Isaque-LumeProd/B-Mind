---
name: beat-sync-reels
description: Use when editing dynamic music-driven Reels synchronized frame-for-frame to audio beats, 808 drops, speed ramps, punch zooms, kinetic cutout typography, and Premiere/Remotion deliverables based on the user's Instagram references.
metadata:
  origin: user-learned
---

# Beat-Sync Dynamic Reels (Sincronia na Batida + Speed Ramp + Tipografia Cinética)

Padrão de edição dinâmica extraído diretamente das 4 referências aprovadas pelo usuário (`@imvonta_`, `@jackedvisions`, `@lianowb` e `@notkinzz`), para transformar clipes brutos + música em Reels de alto impacto e retenção máxima (`9:16`, `1080×1920`, `30 fps` ou `60 fps`).

## Arquitetura do Fluxo de Trabalho

1. **Mapeamento Matemático das Batidas (`Beat / Onset Detection`):**
   - Converter a trilha de áudio escolhida para PCM `48 kHz` (`ffmpeg.exe`) e detectar picos de energia por janela (bumbos/`808`, caixas/`snare`, *drops* e sílabas rítmicas em músicas *sped-up*) via script Python em quadros inteiros.
   - Gerar um `beat_map.json` contendo o quadro exato (`frame`), o tempo em segundos e a intensidade de cada batida (`kick`, `drop`, `micro_cut`).

2. **Decupagem Visual dos Brutos (`Cut on Action`):**
   - Gerar contact sheets de cada clipe bruto e identificar os trechos de maior movimento físico, ação de câmera ou gesto heroico (descartando preparações estáticas ou tremores finais).
   - Respeitar sempre a checagem de rotação/aspecto (`16:9` vs `9:16`) e a conversão `HLG HDR -> Rec. 709`.
   - **Se houver fala em algum clipe:** nunca apagar o áudio original da fala — manter `A1` vinculada (`<link>`) à `V1`, deixando as batidas musicais em `A2` com ducking apenas sobre a voz. Em edições 100% musicais/B-roll, usar SFX (`Whoosh`, `Riser`, `Sub Impact`) em `A3`/`A4` nas transições chave.

3. **Os 4 Pilares Visuais das Referências:**
   - **Cortes Secos no Grave + *Match on Action* (`@imvonta_`):** trocas exatas no frame do *drop*/808 conectando ações (ex.: mão segurando objeto -> próximo plano já em movimento contínuo).
   - **Speed Ramp Dinâmico + Motion Blur (`@jackedvisions`):** entradas aceleradas (`300%–500%`) durante aproximações ou preparações desacelerando bruscamente para slow-motion (`24fps`/`60fps` suave) no pico do impacto visual, com curvas suaves no Premiere/FFmpeg (`setpts` / Remotion) — **nunca usar `setpts` no `ffmpeg.exe` slim do Windows sem testar filtros**; usar cálculo de frame-stepping ou Remotion `<OffthreadVideo playbackRate={...} />`.
   - **Tipografia Cinética, *Cutout Mask* & *Punch Zoom* (`@lianowb`):**
     - Cortes micro-rítmicos (`0.25s–0.40s`) em passagens rápidas da música;
     - Letras grandes em caixa alta (`Montserrat Black`) atuando como máscara (*track matte*: vídeo rodando dentro das letras sobre fundo escuro) ou em camada atrás/integrada ao assunto;
     - No impacto da batida: *zoom punch* (`scale 1.0 → 1.12` com easing rápido em `4–6 frames`), leve *camera shake* controlado e micro *RGB split* de `2–3 frames` (sem exagero constante).
   - **Tipografia Espacial & Enquadramento Heroico (`@notkinzz`):** palavras curtas (`1–2` por vez) integradas com perspectiva na cena, câmera baixa avançando e tremor seco no travamento da ação principal.

4. **Storyboard Obrigatório Antes do Motion:**
   - Antes de renderizar sequências de *typography mask*, textos 3D/espaciais ou *speed ramps* compostos em Remotion, apresentar primeiro o **Storyboard** mostrando em quais batidas/segundos entram cada take, texto e tipo de transição/animação.

5. **Entregáveis (`Não-Destrutivos`, `_v1`, `_v2`...):**
   - `01_PREMIERE_IMPORTAR_ESTE_XML/` — XML FCP7 XMEML v5 com os clipes já picotados nos frames exatos das batidas (`V1`), textos/cutouts renderizados com alfa (`V2`/`V3`), música na `A2` e SFX na `A3`/`A4` (mais `A1` vinculada se houver fala).
   - `02_MOTION_E_OVERLAYS_ALPHA/` — Overlays de tipografia cinética / máscaras em ProRes 4444 RGBA quando aplicável.
   - `05_PREVIEW_FINAL/` — `.mp4` renderizado pronto para postagem com cortes na batida, curvas de velocidade, *zoom punch* e grade cinematográfica de alto contraste.
