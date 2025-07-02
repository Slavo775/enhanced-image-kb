"use client"

import type React from "react"
import type { MentionData, Position, Size } from "../types"
import { DraggableItem } from "./DraggableItem"

interface MentionItemProps {
  mention: MentionData
  position: Position
  size: Size
  onPositionChange: (position: Position) => void
  onSizeChange: (size: Size) => void
  onClick?: (mention: MentionData) => void
  editable?: boolean
}

export const MentionItem: React.FC<MentionItemProps> = ({
  mention,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onClick,
  editable = true,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!editable && onClick) {
      e.stopPropagation()
      onClick(mention)
    }
  }

  return (
    <DraggableItem
      position={position}
      size={size}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      editable={editable}
      className="mention-item"
    >
      <div
        onClick={handleClick}
        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
        style={{ width: "100%", height: "100%" }}
      >
        {mention.avatar && (
          <img src={mention.avatar || "/placeholder.svg"} alt={mention.displayName} className="w-6 h-6 rounded-full" />
        )}
        <span>@{mention.username}</span>
      </div>
    </DraggableItem>
  )
}
