const rays = [
  { left: '8%', width: '11%', delay: '-4s', duration: '17s' },
  { left: '19%', width: '13%', delay: '-10s', duration: '20s' },
  { left: '32%', width: '9%', delay: '-7s', duration: '18s' },
  { left: '43%', width: '14%', delay: '-2s', duration: '23s' },
  { left: '56%', width: '10%', delay: '-13s', duration: '19s' },
  { left: '68%', width: '12%', delay: '-6s', duration: '21s' },
  { left: '81%', width: '9%', delay: '-9s', duration: '18s' },
]

export function LightRays() {
  return (
    <div className="light-rays">
      {rays.map((ray, index) => (
        <span
          className="light-ray"
          key={index}
          style={{
            left: ray.left,
            width: ray.width,
            animationDelay: ray.delay,
            animationDuration: ray.duration,
          }}
        />
      ))}
    </div>
  )
}
