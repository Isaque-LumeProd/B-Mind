# Identidade Visual — PAX VIDA

Guia visual oficial para todas as campanhas audiovisuais (tráfego pago `9:16` `1080×1920` e versões `16:9` `1920×1080`) do cliente **PAX VIDA**.

## 1. Paleta Oficial
| Uso | Cor | Hex |
|---|---|---|
| Vermelho Institucional Principal | Carmesim Pax Vida | `#B91C1C` |
| Vermelho Profundo (Gradientes) | Vinho Escuro | `#7F1D1D` |
| Vermelho Suave (Acentos / Badges) | Rosa Claro | `#FEE2E2` |
| Verde WhatsApp CTA | Verde Oficial CTA | `#25D366` → `#128C7E` |
| Grafite Base / Pílulas | Grafite Escuro | `#14161A` / `#0E0F12` |
| Cinza Apoio | Slate | `#475569` |
| Fundo dos Cards / Texto Destaque | Branco Puro | `#FFFFFF` |

## 2. Tipografia Obrigatória
- **Família principal:** **`Montserrat`** (instalada no sistema).
- **Hierarquia:**
  - Títulos principais, valores (`R$ 65,00`) e telefone: **`Montserrat Black (900)`**.
  - Pílulas de categoria (`EyebrowPill`): **`Montserrat ExtraBold (800)`**, caixa alta com `letterSpacing: 1.8px`.
  - Textos complementares: **`Montserrat Bold (700)`**.
- **Regra:** sempre informar explicitamente ao cliente/usuário que a fonte `Montserrat` foi utilizada.

## 3. Padrão de Lower-Thirds (GCs) e Tela
- **Alinhamento:** GCs sempre **centralizados horizontalmente** no terço inferior seguro (`paddingBottom: 230px` em `9:16`).
- **Topo da tela:** 100% limpo — **sem** barra de progresso temporal superior nem selos/badges fixos no topo.
- **Animação padrão:** **`blur-up`** na entrada (`translateY: +34px → 0`, `scale: 0.95 → 1`, `blur: 14px → 0`, `Easing.out(cubic)`) e **`blur-out`** suave até o frame `totalFrames - 1`. Em GCs rápidos (~`1s`), usar curvas ágeis (`6f` entrada / `4f` saída).
- **Exportação para Premiere:** **ProRes 4444 RGBA (`yuva444p10le` / `yuva444p12le`)** com `<alphatype>straight</alphatype>`, fundo 100% transparente (sem end-slate opaco sobreposto nos `.mov` individuais).

