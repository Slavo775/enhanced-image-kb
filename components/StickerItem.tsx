"use client"

import type React from "react"
import type { Sticker } from "@/types"
import { DraggableItem } from "./DraggableItem"

interface StickerItemProps {
  sticker: Sticker
  onUpdate: (sticker: Sticker) => void
  onClick?: (sticker: Sticker) => void
  editable?: boolean
}

export const StickerItem: React.FC<StickerItemProps> = ({ sticker, onUpdate, onClick, editable = true }) => {
  const handlePositionChange = (position: { x: number; y: number }) => {
    onUpdate({ ...sticker, position })
  }

  const handleSizeChange = (size: { width: number; height: number }) => {
    onUpdate({ ...sticker, size })
  }

  const handleRotationChange = (rotation: number) => {
    onUpdate({ ...sticker, rotation })
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!editable && onClick) {
      e.stopPropagation()
      onClick(sticker)
    }
  }

  const renderContent = () => {
    switch (sticker.type) {
      case "emoji":
        return (
          <div
            style={{
              fontSize: Math.min(sticker.size.width, sticker.size.height) * 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {sticker.content}
          </div>
        )
      case "text":
        return (
          <div
            style={{
              fontSize: Math.min(sticker.size.width, sticker.size.height) * 0.3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              fontWeight: "bold",
              textAlign: "center",
              wordBreak: "break-word",
              padding: "4px",
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
              borderRadius: "8px",
            }}
          >
            {sticker.content}
          </div>
        )
      case "svg":
        return (
          <img
            src={sticker.content || "/placeholder.svg"}
            alt="Custom Sticker"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        )
      case "image":
        return (
          <img
            src={sticker.content || "/placeholder.svg"}
            alt="Sticker"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <DraggableItem
      position={sticker.position}
      size={sticker.size}
      rotation={sticker.rotation}
      onPositionChange={handlePositionChange}
      onSizeChange={handleSizeChange}
      onRotationChange={handleRotationChange}
      editable={editable}
      className="sticker-item"
    >
      <div onClick={handleClick} style={{ width: "100%", height: "100%" }}>
        {renderContent()}
      </div>
    </DraggableItem>
  )
}
