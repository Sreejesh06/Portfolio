"use client"

import * as React from "react"
import { Disc3, X, Music } from "lucide-react"

import WaveformPlayer from "@/components/ui/waveform-player"

export function FloatingMusicPlayer() {
  const [isOpen, setIsOpen] = React.useState(false)

  // Floating small trigger button and a popup waveform player
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end gap-2">
      {isOpen && (
        <div className="p-3 mb-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-xl animate-in slide-in-from-bottom-2 fade-in relative w-64">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 p-1 bg-neutral-200 dark:bg-neutral-800 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
          >
            <X size={14} className="text-neutral-600 dark:text-neutral-400" />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                <Disc3 size={16} className="text-neutral-900 dark:text-neutral-100" />
             </div>
             <div>
                <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">Rasputin</p>
                <p className="text-[10px] text-neutral-500 font-medium">Boney M.</p>
             </div>
          </div>
          <WaveformPlayer audioSrc="/sounds/rasputin.mp3" width="100%" height={24} className="scale-90 origin-left" />
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center hover:scale-105 transition-transform group"
          title="Play Music"
        >
          <Music size={16} className="text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100" />
        </button>
      )}
    </div>
  )
}
