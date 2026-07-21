import { ArrowUpRight } from 'lucide-react'

type BubblePreviewProps = {
  text: string
}

export function BubblePreview({ text }: BubblePreviewProps) {
  return (
    <span className="bubble-preview">
      <span className="bubble-preview__copy">{text}</span>
      <span className="bubble-preview__action">
        Mergulhar <ArrowUpRight aria-hidden="true" />
      </span>
    </span>
  )
}
