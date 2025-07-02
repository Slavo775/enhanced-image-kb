"use client"

import type React from "react"
import { DraggableItem } from "./DraggableItem"
import type { MentionItem as MentionType, Position } from "../types"

interface MentionItemProps {
  mention: MentionType
  onUpdate: (mention: MentionType) => void
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
  containerRef: React.RefObject<HTMLDivElement>
}

export function MentionItem({ mention, onUpdate, onDelete, isSelected, onSelect, containerRef }: MentionItemProps) {
  const handlePositionChange = (id: string, position: Position) => {
    onUpdate({ ...mention, position })
  }

  const handleDoubleClick = () => {
    if (window.confirm("Chcete vymazať tento mention?")) {
      onDelete(mention.id)
    }
  }

  return (
    <DraggableItem
      id={mention.id}
      position={mention.position}
      onPositionChange={handlePositionChange}
      onSelect={onSelect}
      isSelected={isSelected}
      containerRef={containerRef}
    >
      <div
        style={{
          width: mention.size.width,
          height: mention.size.height,
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          border: "1px solid #007bff",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 12px",
          userSelect: "none",
        }}
        onDoubleClick={handleDoubleClick}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#007bff",
          }}
        >
          @{mention.username}
        </span>
      </div>
    </DraggableItem>
  )
}
