import { Outlet, useMatch } from 'react-router-dom'

import { AudioControl } from '@/components/ocean/AudioControl'
import { UnderwaterBackground } from '@/components/ocean/UnderwaterBackground'
import { HomePage } from '@/pages/HomePage'

export function OceanLayout() {
  const reasonMatch = useMatch('/motivos/:slug')

  return (
    <main className="ocean-shell" data-testid="ocean-layout">
      <UnderwaterBackground />
      <HomePage selectedSlug={reasonMatch?.params.slug} />
      <AudioControl />
      <Outlet />
    </main>
  )
}
