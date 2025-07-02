"use client"

import type React from "react"
import { useDraggable } from "../hooks/useDraggable"
import type { Position } from "../types"

interface DraggableItemProps {
  id: string
  position: Position
  onPositionChange: (id: string, position: Position) => void
  onSelect: (id: string) => void
  isSelected: boolean
  containerRef: React.RefObject<HTMLDivElement>
  children: React.ReactNode
}

export function DraggableItem({
  id,
  position,
  onPositionChange,
  onSelect,
  isSelected,
  containerRef,
  children,
}: DraggableItemProps) {
  const {
    position: dragPosition,
    isDragging,
    dragRef,
    handleMouseDown,
    handleTouchStart,
  } = useDraggable({
    initialPosition: position,
    onPositionChange: (newPosition) => onPositionChange(id, newPosition),
    containerRef,
  })

  return (
    <div
      ref={dragRef}
      style={{
        position: "absolute",
        left: dragPosition.x,
        top: dragPosition.y,
        cursor: isDragging ? "grabbing" : "grab",
        border: isSelected ? "2px solid #007bff" : "2px solid transparent",
        borderRadius: "4px",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      {children}
    </div>
  )
}
