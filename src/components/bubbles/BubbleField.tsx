import { ReasonBubble } from '@/components/bubbles/ReasonBubble'
import { reasons } from '@/content/reasons'

type BubbleFieldProps = {
  selectedSlug?: string
}

export function BubbleField({ selectedSlug }: BubbleFieldProps) {
  return (
    <nav className="bubble-field" aria-label="Seis motivos para explorar">
      {reasons.map((reason, index) => (
        <ReasonBubble
          index={index}
          isSelected={selectedSlug === reason.slug}
          key={reason.slug}
          reason={reason}
        />
      ))}
    </nav>
  )
}
