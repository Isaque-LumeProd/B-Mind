# TREATMENT — Casa Protegida (Isometric Infographic × Isometric Picture Book)

- **Estilo Lemo-Opuscar:** `iso-infographic` + elementos de `isometric-picture-book` (diorama arquitetônico em projeção isométrica verdadeira a 30°, blocos sombreados em 3 tons planos via `tri()`, corte arquitetônico *cutaway* do telhado com `cutLine` e `hatch`, *Focus + Context* via `iso.desat`, *pins* de engenharia, *inset* circular de detalhe e tipografia no plano isométrico via `text3`).
- **Formato e Duração:** `1080×1920` (`9:16` vertical), `30 fps`, `49,6 segundos` (`1488 frames`).
- **Idioma e Voz:** Português (`pt-BR-AntonioNeural`) + foley procedural sincronizado aos eventos do diorama.

---

## 1. Três Estruturas Candidatas e Escolha

1. **Candidata A — Duas Casas Comparadas Lado a Lado:** Dois tabuleiros isométricos simultâneos (casa passiva vs. casa inteligente). *Problema em 9:16:* divide a largura de 1080px ao meio, deixando os objetos pequenos demais.
2. **Candidata B — Percurso Contínuo da Rua até o Interior (Escolhida):** Um único terreno residencial isométrico sobre um plinto com camadas de solo e fundação. A câmera começa na calçada às 02:14, acompanha a rota tracejada pelo portão (Camada 1), avança até a porta de entrada (Camada 2), executa o *Cutaway* removendo o telhado para revelar a janela dos fundos e a sala iluminada (Camada 3), e termina em um *Scale Reveal* mostrando o diorama inteiro com os três *pins* ativos.
3. **Candidata C — Contagem Regressiva de Invasão:** Cronômetro de 60 segundos mostrando o tempo de reação. *Problema:* tom excessivamente alarmista em vez de explicativo e arquitetônico.

---

## 2. Logline e Arco

- **Logline:** Uma câmera comum só registra o que já passou; uma casa inteligente reage em três camadas físicas — calçada, porta e interior — antes que qualquer invasão aconteça.
- **Arco:**
  - *Setup (0s – 12,9s):* Às 02:14, um vulto passa pela calçada de uma casa comum; a câmera passiva não faz nada (`Focus + Context` desatura a casa passiva).
  - *Turn (12,9s – 40,5s):* O sistema ativo assume em três estações conectadas por uma linha guia: (1) refletor acende na calçada ao detectar presença humana; (2) fechadura digital controla entrega com senha das 14h às 16h; (3) o telhado se abre em *cutaway* mostrando o sensor de 1 mm na janela traseira e a sala acendendo sozinha em modo viagem.
  - *Ending (40,5s – 49,6s):* *Scale Reveal* (pull-out logarítmico) revelando o lote inteiro protegido com os três *pins* e a legenda Isotype.

---

## 3. Benchmark (Learn / Don't Learn)

- **Referências de Gramática:** *Monument Valley* (arquitetura isométrica pura em três tons sem contorno nos sólidos) e diagramas de corte arquitetônico *SimCity 2000* / *Kurzgesagt*.
- **O que absorver:** Clareza da silhueta do imóvel, leitura imediata de cada estação por cor reservada (`PAL`), *cutaway* do telhado com hachura de seção (`hatch`) e *inset* circular para mostrar o teclado da fechadura.
- **O que não copiar:** Personagens, paletas ou elementos de jogos existentes.

---

## 4. Lista de Planos (Shot List) & Movimentos Nativos

| Shot | Tempo | Enquadramento & Câmera (`iso.cam`) | Movimento Nativo (`STYLE.md` §8) | Ação no Diorama |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `0,0s – 5,6s` | Médio na calçada (`k: 28 → 32`), leve avanço lateral | **Tracked Subject (`ring`)** | Figura caminha na calçada às 02:14; câmera comum não reage; *pin* mostra `08:00 • TARDE DEMAIS`. |
| **2** | `5,6s – 12,9s` | Aberto do lote (`k: 24`), transição de saturação | **Focus + Context (`iso.desat`)** | O terreno desatura para cinza quente, exceto a linha de defesa ativa que pulsa em âmbar (`1,2 s`). |
| **3** | `12,9s – 21,5s` | Fechado no portão e poste (`k: 34`) | **Label Pin + Light Cone** | Gato/árvore recebe selo discreto `IGNORADO`; quando a figura para no portão, o cone dourado do refletor inunda o jardim. |
| **4** | `21,5s – 30,7s` | Médio na varanda frontal (`k: 36`) + `inset` | **Frame within the Frame (`inset`)** | Entregador deixa encomenda; *inset* circular amplia a fechadura digital (`14:00–16:00 • AUTO-LOCK`). |
| **5** | `30,7s – 40,5s` | Mergulho no interior (`k: 31`) | **Cutaway (`cutLine` + `hatch`)** | Linha tracejada corta o telhado; a cobertura sobe e revela a sala (sofá, abajur acendendo às 19:30) e o sensor de `1 mm` na janela dos fundos. |
| **6** | `40,5s – 49,6s` | Pull-out logarítmico (`k: 31 → 22`) | **Scale Reveal + Isotype Legend** | Vista completa do diorama com os 3 *pins* erguidos simultaneamente e cartão de legenda estilo mapa no rodapé. |

