import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ComponentProps } from 'react'

import { ModalBubbleTransition } from '@/components/reasons/ModalBubbleTransition'
import { cn } from '@/lib/utils'

function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />
}

function DialogPortal(props: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />
}

function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />
}

function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <DialogPortal forceMount>
      <DialogPrimitive.Overlay forceMount asChild>
        <motion.div
          className="reason-dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.08 : 0.22, ease: 'easeOut' }}
        />
      </DialogPrimitive.Overlay>
      <ModalBubbleTransition />
      <DialogPrimitive.Content forceMount asChild {...props}>
        <motion.div
          className="reason-dialog-shell"
          initial={
            shouldReduceMotion
              ? { opacity: 0, x: '-50%', y: '-50%' }
              : { opacity: 0, x: '-50%', y: '-47%', scale: 0.97 }
          }
          animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0, x: '-50%', y: '-50%' }
              : { opacity: 0, x: '-50%', y: '-47%', scale: 0.975 }
          }
          transition={{ duration: shouldReduceMotion ? 0.08 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={cn('reason-dialog', className)}>
            {children}
            <DialogPrimitive.Close className="reason-dialog__icon-close" aria-label="Fechar painel">
              <X aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('reason-dialog__title', className)} {...props} />
}

function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('reason-dialog__intro', className)} {...props} />
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle }
