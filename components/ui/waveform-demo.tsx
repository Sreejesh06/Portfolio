"use client"

import WaveformPlayer from "@/components/ui/waveform-player"

export default function DemoWaveformPlayer() {
  return (
    <div className="flex items-center justify-center p-8">
      <WaveformPlayer audioSrc="/sounds/rasputin.mp3"
        // width={360}
        // height={50}
        // className="rounded-xl shadow-md"
       />
    </div>
  )
}