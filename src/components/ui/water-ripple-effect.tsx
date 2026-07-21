import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type WaterRippleEffectProps = {
  imageSrc: string
  className?: string
  waveIntensity?: number
  rippleIntensity?: number
  animationSpeed?: number
  hoverRippleMultiplier?: number
  rippleFrequency?: number
  distortionAmount?: number
}

// Adapted from the NyxUI registry component for a full-viewport, non-interactive background.
export function WaterRippleEffect({
  imageSrc,
  className = '',
  waveIntensity = 0.010,
  rippleIntensity = 0.012,
  animationSpeed = 0.72,
  hoverRippleMultiplier = 2.2,
  rippleFrequency = 100,
  distortionAmount = 0.006,
}: WaterRippleEffectProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const mountElement = mountRef.current
    if (shouldReduceMotion || !mountElement || typeof WebGLRenderingContext === 'undefined') return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        precision: 'mediump',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mouse = new THREE.Vector2(0.5, 0.5)
    const targetMouse = new THREE.Vector2(0.5, 0.5)
    const resolution = new THREE.Vector2(1, 1)
    const imageResolution = new THREE.Vector2(16, 9)
    const texture = new THREE.TextureLoader().load(imageSrc, (loadedTexture) => {
      const image = loadedTexture.image as HTMLImageElement
      imageResolution.set(image.naturalWidth || image.width || 16, image.naturalHeight || image.height || 9)
      loadedTexture.colorSpace = THREE.SRGBColorSpace
      loadedTexture.minFilter = THREE.LinearFilter
      loadedTexture.magFilter = THREE.LinearFilter
      loadedTexture.needsUpdate = true
    })

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        texture1: { value: texture },
        time: { value: 0 },
        mouse: { value: mouse },
        resolution: { value: resolution },
        imageResolution: { value: imageResolution },
        hoverIntensity: { value: 0.24 },
        waveIntensity: { value: waveIntensity },
        rippleIntensity: { value: rippleIntensity },
        animationSpeed: { value: animationSpeed },
        rippleFrequency: { value: rippleFrequency },
        distortionAmount: { value: distortionAmount },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D texture1;
        uniform float time;
        uniform vec2 mouse;
        uniform vec2 resolution;
        uniform vec2 imageResolution;
        uniform float hoverIntensity;
        uniform float waveIntensity;
        uniform float rippleIntensity;
        uniform float animationSpeed;
        uniform float rippleFrequency;
        uniform float distortionAmount;
        varying vec2 vUv;

        vec2 coverUv(vec2 uv) {
          float screenAspect = resolution.x / max(resolution.y, 1.0);
          float imageAspect = imageResolution.x / max(imageResolution.y, 1.0);
          vec2 scale = screenAspect > imageAspect
            ? vec2(1.0, imageAspect / screenAspect)
            : vec2(screenAspect / imageAspect, 1.0);
          return (uv - 0.5) * scale + 0.5;
        }

        void main() {
          vec2 uv = vUv;
          vec2 delta = uv - mouse;
          float distanceFromMouse = length(delta);
          float falloff = exp(-distanceFromMouse * 4.2);
          float globalWave =
            sin(uv.x * 11.0 + time * animationSpeed * 1.7) * waveIntensity +
            sin(uv.y * 8.5 + time * animationSpeed * 1.25) * waveIntensity * 0.65;
          vec2 localFlow = vec2(
            sin((uv.y + uv.x * 0.32) * rippleFrequency + time * animationSpeed * 1.8),
            cos((uv.x - uv.y * 0.28) * rippleFrequency - time * animationSpeed * 1.55)
          );
          vec2 localDistortion = localFlow * falloff * hoverIntensity * rippleIntensity;
          vec2 distortion =
            vec2(globalWave * 0.7, globalWave) +
            localDistortion * distortionAmount * 82.0;
          vec2 sampledUv = clamp(coverUv(uv + distortion), 0.002, 0.998);
          vec4 color = texture2D(texture1, sampledUv);
          float shimmer = (localFlow.x * localFlow.y * 0.5 + 0.5) * falloff * hoverIntensity;
          color.rgb += vec3(0.018, 0.045, 0.07) * shimmer;
          gl_FragColor = color;
        }
      `,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'water-ripple-effect__canvas'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mountElement.appendChild(renderer.domElement)

    const resize = () => {
      const { width, height } = mountElement.getBoundingClientRect()
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      resolution.set(width, height)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mountElement)
    resize()

    let pointerActive = false
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      targetMouse.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight)
      pointerActive = true
      mountElement.dataset.rippleActive = 'true'
    }
    const handlePointerLeave = () => {
      pointerActive = false
      mountElement.dataset.rippleActive = 'false'
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('blur', handlePointerLeave)

    let frameId = 0
    let previousTime = performance.now()
    let elapsedTime = 0
    const animate = (now: number) => {
      const deltaTime = Math.min((now - previousTime) / 1000, 0.05)
      previousTime = now
      elapsedTime += deltaTime
      mouse.lerp(targetMouse, 0.14)
      material.uniforms.time.value = elapsedTime
      const targetIntensity = pointerActive ? hoverRippleMultiplier : 0.12
      material.uniforms.hoverIntensity.value +=
        (targetIntensity - material.uniforms.hoverIntensity.value) * 0.1
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      window.cancelAnimationFrame(frameId)
      if (!document.hidden) {
        previousTime = performance.now()
        frameId = window.requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      if (mountElement.contains(renderer.domElement)) mountElement.removeChild(renderer.domElement)
    }
  }, [
    animationSpeed,
    distortionAmount,
    hoverRippleMultiplier,
    imageSrc,
    rippleFrequency,
    rippleIntensity,
    shouldReduceMotion,
    waveIntensity,
  ])

  return (
    <div
      ref={mountRef}
      className={`water-ripple-effect ${className}`}
      data-ripple-active="false"
      aria-hidden="true"
    />
  )
}
