/// <reference types="node" />

import { env } from 'node:process'

type TrelloCard = {
  id?: unknown
  name?: unknown
  desc?: unknown
}

type TrelloBoard = {
  name?: unknown
  cards?: unknown
}

type Poem = {
  id: string
  title: string
  body: string
}

export function mapBoardToPoems(board: TrelloBoard): Poem[] {
  if (!Array.isArray(board.cards)) return []

  return board.cards.flatMap((cardValue, index) => {
    const card = cardValue as TrelloCard
    const body = typeof card.desc === 'string' ? card.desc.trim() : ''

    if (!body) return []

    const title = typeof card.name === 'string' && card.name.trim()
      ? card.name.trim()
      : `Poema ${index + 1}`

    return [{
      id: typeof card.id === 'string' ? card.id : `poem-${index + 1}`,
      title,
      body,
    }]
  })
}

function json(data: unknown, status = 200, cacheControl = 'no-store') {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': cacheControl,
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}

export async function GET() {
  const apiKey = env.TRELLO_API_KEY
  const apiToken = env.TRELLO_API_TOKEN
  const boardId = env.TRELLO_POEMS_BOARD_ID

  if (!apiKey || !apiToken || !boardId) {
    return json({ code: 'TRELLO_NOT_CONFIGURED', message: 'Integração com o Trello ainda não configurada.' }, 503)
  }

  const trelloUrl = new URL(`https://api.trello.com/1/boards/${encodeURIComponent(boardId)}`)
  trelloUrl.searchParams.set('key', apiKey)
  trelloUrl.searchParams.set('token', apiToken)
  trelloUrl.searchParams.set('fields', 'name')
  trelloUrl.searchParams.set('cards', 'open')
  trelloUrl.searchParams.set('card_fields', 'id,name,desc,pos')

  try {
    const trelloResponse = await fetch(trelloUrl, {
      headers: { Accept: 'application/json' },
    })

    if (!trelloResponse.ok) {
      console.error('Trello poems request failed', { status: trelloResponse.status })
      return json({ code: 'TRELLO_REQUEST_FAILED', message: 'Não foi possível carregar os poemas agora.' }, 502)
    }

    const board = (await trelloResponse.json()) as TrelloBoard
    const cardTitle = typeof board.name === 'string' ? board.name : 'Poemas'

    return json(
      {
        cardTitle,
        poems: mapBoardToPoems(board),
      },
      200,
      'public, s-maxage=300, stale-while-revalidate=3600',
    )
  } catch (error) {
    console.error('Unexpected Trello poems error', error instanceof Error ? error.message : 'Unknown error')
    return json({ code: 'TRELLO_UNAVAILABLE', message: 'O Trello está temporariamente indisponível.' }, 502)
  }
}
