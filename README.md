# SimplesmenteEu

Experiência romântica e interativa construída como um mergulho por seis motivos. Cada bolha abre um painel associado a uma URL compartilhável sem desmontar o oceano reativo ao fundo.

## Executar

```bash
npm install
npm run dev
```

Verificações disponíveis:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

## Personalizar

Todo o conteúdo editável está em `src/content/reasons.ts`. Procure por `PERSONALIZE` para substituir os parágrafos provisórios, o poema, campeões, jogos, talentos e demais detalhes pessoais.

Cada motivo contém `mediaSlots`. Para trocar uma moldura vazia por uma imagem, informe `src` e `alt`; o TypeScript exige texto alternativo sempre que uma imagem real for usada.

```ts
{
  id: 'poesia-square',
  aspect: 'square',
  src: '/images/minha-foto.jpg',
  alt: 'Descrição objetiva da foto',
}
```

Coloque fotos públicas em `public/images` ou importe arquivos locais de `src/assets`. Os aspectos aceitos são `landscape`, `portrait` e `square`.

## Rotas

- `/`
- `/motivos/sites`
- `/motivos/poesia`
- `/motivos/lol-e-jogos`
- `/motivos/talentos`
- `/motivos/conversas`
- `/motivos/encontros`

Em hospedagem estática, configure o fallback de todas as rotas para `index.html`.

## Poemas do Trello na Vercel

O modal de Poesia consulta a Vercel Function `GET /api/trello-poems`. Cadastre estas variáveis em **Project Settings → Environment Variables** para Production, Preview e Development:

```text
TRELLO_API_KEY
TRELLO_API_TOKEN
TRELLO_POEMS_BOARD_ID
```

Não use o prefixo `VITE_`: essas credenciais devem existir somente no servidor. Para testar localmente com as Functions, use `npx vercel dev` depois de vincular o projeto e preencher `.env.local` a partir de `.env.example`.

Cada card aberto do quadro representa um poema: o nome do card vira o título e a descrição vira o texto. Cards sem descrição são ignorados, e a ordem exibida acompanha a ordem dos cards no Trello.
