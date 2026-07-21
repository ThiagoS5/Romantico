import { BubbleField } from '@/components/bubbles/BubbleField'

type HomePageProps = {
  selectedSlug?: string
}

export function HomePage({ selectedSlug }: HomePageProps) {
  return (
    <section className="home-stage" aria-labelledby="invitation-title">
      <header className="invitation">
        <p className="invitation__kicker">Um convite para mergulhar</p>
        <h1
          id="invitation-title"
          className="invitation__title text-gradient"
          aria-label="por que você deveria dar uma chance a mim?"
        >
          Por que você deveria dar uma chance a mim?
        </h1>
        <p className="invitation__challenge" tabIndex={0}>
          Eai, mereço uma chance?
        </p>
      </header>
      <BubbleField selectedSlug={selectedSlug} />
    </section>
  )
}
