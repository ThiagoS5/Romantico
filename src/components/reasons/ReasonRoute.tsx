import { Navigate, useParams } from 'react-router-dom'

import { ReasonDialog } from '@/components/reasons/ReasonDialog'
import { getReasonBySlug } from '@/content/reasons'

export function ReasonRoute() {
  const { slug } = useParams()
  const reason = getReasonBySlug(slug)

  if (!reason) {
    return <Navigate to="/" replace />
  }

  return <ReasonDialog key={reason.slug} reason={reason} />
}
