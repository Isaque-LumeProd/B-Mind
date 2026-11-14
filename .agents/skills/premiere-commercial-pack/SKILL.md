---
name: premiere-commercial-pack
description: Use when editing raw video footage into a paid-traffic commercial with Adobe Premiere Pro deliverables, FCP7 XMEML timeline export, transparent ProRes 4444 alpha GCs, normalized audio, SRT captions, and an SDR preview render.
metadata:
  origin: user-learned
---

# Pacote de Edição Comercial para Adobe Premiere Pro

Padrão aprovado para transformar vídeos brutos (`.MOV`) em comerciais verticais (`9:16`, `1080×1920`, `30 fps`) prontos para importação no Adobe Premiere Pro sem alterar os originais.

## Estrutura Obrigatória de Entregáveis

```text
EDICAO_<NOME_PROJETO>/
├── 01_PREMIERE_IMPORTAR_ESTE_XML/
│   └── <Projeto>.xml                 # FCP7 XMEML v5 (timebase 30)
├── 02_GCS_TRANSPARENTES_ALPHA/
│   └── GC_01_...mov                  # Apple ProRes 4444 RGBA (yuva444p10le/12le)
├── 03_AUDIO_TRILHA_E_SFX/
│   ├── voz_apresentadora_normalizada.wav  # -16 LUFS, 48kHz stereo
│   ├── bgm_...wav
│   └── sfx_...wav
├── 04_LEGENDAS_SRT/
│   └── <Projeto>_Legendas.srt
├── 05_PREVIEW_FINAL/
│   └── <Projeto>_Preview_SDR.mp4     # Gabarito visual em Rec. 709 SDR
└── LEIA_ME_PREMIERE.md               # Instruções de importação + nota HLG -> Rec. 709
```

## Regras de Construção e Qualidade

1. **Fonte única de verdade em quadros inteiros (`30 fps`):**
   - Definir todos os cortes de A-roll, B-roll, GCs e legendas `.srt` a partir de uma única especificação de quadros para evitar qualquer dessincronização entre XML, áudio master e preview.
2. **Storyboard de Motion & GCs transparentes puros (`V3` / inserts `V2`):**
   - **Storyboard antes do render:** sempre que criar animações em motion (inserts explicativos para `V2` ou GCs novos), apresentar primeiro um **Storyboard** explicando cena por cena: trecho de fala/timing, elementos em tela e exatamente como cada animação entra, se movimenta e sai.
   - Renderizar cada GC individualmente com `--codec=prores --prores-profile=4444 --image-format=png --pixel-format=yuva444p10le`.
   - Os arquivos `.mov` exportados para o Premiere **não** devem conter fundo/slate opaco em tela cheia por padrão (flags como `showEndSlate` devem ter `false` como padrão na composição avulsa e `true` apenas no preview, se necessário).
   - Aplicar **centralização horizontal**, animação **`blur-up`** e tipografia **`Montserrat`** (`Black`/`ExtraBold`).
3. **XML FCP7 XMEML v5 limpo para Premiere:**
   - Vincular os `.MOV` originais via URL `file://localhost/...` na `V1` (A-roll) e `V2` (cobertura B-roll). Caso os brutos não possuam B-rolls suficientes ou específicos, gerar novos inserts para a `V2` usando o **Gemini** (`image-generator` / Gemini API para cenas realistas ou específicas) ou **inserts de Motion Graphics** no Remotion (quando decidido pelo agente ou pelo usuário).
   - **Orientação Horizontal (`16:9`) vs. Vertical (`9:16`) e rotação real:** identificar explicitamente o formato da sequência alvo (`1920×1080` horizontal vs. `1080×1920` vertical) e inspecionar `side_data_list` / `rotation` (`-90°`, `90°`, `270°`) via `ffprobe` para calcular as dimensões de exibição reais (`2160×3840` vs. `3840×2160`) e o `Scale` exato (`50` em 4K vertical para `1080×1920`) sem miniaturizar nem distorcer planos.
   - **Nunca apagar o áudio original de fala na timeline do Premiere:** colocar na `A1` o áudio original de cada clipe de fala `.MOV` **vinculado bidirecionalmente (`<link>`)** ao respectivo `<clipitem>` da `V1` (mesmos `in`/`out`/`start`/`end`), evitando depender apenas de WAV único desvinculado; usar faixas separadas sem sobreposição para `BGM` (`A2`), `SFX Pop` (`A3`) e `SFX Whoosh` (`A4`).
   - **Atributos e metadados XMEML estritos:** garantir que todo `id="..."` em `<sequence>`, `<clipitem>` e `<file>` seja atributo XML real (nunca texto literal), que `out`/`end` de cada áudio/SFX nunca excedam a duração real do `.wav`, e declarar `<alphatype>straight</alphatype>` nos ProRes 4444.
   - Ao corrigir ou revisar entregas já criadas, **nunca sobrescrever ou apagar versões anteriores** — gerar nova versão (`_v2.xml`, etc.) preservando as anteriores.
   - Documentar no `LEIA_ME_PREMIERE.md` a conversão de cor `HLG HDR -> Rec. 709` caso o Premiere exiba imagens superexpostas.
4. **Validação antes de entregar:**
   - Validar o XML bem-formed, ausência de tags malformadas, ausência de sobreposição temporal na mesma faixa, validade dos `<link>` entre `V1` e `A1` e existência em disco de todas as `<pathurl>`.
   - Verificar canal alpha em todos os `.mov` via `ffprobe` (`pix_fmt` contendo `a`, ex.: `yuva444p12le`).
   - Inspecionar visualmente quadros-chave do preview MP4 para garantir zero obstrução de rosto/mãos e topo limpo.

