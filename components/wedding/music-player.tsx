"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

        // START MUSIC FUNCTION
        // This handles both autoplay and fallback play
        const startMusic = async () => {
          try {
            // Try to play audio
            await audio.play()

            // Update UI to show music is playing
            setIsPlaying(true)
          } catch (err) {
            // Browser blocked autoplay
            console.log("Autoplay blocked by browser")
          }
        }

        // TRY AUTOPLAY IMMEDIATELY
        // Works on desktop and some mobile browsers
        startMusic()

        // FALLBACK FOR MOBILE / PRODUCTION
        // If autoplay is blocked, music starts
        // on the user's first interaction
        document.addEventListener("click", startMusic, 
          {once: true,})

        document.addEventListener("touchstart", startMusic,
          {once: true })

    const handleCanPlay = () => setIsLoaded(true)
    const handleEnded = () => {
      // Loop the audio
      audio.currentTime = 0
      audio.play()
    }

    audio.addEventListener("canplaythrough", handleCanPlay)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay)
      audio.removeEventListener("ended", handleEnded)
        // CLEANUP EVENT LISTENERS
        // Prevent memory leaks
      document.removeEventListener("click", startMusic)
      document.removeEventListener("touchstart", startMusic)
          }
        }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        // Autoplay was prevented, user needs to interact first
        console.log("Autoplay prevented, waiting for user interaction")
      })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <>
      {/* Hidden audio element - using a royalty-free wedding music URL */}
      <audio
        ref={audioRef}
        src="/new_song.mp3" /* Change here your new song*/
        preload="auto" // Load audio early
        autoPlay // Try autoplay
        loop // Repeat forever
        playsInline // Better mobile support
      />

      {/* Floating music button */}
      <button
        onClick={togglePlay}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full",
          "bg-accent text-accent-foreground shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-300 hover:scale-110 hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
          isPlaying && "animate-pulse"
        )}
        aria-label={isPlaying ? "Mute music" : "Play music"}
        title={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
        ) : (
          <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
        )}
        
        {/* Sound wave animation when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full animate-ping bg-accent/30" />
        )}
      </button>

      {/* Initial prompt to enable music */}
      {isLoaded && !isPlaying && (
        <div className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 animate-fade-in">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 md:px-4 md:py-2 shadow-lg max-w-[180px] md:max-w-none">
            <p className="text-xs md:text-sm text-muted-foreground">
              Tap to play music
            </p>
          </div>
        </div>
      )}
    </>
  )
}
