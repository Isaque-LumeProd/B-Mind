# Roteiro de Vídeo Curto (9:16): Segurança Residencial & Casa Inteligente

- **Formato:** Vertical `9:16` (`1080x1920`) — Reels / TikTok / YouTube Shorts
- **Duração estimada:** ~52 segundos (aprox. 130 palavras de locução em ritmo dinâmico)
- **Tese Central (Content Engine):** Uma câmera comum só grava o problema depois que ele acontece; uma casa inteligente integrada **impede** a invasão antes da porta abrir.
- **Skills ECC aplicadas:** `content-engine` + `video-editing`

---

## 1. Estrutura Cena a Cena (Edit Decision List)

| Tempo | Cena / Visual (B-Roll ou Gravação) | Texto na Tela (Overlay) | Locução (Voz Natural e Direta) | Áudio / SFX |
| :--- | :--- | :--- | :--- | :--- |
| **00:00 – 00:04** *(Hook)* | Close-up de uma câmera comum na parede à noite vs. celular vibrando com alerta instantâneo de "Pessoa detectada no portão". | **CÂMERA COMUM SÓ GRAVA O ROUBO.** | Ter uma câmera comum em casa só serve pra você assistir ao prejuízo no dia seguinte. | *SFX: Notificação grave + som curto de obturador* |
| **00:04 – 00:12** *(O Problema)* | Corte rápido: gravação borrada de câmera antiga sem alerta, seguida por uma porta com chave comum sendo destrancada. | **GRAVAR ≠ PROTEGER** | Segurança residencial de verdade não é gravar o que aconteceu. É fazer a casa reagir **antes** de alguém chegar na sua porta. | *Batida lo-fi tensa e discreta entra no fundo (`-18dB`)* |
| **00:12 – 00:22** *(Camada 1: Perímetro Inteligente)* | Câmera IP com IA marcando um retângulo ao redor de uma pessoa na calçada; refletor externo acende sozinho no mesmo segundo. | **1. DETECÇÃO HUMANA + AUTOMAÇÃO DE LUZ** | Começa na calçada: uma câmera com detecção humana ignora gatos ou galhos, mas se alguém para no portão às duas da manhã, ela acende o refletor externo na hora. | *SFX: Clique seco de interruptor / refletor ligando* |
| **00:22 – 00:33** *(Camada 2: Controle de Acesso)* | Mão tocando fechadura digital biométrica; tela do app mostrando histórico ("Entregador - Código Temporário 14:10 expirou"). | **2. FECHADURA DIGITAL COM SENHA TEMPORÁRIA** | Na porta, nada de chave copiada. Com fechadura digital, você cria uma senha que funciona só hoje das duas às quatro da tarde e trava sozinha quando a porta bate. | *SFX: Beep eletrônico de travamento da fechadura* |
| **00:33 – 00:44** *(Camada 3: Sensores + Rotina de Simulação)* | Sensor discreto na janela/porta dos fundos + luz da sala e TV ligando sozinhas pelo aplicativo enquanto a casa está vazia. | **3. SENSORES DE ABERTURA + PRESENÇA SIMULADA** | Nos fundos, sensores de abertura nas janelas disparam sirene e alerta no celular no primeiro milímetro. E quando você viaja, a automação liga as luzes da sala à noite como se tivesse gente em casa. | *SFX: Swoosh rápido na transição* |
| **00:44 – 00:52** *(Fechamento / Conclusão)* | Tela do celular mostrando os 3 sistemas integrados no mesmo painel ("Casa Trancada • Perímetro Ativo • 0 Alertas"). | **PROTEÇÃO ATIVA > CÂMERA PASSIVA** | Três camadas simples: câmera que acende a luz, fechadura sem chave física e sensor nas janelas. Sua casa deixa de ser um alvo fácil. | *Trilha sobe levemente e encerra limpa* |

---

## 2. Texto Limpo para Teleprompter / Locução (ElevenLabs)

> Ter uma câmera comum em casa só serve pra você assistir ao prejuízo no dia seguinte.
>
> Segurança residencial de verdade não é gravar o que aconteceu. É fazer a casa reagir antes de alguém chegar na sua porta.
>
> Começa na calçada: uma câmera com detecção humana ignora gatos ou galhos, mas se alguém para no portão às duas da manhã, ela acende o refletor externo na hora.
>
> Na porta, nada de chave copiada. Com fechadura digital, você cria uma senha que funciona só hoje das duas às quatro da tarde e trava sozinha quando a porta bate.
>
> Nos fundos, sensores de abertura nas janelas disparam sirene e alerta no celular no primeiro milímetro. E quando você viaja, a automação liga as luzes da sala à noite como se tivesse gente em casa.
>
> Três camadas simples: câmera que acende a luz, fechadura sem chave física e sensor nas janelas. Sua casa deixa de ser um alvo fácil.

---

## 3. Lista de Cortes (`cuts.txt`) para o Pipeline `video-editing` (FFmpeg)

Salve seus arquivos brutos ou gere os 6 clipes e use o formato abaixo em `cuts.txt`:

```text
00:00:00,00:00:04,01_hook_camera_alerta
00:00:04,00:00:12,02_problema_gravar_vs_proteger
00:00:12,00:00:22,03_perimetro_camera_refletor
00:00:22,00:00:33,04_fechadura_digital_senha
00:00:33,00:00:44,05_sensores_simulacao_presenca
00:00:44,00:00:52,06_fechamento_painel_app
```

### Comandos FFmpeg Prontos (Reenquadramento 9:16 + Normalização de Áudio)

```bash
# 1. Converter qualquer take horizontal (16:9) para Vertical (9:16 - 1080x1920)
ffmpeg -i raw_input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy vertical_9x16.mp4

# 2. Remover silêncios mortos automaticamente da gravação de voz
ffmpeg -i locucao_bruta.wav -af silencedetect=noise=-30dB:d=0.6 -f null - 2>&1

# 3. Normalizar o áudio final para o padrão de Reels/TikTok (-16 LUFS)
ffmpeg -i video_montado.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy video_final_normalizado.mp4
```

