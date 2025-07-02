"use client"

import type React from "react"
import { useRef } from "react"
import { useDraggable } from "../hooks/useDraggable"
import { useResizable } from "../hooks/useResizable"
import type { Item } from "../types"

interface DraggableItemProps {
  item: Item
  onResize: (id: string, width: number, height: number) => void
  onDrag: (id: string, x: number, y: number) => void
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onResize, onDrag }) => {
  const itemRef = useRef<HTMLDivElement>(null)

  const { isDragging, handleMouseDown } = useDraggable(item.id, itemRef, (x, y) => {
    onDrag(item.id, x, y)
  })

  const { isResizing, handleResizeMouseDown } = useResizable(item.id, itemRef, (width, height) => {
    onResize(item.id, width, height)
  })

  return (
    <div
      ref={itemRef}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        backgroundColor: "lightblue",
        border: "1px solid black",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 100 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <div>{item.content}</div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "20px",
          height: "20px",
          backgroundColor: "lightgray",
          border: "1px solid black",
          cursor: "se-resize",
          zIndex: 101,
        }}
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}

export default DraggableItem
