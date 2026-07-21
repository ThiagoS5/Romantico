import { BookOpenText } from 'lucide-react'
import { useEffect, useState } from 'react'

type TrelloPoem = {
  id: string
  title: string
  body: string
}

type TrelloPoemsPayload = {
  cardTitle: string
  poems: TrelloPoem[]
}

export function TrelloPoems({ heading }: { heading: string }) {
  const [payload, setPayload] = useState<TrelloPoemsPayload | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-configured' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPoems() {
      try {
        const response = await fetch('/api/trello-poems', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        const result = (await response.json()) as TrelloPoemsPayload & { code?: string }

        if (!response.ok) {
          setStatus(result.code === 'TRELLO_NOT_CONFIGURED' ? 'not-configured' : 'error')
          return
        }

        setPayload(result)
        setStatus('ready')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      }
    }

    void loadPoems()
    return () => controller.abort()
  }, [])

  const activePoem = payload?.poems[activeIndex]

  return (
    <section className="trello-poems" aria-labelledby="trello-poems-heading">
      <div className="trello-poems__heading">
        <BookOpenText aria-hidden="true" />
        <h3 id="trello-poems-heading">{heading}</h3>
      </div>

      {status === 'loading' ? <p className="trello-poems__status" role="status">Buscando versos guardados...</p> : null}
      {status === 'not-configured' ? (
        <p className="trello-poems__status">Os poemas aparecerão aqui assim que a conexão com o Trello for configurada.</p>
      ) : null}
      {status === 'error' ? (
        <p className="trello-poems__status" role="alert">Não consegui alcançar os poemas agora. Tente novamente mais tarde.</p>
      ) : null}

      {status === 'ready' && payload ? (
        payload.poems.length > 0 ? (
          <div className="trello-poems__content">
            {payload.poems.length > 1 ? (
              <label className="trello-poems__selector">
                <span>Escolha um poema</span>
                <select value={activeIndex} onChange={(event) => setActiveIndex(Number(event.target.value))}>
                  {payload.poems.map((poem, index) => (
                    <option key={poem.id} value={index}>{poem.title}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <article className="trello-poems__poem" aria-live="polite">
              <h4>{activePoem?.title ?? payload.cardTitle}</h4>
              <p>{activePoem?.body}</p>
            </article>
          </div>
        ) : (
          <p className="trello-poems__status">O card está conectado, mas ainda não possui poemas na descrição.</p>
        )
      ) : null}
    </section>
  )
}
