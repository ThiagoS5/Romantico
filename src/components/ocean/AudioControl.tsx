import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const oceanEyesSource = '/audio/Ocean%20Eyes%20-%20Billie%20Eilish.mp3'

export function AudioControl() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
      return
    }

    audio.pause()
  }

  function changeVolume(nextVolume: number) {
    setVolume(nextVolume)
    if (audioRef.current) audioRef.current.volume = nextVolume
  }

  const PlayIcon = isPlaying ? Pause : Play
  const VolumeIcon = volume === 0 ? VolumeX : Volume2

  return (
    <section className="audio-control" aria-label="Controles de música">
      <audio
        ref={audioRef}
        src={oceanEyesSource}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        className="audio-control__toggle"
        type="button"
        aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        title={isPlaying ? 'Pausar música' : 'Tocar música'}
        onClick={togglePlayback}
      >
        <PlayIcon aria-hidden="true" />
      </button>
      <label className="audio-control__volume">
        <VolumeIcon aria-hidden="true" />
        <span className="sr-only">Volume da música</span>
        <input
          aria-label="Volume da música"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => changeVolume(Number(event.target.value))}
        />
      </label>
    </section>
  )
}
