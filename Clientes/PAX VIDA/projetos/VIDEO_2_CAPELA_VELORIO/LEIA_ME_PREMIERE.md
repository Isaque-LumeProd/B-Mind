# PAX VIDA — Vídeo 2: Capela Velório (Guia de Importação Premiere Pro)

## 1. Como abrir a edição pronta no Adobe Premiere Pro
1. No Premiere Pro, acesse **Arquivo > Importar...** (`Ctrl + I`).
2. Selecione o arquivo:
   `01_PREMIERE_IMPORTAR_ESTE_XML/PaxVida_Video2_CapelaVelorio.xml`
3. Abra a sequência criada: **`PaxVida_Video2_CapelaVelorio_9x16`** (`1080x1920`, `30 fps`, duração `23,97s` / `719 frames`).

> **Importante (HDR iPhone → Rec.709 SDR):** os arquivos brutos `.MOV` de iPhone estão em espaço de cor **BT.2020 HLG HDR**. Caso o Premiere os exiba estourados em uma sequência Rec.709, habilite **Auto Tone Map Media** em *Sequence > Sequence Settings* ou clique com o botão direito nos clipes brutos > *Modify > Color > Color Space Override > Rec.709*.

---

## 2. Estrutura de Trilhas na Timeline
- **V1 (Base / A-Roll):**
  - `IMG_7479.MOV` (`00'00" - 00'04"`) — Abertura na fachada Capela Pax Vida
  - `IMG_7482.MOV` (`00'07" - 00'11"`) — Corredor da capela (*"Há quase 20 anos..."*)
  - `IMG_7485.MOV` (Partes A e B: `00'16" - 00'21"` e corte limpo `01'14" - 01'20"` antes da retomada)
  - `IMG_7487.MOV` (`00'01" - 00'06"`) — Fechamento com conforto e planos funerários
  - `IMG_7501.MOV` (tail `24f`) — Saguão moderno no final do CTA
- **V2 (B-Roll cobrindo 100% do trecho `7485` com leitura no celular):**
  - `IMG_7490.MOV` + `IMG_7497.MOV` → Capela velório ampla e moderna
  - `IMG_7506.MOV` → Equipe Pax Vida (*Tanatopraxia*)
  - `IMG_7499.MOV` → Sala de despedida / altar (*Cremação*)
  - `IMG_7341.MOV` → Veículo oficial (*Translado*)
  - `IMG_7373.MOV` → Coroa de flores (*Coroa de flores*)
- **V3 (GCs Transparentes ProRes 4444 + Canal Alfa):**
  - `GC_01_Capela_Moderna.mov` — *Capela Velório / ampla e moderna* (`4,90s`)
  - `GC_02_Tanatopraxia.mov` — *Tanatopraxia* (`2,40s`)
  - `GC_03_Cremacao.mov` — *Cremação* (`0,97s`)
  - `GC_04_Translado.mov` — *Translado* (`1,00s`)
  - `GC_05_Coroa_Flores.mov` — *Coroa de flores* (`0,97s`)
  - `GC_06_WhatsApp_CTA.mov` — *(ícone WhatsApp) (67) 9 9245-4721* (`2,80s`)
- **A1 (Voz Normalizada):** `voz_apresentadora_normalizada.wav` (`-16 LUFS`, cortes limpos e micro-fades)
- **A2 (Trilha Musical):** `bgm_comercial_pax.wav`
- **A3 (SFX Pops):** `sfx_pop_gc.wav` na entrada dos 6 GCs
- **A4 (SFX Whooshes):** `sfx_whoosh.wav` nas viradas visuais (trilha separada sem sobreposição)

---

## 3. Especificações Tipográficas e Visuais
- **Fonte utilizada nos GCs:** **`Montserrat`** (**Black 900** nos títulos/telefone e **ExtraBold 800 / Bold 700** nas pílulas e textos de apoio).
- **Animação:** **Blur-up** centralizado na entrada + **Blur-out** na saída, sem barra de progresso nem etiqueta fixa no topo.
- **Legendas opcionais:** importe `04_LEGENDAS_SRT/PaxVida_Video2_Legendas.srt` na faixa de Captions do Premiere se desejar ajustar fonte/posição livremente.

