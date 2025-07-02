"use client"

import type React from "react"
import { useRef } from "react"
import { StickerItem } from "./StickerItem"
import type { Sticker } from "../types"

interface InteractiveImageProps {
  imageSrc: string
  width: number
  height: number
  stickers: Sticker[]
  onStickersChange: (stickers: Sticker[]) => void
  editable?: boolean
}

export const InteractiveImage: React.FC<InteractiveImageProps> = ({
  imageSrc,
  width,
  height,
  stickers,
  onStickersChange,
  editable = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleStickerUpdate = (updatedSticker: Sticker) => {
    const newStickers = stickers.map((sticker) => (sticker.id === updatedSticker.id ? updatedSticker : sticker))
    onStickersChange(newStickers)
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!editable) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Add new sticker at click position
      const newSticker: Sticker = {
        id: Date.now().toString(),
        type: "emoji",
        content: "✨",
        position: { x: x - 25, y: y - 25 },
        size: { width: 50, height: 50 },
      }

      onStickersChange([...stickers, newSticker])
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      style={{ width, height }}
      onClick={handleContainerClick}
    >
      <img src={imageSrc || "/placeholder.svg"} alt="Interactive" className="w-full h-full object-cover" />
      {stickers.map((sticker) => (
        <StickerItem key={sticker.id} sticker={sticker} onUpdate={handleStickerUpdate} editable={editable} />
      ))}
    </div>
  )
}
