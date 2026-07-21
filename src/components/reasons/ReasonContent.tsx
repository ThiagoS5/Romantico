import { ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { TrelloPoems } from '@/components/reasons/TrelloPoems'
import type { MediaSlot, Reason, ReasonSpecialContent } from '@/content/reasons'

function MediaFrame({ slot }: { slot: MediaSlot }) {
  return (
    <figure
      className={`media-frame${slot.src ? ' media-frame--filled' : ''}`}
      data-aspect={slot.aspect}
      data-media-id={slot.id}
    >
      {slot.src ? (
        <img className="media-frame__image" src={slot.src} alt={slot.alt} />
      ) : (
        <div className="media-frame__placeholder">
          <ImagePlus aria-hidden="true" />
          <span>{slot.prompt}</span>
        </div>
      )}
      {slot.caption ? <figcaption>{slot.caption}</figcaption> : null}
    </figure>
  )
}

function MediaCarousel({ slots, label }: { slots: MediaSlot[]; label: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const shouldReduceMotion = useReducedMotion()
  const activeSlot = slots[activeIndex]

  useEffect(() => {
    if (shouldReduceMotion || slots.length < 2) return

    const timer = window.setInterval(() => {
      setDirection(1)
      setActiveIndex((index) => (index + 1) % slots.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [shouldReduceMotion, slots.length])

  function selectSlide(nextIndex: number) {
    setDirection(nextIndex > activeIndex ? 1 : -1)
    setActiveIndex((nextIndex + slots.length) % slots.length)
  }

  return (
    <section className="media-carousel" aria-label={label} aria-roledescription="carrossel">
      <div className="media-carousel__viewport">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activeSlot.id}
            className="media-carousel__slide"
            custom={direction}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -20 }}
            transition={{ duration: shouldReduceMotion ? 0.08 : 0.22, ease: 'easeOut' }}
          >
            <MediaFrame slot={activeSlot} />
          </motion.div>
        </AnimatePresence>
      </div>

      {slots.length > 1 ? (
        <div className="media-carousel__controls">
          <button type="button" className="media-carousel__arrow" aria-label="Imagem anterior" onClick={() => selectSlide(activeIndex - 1)}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="media-carousel__dots" aria-label="Selecionar imagem">
            {slots.map((slot, index) => (
              <button
                key={slot.id}
                type="button"
                className="media-carousel__dot"
                data-active={index === activeIndex}
                aria-label={`Exibir imagem ${index + 1} de ${slots.length}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => selectSlide(index)}
              />
            ))}
          </div>
          <button type="button" className="media-carousel__arrow" aria-label="Próxima imagem" onClick={() => selectSlide(activeIndex + 1)}>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  )
}

function SpecialContent({ content }: { content: ReasonSpecialContent }) {
  if (content.type === 'quote') {
    return (
      <section className="special-content special-content--quote" aria-labelledby="special-heading">
        <h3 id="special-heading">{content.heading}</h3>
        <blockquote>{content.placeholder}</blockquote>
      </section>
    )
  }

  if (content.type === 'champions') {
    return (
      <section className="special-content" aria-labelledby="special-heading">
        <h3 id="special-heading">{content.heading}</h3>
        <dl className="game-details">
          {content.groups.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>
    )
  }

  if (content.type === 'projects') {
    return (
      <section className="special-content special-content--projects" aria-labelledby="special-heading">
        <h3 id="special-heading">{content.heading}</h3>
        <ul className="project-list">
          {content.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (content.type === 'chips') {
    return (
      <section className="special-content" aria-labelledby="special-heading">
        <h3 id="special-heading">{content.heading}</h3>
        <ul className="content-chips">
          {content.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="special-content" aria-labelledby="special-heading">
      <h3 id="special-heading">{content.heading}</h3>
      <ul className={content.type === 'ideas' ? 'idea-list' : 'simple-list'}>
        {content.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function ReasonContent({ reason }: { reason: Reason }) {
  const specialContentAfterCopy = reason.specialContentPosition === 'after-copy'
  const usesCarousel = reason.mediaPresentation === 'carousel'

  return (
    <div className="reason-content" data-reason={reason.slug}>
      <div className="reason-copy">
        {reason.paragraphs.map((paragraph, index) => (
          <p key={`${reason.slug}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>

      {reason.illustration ? <img className="reason-illustration" src={reason.illustration.src} alt={reason.illustration.alt} /> : null}

      {reason.specialContent && specialContentAfterCopy ? <SpecialContent content={reason.specialContent} /> : null}

      {reason.mediaSlots.length > 0 && usesCarousel ? (
        <MediaCarousel slots={reason.mediaSlots} label={`Fotos de ${reason.bubbleLabel}`} />
      ) : reason.mediaSlots.length > 0 ? (
        <div className="media-gallery" data-gallery={reason.slug} aria-label="Espaços reservados para suas imagens">
          {reason.mediaSlots.map((slot) => (
            <MediaFrame key={slot.id} slot={slot} />
          ))}
        </div>
      ) : null}

      {reason.closingParagraph ? (
        <div className="reason-copy reason-copy--closing">
          <p>{reason.closingParagraph}</p>
        </div>
      ) : null}

      {reason.closingQuote ? <blockquote className="reason-closing-quote">“{reason.closingQuote}”</blockquote> : null}

      {reason.externalContent?.type === 'trello-poems' ? <TrelloPoems heading={reason.externalContent.heading} /> : null}

      {reason.specialContent && !specialContentAfterCopy ? <SpecialContent content={reason.specialContent} /> : null}
    </div>
  )
}
