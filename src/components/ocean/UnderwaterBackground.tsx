import { lazy, Suspense, useEffect, useState } from 'react'

import oceanDepth from '@/assets/ocean-depth.png'
import { LightRays } from '@/components/ocean/LightRays'
import { OceanParticles } from '@/components/ocean/OceanParticles'

const WaterRippleEffect = lazy(() =>
  import('@/components/ui/water-ripple-effect').then((module) => ({ default: module.WaterRippleEffect })),
)

export function UnderwaterBackground() {
  const [rippleReady, setRippleReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setRippleReady(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="underwater-background" aria-hidden="true">
      <div className="ocean-gradient" />
      <div className="ocean-depth-image" style={{ backgroundImage: `url(${oceanDepth})` }} />
      <Suspense fallback={null}>
        {rippleReady ? (
          <WaterRippleEffect
            imageSrc={oceanDepth}
            className="ocean-ripple-layer"
            waveIntensity={0.003}
            rippleIntensity={0.023}
            animationSpeed={0.64}
            hoverRippleMultiplier={3}
            rippleFrequency={27}
            distortionAmount={0.013}
          />
        ) : null}
      </Suspense>
      <div className="ocean-caustics ocean-caustics--near" />
      <div className="ocean-caustics ocean-caustics--far" />
      <LightRays />
      <OceanParticles />
      <div className="ocean-vignette" />
    </div>
  )
}
