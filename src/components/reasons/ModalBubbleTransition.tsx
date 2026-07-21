import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

const transitionBubbles = Array.from({ length: 84 }, (_, index) => ({
  left: (index * 29 + 6) % 100,
  bottom: -12 - ((index * 17) % 42),
  size: 14 + ((index * 19) % 48),
  duration: 0.52 + ((index * 7) % 28) / 100,
  delay: ((index * 11) % 22) / 100,
  drift: -28 + ((index * 13) % 57),
}))

export function ModalBubbleTransition() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return null

  return (
    <motion.div
      className="modal-bubble-transition"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.20, ease: 'easeOut' }}
    >
      {transitionBubbles.map((bubble, index) => (
        <motion.span
          key={index}
          className="modal-bubble-transition__bubble"
          style={
            {
              '--modal-bubble-left': `${bubble.left}%`,
              '--modal-bubble-bottom': `${bubble.bottom}vh`,
              '--modal-bubble-size': `${bubble.size}px`,
            } as CSSProperties
          }
          initial={{ opacity: 0, x: 0, y: '14vh', scale: 0.5 }}
          animate={{
            opacity: [0, 0.82, 0],
            x: bubble.drift,
            y: '-135vh',
            scale: [0.5, 1, 1.22],
          }}
          transition={{ duration: bubble.duration, delay: bubble.delay, ease: [0.2, 0.75, 0.25, 1] }}
        />
      ))}
    </motion.div>
  )
}
