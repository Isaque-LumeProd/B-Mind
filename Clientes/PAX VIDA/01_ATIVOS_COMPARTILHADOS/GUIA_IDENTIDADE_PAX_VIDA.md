# Guia de Identidade Visual — Pax Vida

Documento padrão para todas as peças audiovisuais do cliente **PAX VIDA** (tráfego pago 9:16, `1080x1920`, `30 fps`).

## Paleta Oficial
- **Vermelho Institucional Principal:** `#B91C1C`
- **Vermelho Profundo (Gradiente):** `#7F1D1D`
- **Vermelho Suave (Destaques):** `#FEE2E2`
- **Verde WhatsApp CTA:** `#25D366` → `#128C7E`
- **Preto / Grafite Base:** `#14161A` / `#0E0F12`
- **Cinza Apoio:** `#475569`
- **Branco Puro:** `#FFFFFF`

## Tipografia (Confirmada)
- **Família:** `Montserrat` (Google Fonts) — pesos **Black (900)** para títulos/números de impacto e **ExtraBold (800) / Bold (700)** para pílulas e subtítulos.
- Fallback seguro: `'Montserrat', 'Inter', 'Segoe UI', system-ui, sans-serif`.

## Regras de Composição e Motion (Aprovadas pelo Cliente)
1. **Topo limpo:** sem barra de progresso superior e sem selo/etiqueta fixa no topo.
2. **Alinhamento dos GCs:** sempre **centralizados horizontalmente** no terço inferior seguro (`paddingBottom: 230px`).
3. **Animação padrão dos GCs:** `blur-up` na entrada (`translateY: +34px → 0`, `scale: 0.95 → 1`, `blur: 14px → 0`, `Easing.out(cubic)`) e `blur-out` na saída (`Easing.in(cubic)`). Para GCs rápidos (~1s), usar entrada ágil (`6 frames`) e saída (`4 frames`) para garantir leitura integral.
4. **Canal Alfa nos GCs:** exportar standalone em **ProRes 4444 (`yuva444p12le`)** com fundo 100% transparente (sem telas opacas sobrepostas no fim do arquivo `.mov`).
5. **Cobertura visual de leitura no celular:** planos onde a apresentadora olha para o telefone são cobertos 100% em `V2` por B-roll temático sincronizado com a fala, mantendo o áudio integral.

## Padrão de Áudio
- Voz normalizada em `48 kHz / 16-bit Stereo`, `-16 LUFS` (`TP -1.5 dBTP`).
- Trilha compartilhada: `bgm_comercial_pax.wav` em cama suave (`-22 dB` a `-18 dB`) com subida sutil nos últimos 1,5s.
- Efeitos sonoros compartilhados: `sfx_whoosh.wav` nas entradas de B-roll e `sfx_pop_gc.wav` no surgimento dos cards.

