"use client"

import type React from "react"
import { useState } from "react"
import { StickerItem } from "../components/StickerItem"
import type { Sticker } from "../types"

export const Demo: React.FC = () => {
  const [stickers, setStickers] = useState<Sticker[]>([
    {
      id: "1",
      type: "emoji",
      content: "😀",
      position: { x: 100, y: 100 },
      size: { width: 60, height: 60 },
    },
    {
      id: "2",
      type: "text",
      content: "Hello World!",
      position: { x: 200, y: 150 },
      size: { width: 120, height: 40 },
    },
  ])

  const updateSticker = (updatedSticker: Sticker) => {
    setStickers((prev) => prev.map((sticker) => (sticker.id === updatedSticker.id ? updatedSticker : sticker)))
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
      <h2 className="absolute top-2 left-2 text-lg font-bold">Draggable Items Demo</h2>
      {stickers.map((sticker) => (
        <StickerItem key={sticker.id} sticker={sticker} onUpdate={updateSticker} />
      ))}
    </div>
  )
}
