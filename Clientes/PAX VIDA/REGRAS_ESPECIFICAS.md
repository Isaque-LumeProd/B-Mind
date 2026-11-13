# Regras Específicas — Cliente PAX VIDA

Diretrizes operacionais e editoriais exclusivas para os vídeos da **PAX VIDA**.

## 1. Direção Editorial e Tom
- **Tom acolhedor e respeitoso (serviços funerários e assistenciais):** ritmo comercial claro para tráfego pago, porém sóbrio, humano e sem exageros visuais (evitar neon, brilhos artificiais ou cortes frenéticos em planos de capela/homenagem).
- **Contato oficial padrão nos CTAs:** `(ícone WhatsApp) (67) 9 9245-4721`.

## 2. Regras de Decupagem e Cobertura Visual
- **Cortar contagens de gravação:** remover sempre deixas de direção antes da fala (ex.: *"dois, três e"*).
- **Cobrir leitura no celular 100% com B-roll:** em planos como `IMG_7466`, `IMG_7472` e `IMG_7485` em que a apresentadora olha para baixo lendo o celular, cobrir integralmente a camada visual (`V2`) com B-rolls correspondentes ao assunto falado (fachada da sede, equipe, frota funerária, capela velório moderna, altar, coroa de flores).

## 3. Regras de Entrega para Adobe Premiere Pro
- **Áudio original de falas vinculado (`A1` ↔ `V1`):** nunca apagar o áudio original de fala dos arquivos `.MOV`; manter cada clipe de fala na faixa `A1` vinculado (`<link>`) ao respectivo vídeo da `V1`.
- **Faixas sem sobreposição:** `V1` (A-roll/base), `V2` (B-rolls de cobertura), `V3` (GCs ProRes Alfa), `A1` (falas originais vinculadas), `A2` (BGM `-16 dB`), `A3` (`SFX Pop`), `A4` (`SFX Whoosh`).
- **Orientação e escala 4K iPhone:** conferir rotação (`-90°`) nos brutos `.MOV` para diferenciar `9:16` (`2160×3840`, `Scale = 50` em sequência `1080×1920`) vs. `16:9` horizontal (`3840×2160`, `Scale = 50` em sequência `1920×1080`).
- **Conversão de cor (HLG HDR → Rec.709):** orientar no `LEIA_ME_PREMIERE.md` de cada projeto sobre *Auto Tone Map Media* / *Color Space Override → Rec.709* ao importar `.MOV` de iPhone no Premiere.
- **Versionamento não destrutivo:** nunca apagar nem sobrescrever vídeos, GCs, XMLs ou versões já entregues; salvar revisões como `_v2`, `_v3`, etc. dentro de `projetos/`.

