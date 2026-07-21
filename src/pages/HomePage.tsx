import { BubbleField } from '@/components/bubbles/BubbleField'

type HomePageProps = {
  selectedSlug?: string
}

export function HomePage({ selectedSlug }: HomePageProps) {
  return (
    <section className="home-stage" aria-labelledby="invitation-title">
      <div className="invitation-group">
        <header className="invitation" tabIndex={0} aria-describedby="invitation-challenge">
          <p className="invitation__kicker">Um convite para mergulhar</p>
          <h1
            id="invitation-title"
            className="invitation__title text-gradient"
            aria-label="por que você deveria dar uma chance a mim?"
          >
            Por que você deveria dar uma chance a mim?
          </h1>
        </header>
        <p id="invitation-challenge" className="invitation__challenge">Eai, mereço uma chance?</p>
      </div>
      <BubbleField selectedSlug={selectedSlug} />
    </section>
  )
}
