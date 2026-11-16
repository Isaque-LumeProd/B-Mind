# Pacote Editável Adobe Premiere Pro — Vídeo Academia 16:9 (`@imvonta_` Moody 808)

## O que contém esta pasta
- `01_PREMIERE_IMPORTAR_ESTE_XML/VideoAcademia_BeatSync_16x9.xml` — Timeline FCP7 XMEML v5 (`1920x1080`, `30 fps`, `79,50s` = `2.385 frames`, 40 cortes no beat).
- `03_AUDIO_TRILHA_E_SFX/` — Trilha `bgm_babydoll_16x9.wav` (48 kHz estéreo, normalizada a `-14 LUFS`) + 3 SFX desenhados (`sfx_whoosh.wav`, `sfx_riser.wav`, `sfx_sub_impact.wav`).
- `05_PREVIEW_FINAL/VideoAcademia_BeatSync_16x9.mp4` — Render master em H.264 Rec.709 com speed ramps `60fps -> 30fps`, zoom punches, camera shake e RGB split do **Pilar 1 (`@imvonta_`)**.

## Como importar no Adobe Premiere Pro
1. Crie um novo projeto no Premiere Pro (ou abra um existente).
2. Vá em **File > Import...** (`Ctrl+I`) e selecione `01_PREMIERE_IMPORTAR_ESTE_XML/VideoAcademia_BeatSync_16x9.xml`.
3. O Premiere importará a sequência **`VideoAcademia_BeatSync_16x9`** já com:
   - **V1**: 40 clipes brutos originais em 4K (`3840x2160`) escalonados automaticamente (`Scale = 50%`) para `1920x1080`, sincronizados nos beats e marcadores de Ato (`ATO 1` a `ATO 5`). Apenas trechos aprovados (você de blusa verde `BERZERK` + takes sem pessoas).
   - **A1**: Áudio original das câmeras linkado aos clipes de `V1`, atenuado para `-22 dB` para manter respiro ambiente controlado.
   - **A2**: Trilha `bgm_babydoll_16x9.wav` masterizada.
   - **A3**: `sfx_whoosh.wav` e `sfx_riser.wav` nas viradas e pré-drops.
   - **A4**: `sfx_sub_impact.wav` nos drops principais (`ATO 2`, micro-corte força, `ATO 4`, clímax `ATO 5`).

## Atenção: Clipes HLG HDR (iPhone `IMG_2948` a `IMG_2960`)
Os clipes da câmera principal na raiz (`IMG_2948`–`IMG_2960`) foram gravados em **HLG HDR (`arib-std-b67` / BT.2020)**. Se ficarem lavados ou estourados no Premiere:
- Clique com o botão direito neles no painel Project > **Modify > Color** > habilite **Color Space Override: Rec. 709** ou ative **Auto Tone Map Media** em *Sequence Settings*.

## Replicando o acabamento Pilar 1 (`@imvonta_`) no Premiere
O XML entrega os cortes secos e marcadores exatamente nas batidas sem travar curvas complexas de *Time Remap*. Para ajustar ou personalizar no Premiere:
- **Look Moody (`@imvonta_`)**: Crie uma *Adjustment Layer* sobre `V1` com Lumetri Color (`Contrast +15`, `Highlights -12`, `Shadows -10`, `Saturation 90`, `Vignette -1.0`).
- **Speed Ramps 60fps (`cel renan/IMG_3955–3974`)**: Os clipes do celular secundário são `60fps` reais; selecione os momentos rápidos (drops e micro-cortes) > botão direito > **Show Clip Keyframes > Time Remapping > Speed** para reproduzir as acelerações com fluidez de 50% slow-mo.
- **Zoom Punch / Shake / RGB Split**: Nos drops (`c07`, `c11`, `c24`, `c35`, `c39`), adicione keyframe rápido de `Scale` (`112% -> 100%` em 5 frames) ou *VR Chromatic Aberration* nos 2 primeiros frames.
