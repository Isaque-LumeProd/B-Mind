# Precificador e Orçamentos

Sistema separado do workspace para calcular orçamentos audiovisuais (**captação e edição de vídeo, do básico ao avançado**) e gerar **páginas web personalizadas de proposta** para enviar ao cliente em vez de PDF.

## Estrutura
- **`public/index.html`** — Painel interno de precificação (custos, margem, impostos, PIX, parcelamento, escopo editável e cronograma).
- **`public/proposta.html`** — Página personalizada enviada ao cliente (nome da empresa, escopo detalhado de entregáveis, cronograma de execução, investimento e botão de aprovação no WhatsApp).
- **`orcamentos/`** — Propostas salvas em JSON com versionamento automático não-destrutivo (`-v1`, `-v2`, `-v3`...).
- **`server.mjs`** — Servidor Node.js local sem dependências externas.
- **`vercel.json`** — Configuração pronta para publicar na Vercel / domínio próprio.

## Como usar localmente (PC 1 ou PC 2)
1. Dê um duplo clique em **`iniciar-precificador.bat`** (ou rode no terminal):
   ```powershell
   cd "D:\Antigravity 3.0\Precificador e Orçamentos"
   node server.mjs
   ```
2. Acesse **`http://127.0.0.1:3456`** no navegador.
3. Preencha cliente, nível de captação/edição, escopo e cronograma e clique em **"Salvar Versão & Gerar Página do Cliente"**.
   - **Link Limpo:** `/proposta/<slug>-v1` (sincronizado com `orcamentos/` via Git/Vercel).
   - **Link Instantâneo Portátil:** `/proposta?d=...` (funciona na hora no seu site publicado mesmo antes de dar `/end`).

## Como publicar no seu site (Vercel + Domínio Próprio)
1. Acesse a [Vercel](https://vercel.com), importe o repositório **`Isaque-LumeProd/B-Mind`**.
2. Em **Root Directory**, selecione **`Precificador e Orçamentos`** e clique em **Deploy**.
3. Conecte seu domínio (ex.: `propostas.seudominio.com.br` ou `orcamentos.seudominio.com.br`) nas configurações de **Domains** da Vercel.
4. Toda vez que você criar novos orçamentos localmente e rodar **`/end`**, a Vercel atualiza automaticamente todos os links limpos `/proposta/<cliente-projeto-vN>`. *(E se tiver pressa antes do deploy, o Link Instantâneo `?d=...` já abre na hora no domínio publicado!)*

## Segurança na Publicação (Vercel)
- Durante o deploy na Vercel (`vercel.json`), apenas a página pública do cliente (`proposta.html`) e os JSONs versionados (`orcamentos/*.json`) são publicados no site; o painel interno (`index.html`), fórmulas de margem e tabelas de custos ficam restritos ao servidor local (`http://127.0.0.1:3456`).
- Recomenda-se enviar aos clientes prioritariamente o **Link Limpo (`/proposta/<cliente-projeto-vN>`)** após rodar `/end`, pois ele lê o JSON salvo diretamente no repositório (imutável pelo cliente). Use o Link Instantâneo (`?d=...`) apenas para prévia rápida antes do deploy.

## Testes Automatizados
```powershell
node --test "d:\Antigravity 3.0\Precificador e Orçamentos\tests\*.test.mjs"
```
