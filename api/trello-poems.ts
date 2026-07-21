type TrelloCard = {
  name?: unknown
  desc?: unknown
}

type Poem = {
  id: string
  title: string
  body: string
}

function splitPoems(description: string): Poem[] {
  return description
    .split(/\r?\n\s*(?:---|\*\*\*)\s*\r?\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split(/\r?\n/)
      const heading = lines[0]?.match(/^#{1,6}\s+(.+)$/)?.[1]?.trim()
      const body = heading ? lines.slice(1).join('\n').trim() : block

      return {
        id: `poem-${index + 1}`,
        title: heading || `Poema ${index + 1}`,
        body,
      }
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
  const apiKey = process.env.TRELLO_API_KEY
  const apiToken = process.env.TRELLO_API_TOKEN
  const cardId = process.env.TRELLO_POEMS_CARD_ID

  if (!apiKey || !apiToken || !cardId) {
    return json({ code: 'TRELLO_NOT_CONFIGURED', message: 'Integração com o Trello ainda não configurada.' }, 503)
  }

  const trelloUrl = new URL(`https://api.trello.com/1/cards/${encodeURIComponent(cardId)}`)
  trelloUrl.searchParams.set('key', apiKey)
  trelloUrl.searchParams.set('token', apiToken)
  trelloUrl.searchParams.set('fields', 'name,desc')

  try {
    const trelloResponse = await fetch(trelloUrl, {
      headers: { Accept: 'application/json' },
    })

    if (!trelloResponse.ok) {
      console.error('Trello poems request failed', { status: trelloResponse.status })
      return json({ code: 'TRELLO_REQUEST_FAILED', message: 'Não foi possível carregar os poemas agora.' }, 502)
    }

    const card = (await trelloResponse.json()) as TrelloCard
    const description = typeof card.desc === 'string' ? card.desc : ''
    const cardTitle = typeof card.name === 'string' ? card.name : 'Poemas'

    return json(
      {
        cardTitle,
        poems: splitPoems(description),
      },
      200,
      'public, s-maxage=300, stale-while-revalidate=3600',
    )
  } catch (error) {
    console.error('Unexpected Trello poems error', error instanceof Error ? error.message : 'Unknown error')
    return json({ code: 'TRELLO_UNAVAILABLE', message: 'O Trello está temporariamente indisponível.' }, 502)
  }
}
