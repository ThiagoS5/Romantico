import type { CSSProperties } from 'react'

const particles = Array.from({ length: 96 }, (_, index) => ({
  x: (index * 37 + 7) % 100,
  y: (index * 53 + 11) % 108,
  size: 1 + ((index * 7) % 5),
  duration: 15 + ((index * 11) % 18),
  delay: -((index * 13) % 29),
  drift: -18 + ((index * 17) % 37),
}))

export function OceanParticles() {
  return (
    <div className="ocean-particles">
      {particles.map((particle, index) => {
        const isRing = index % 4 === 0 || index % 11 === 0
        const isGlow = !isRing && index % 5 === 0

        return (
          <span
            className={[
              'ocean-particle',
              isRing ? 'ocean-particle--ring' : '',
              isGlow ? 'ocean-particle--glow' : '',
            ].filter(Boolean).join(' ')}
            key={index}
            style={
              {
                '--particle-x': `${particle.x}%`,
                '--particle-y': `${particle.y}%`,
                '--particle-size': `${particle.size}px`,
                '--particle-duration': `${particle.duration}s`,
                '--particle-delay': `${particle.delay}s`,
                '--particle-drift': `${particle.drift}px`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
