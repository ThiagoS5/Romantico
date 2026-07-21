import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'

import { BubblePreview } from '@/components/bubbles/BubblePreview'
import type { Reason } from '@/content/reasons'

type ReasonBubbleProps = {
  reason: Reason
  index: number
  isSelected: boolean
}

export function ReasonBubble({ reason, index, isSelected }: ReasonBubbleProps) {
  const shouldReduceMotion = useReducedMotion()
  const distance = 5 + (index % 3) * 2

  return (
    <div className="reason-bubble" data-slug={reason.slug}>
      <Link
        className="reason-bubble__link"
        data-reason-bubble={reason.slug}
        data-selected={isSelected ? 'true' : 'false'}
        to={`/motivos/${reason.slug}`}
        state={{ fromOcean: true, returnFocusSlug: reason.slug }}
        aria-current={isSelected ? 'page' : undefined}
      >
        <motion.span
          className="reason-bubble__float"
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, -distance, 0, distance * 0.35, 0] }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 8 + index * 0.8, delay: index * -0.75, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <span className="reason-bubble__surface">
            <span className="reason-bubble__shine" aria-hidden="true" />
            <span className="reason-bubble__label">{reason.bubbleLabel}</span>
            <BubblePreview text={reason.bubblePreview} />
          </span>
        </motion.span>
      </Link>
    </div>
  )
}
