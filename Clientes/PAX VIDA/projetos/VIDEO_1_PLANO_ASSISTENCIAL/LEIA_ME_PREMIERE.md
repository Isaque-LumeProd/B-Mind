# Pacote de Edição — Vídeo 1: Plano Assistencial (Pax Vida)

Pasta organizada e pronta para importar no **Adobe Premiere Pro** com cortes exatos sincronizados à fala (sem o "dois, três e"), cobertura de B-roll nos trechos de leitura de celular, **6 GCs em Apple ProRes 4444 com fundo transparente (Canal Alpha)**, áudio normalizado (`-16 LUFS`), trilha comercial, SFX e legendas `.srt`.

## Como importar no Adobe Premiere Pro

1. Abra seu projeto no Adobe Premiere Pro (ou crie um novo).
2. Vá em **`Arquivo > Importar...`** (`Ctrl+I`).
3. Selecione o arquivo:
   `01_PREMIERE_IMPORTAR_ESTE_XML/PaxVida_Video1_PlanoAssistencial.xml`
4. Abra a sequência importada **`PaxVida_Video1_PlanoAssistencial_9x16`** (`1080×1920`, `30 fps`, duração `30s24f`).
5. *(Opcional)* Arraste `04_LEGENDAS_SRT/PaxVida_Video1_Legendas.srt` para o painel do Premiere e coloque na trilha de legendas caso deseje ajustar fonte/estilo nativo de legenda.

## Organização das Trilhas na Timeline

- **V1 (Apresentadora + Encerramento):** Cortes originais `IMG_7457`, `7461`, `7466`, `7469`, `7471`, `7472`, `7474` e `7346` (no final).
- **V2 (Cobertura B-roll):**
  - Cobrindo `IMG_7466` (leitura de celular): **Sede Pax Vida** (`IMG_7341`, `7344`, placa `+ de 20 especialidades médicas` `IMG_7348` e recepção `IMG_7367`).
  - Cobrindo `IMG_7472` (leitura de celular): **Capela Velório** (`IMG_7493`, interior `IMG_7495` e coroa de flores/Sala de Homenagem `IMG_7372`).
- **V3 (GCs Transparentes ProRes 4444 RGBA):**
  - `GC_01_Mensalidade.mov` — Mensalidade R$ 65,00
  - `GC_02_Desconto_Saude.mov` — Desconto em serviços de saúde
  - `GC_03_Dependentes.mov` — 8 dependentes
  - `GC_04_Isencao_Carencia.mov` — Isenção de carência
  - `GC_05_Assistencia_Funeraria.mov` — Assistência funerária completa
  - `GC_06_WhatsApp_CTA.mov` — (ícone WhatsApp) (67) 9 9245-4721 + cartão final
- **A1:** `voz_apresentadora_normalizada.wav` (voz limpa, cortes já suavizados em `-16 LUFS`).
- **A2:** `bgm_comercial_pax.wav` (trilha comercial já ajustada em `-17 dB`).
- **A3:** Efeitos `sfx_pop_gc.wav` e `sfx_whoosh.wav` nas entradas dos GCs e transições de B-roll.

## Nota importante sobre Cor (iPhone HDR HLG -> Rec. 709)

Os arquivos originais `.MOV` foram gravados em **iPhone 10-bit HLG HDR (`Rec. 2100 HLG`)**. Se no monitor do Premiere as imagens originais parecerem estouradas/claras demais:
- Clique com o botão direito nos clipes `.MOV` no Painel de Projeto > **`Modificar > Interpretar Gravação... > Gerenciamento de Cor > Substituir Espaço de Cor`** para **`Rec. 709`**, **ou**
- Em **`Configurações de Sequência`**, ative **`Auto Detect Log/HDR Color`** / **`Color Space: Rec. 709`** com Tone Mapping automático ativado.
- Confira o resultado esperado no vídeo de referência em `05_PREVIEW_FINAL/PaxVida_Video1_Preview_SDR.mp4`.
