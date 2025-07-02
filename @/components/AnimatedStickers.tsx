"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { StickerItem } from "./StickerItem"
import type { Sticker } from "../types"

interface AnimatedStickersProps {
  stickers: Sticker[]
  onUpdate: (stickers: Sticker[]) => void
  animationEnabled?: boolean
}

export const AnimatedStickers: React.FC<AnimatedStickersProps> = ({ stickers, onUpdate, animationEnabled = true }) => {
  const [animatedStickers, setAnimatedStickers] = useState(stickers)

  useEffect(() => {
    if (!animationEnabled) {
      setAnimatedStickers(stickers)
      return
    }

    const interval = setInterval(() => {
      setAnimatedStickers((prev) =>
        prev.map((sticker) => ({
          ...sticker,
          rotation: (sticker.rotation || 0) + 1,
        })),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [animationEnabled, stickers])

  const handleStickerUpdate = (updatedSticker: Sticker) => {
    const newStickers = animatedStickers.map((sticker) => (sticker.id === updatedSticker.id ? updatedSticker : sticker))
    setAnimatedStickers(newStickers)
    onUpdate(newStickers)
  }

  return (
    <>
      {animatedStickers.map((sticker) => (
        <StickerItem key={sticker.id} sticker={sticker} onUpdate={handleStickerUpdate} />
      ))}
    </>
  )
}
