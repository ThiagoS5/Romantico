import { ArrowLeft } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ReasonContent } from '@/components/reasons/ReasonContent'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Reason } from '@/content/reasons'

type ReasonLocationState = {
  fromOcean?: boolean
  returnFocusSlug?: string
}

export function ReasonDialog({ reason }: { reason: Reason }) {
  const [open, setOpen] = useState(true)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as ReasonLocationState | null

  const restoreFocus = useCallback(() => {
    const slug = locationState?.returnFocusSlug ?? reason.slug
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[data-reason-bubble="${slug}"]`)?.focus()
    }, 0)
  }, [locationState?.returnFocusSlug, reason.slug])

  const leaveReason = useCallback(() => {
    if (locationState?.fromOcean) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
    restoreFocus()
  }, [locationState?.fromOcean, navigate, restoreFocus])

  useEffect(() => {
    return () => restoreFocus()
  }, [restoreFocus])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AnimatePresence onExitComplete={leaveReason}>
        {open ? (
          <DialogContent
            style={{ '--reason-accent': reason.accentColor ?? '#2EC4B6' } as CSSProperties}
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              restoreFocus()
            }}
            onOpenAutoFocus={(event) => {
              event.preventDefault()
              titleRef.current?.focus()
            }}
          >
            <div className="reason-dialog__scroll">
              <header className="reason-dialog__header">
                <span className="reason-dialog__label">{reason.bubbleLabel}</span>
                <DialogTitle ref={titleRef} tabIndex={-1}>
                  {reason.title}
                </DialogTitle>
                <DialogDescription>{reason.introduction}</DialogDescription>
              </header>

              <ReasonContent reason={reason} />

              <footer className="reason-dialog__footer">
                <DialogClose asChild>
                  <Button type="button">
                    <ArrowLeft aria-hidden="true" />
                    Voltar ao oceano
                  </Button>
                </DialogClose>
              </footer>
            </div>
          </DialogContent>
        ) : null}
      </AnimatePresence>
    </Dialog>
  )
}
