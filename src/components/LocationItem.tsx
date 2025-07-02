"use client"

import type React from "react"
import { DraggableItem } from "./DraggableItem"
import type { LocationItem as LocationType, Position } from "../types"

interface LocationItemProps {
  location: LocationType
  onUpdate: (location: LocationType) => void
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
  containerRef: React.RefObject<HTMLDivElement>
}

export function LocationItem({ location, onUpdate, onDelete, isSelected, onSelect, containerRef }: LocationItemProps) {
  const handlePositionChange = (id: string, position: Position) => {
    onUpdate({ ...location, position })
  }

  const handleDoubleClick = () => {
    if (window.confirm("Chcete vymazať túto lokáciu?")) {
      onDelete(location.id)
    }
  }

  return (
    <DraggableItem
      id={location.id}
      position={location.position}
      onPositionChange={handlePositionChange}
      onSelect={onSelect}
      isSelected={isSelected}
      containerRef={containerRef}
    >
      <div
        style={{
          width: location.size.width,
          height: location.size.height,
          backgroundColor: "rgba(220, 53, 69, 0.1)",
          border: "1px solid #dc3545",
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
            color: "#dc3545",
          }}
        >
          📍 {location.name}
        </span>
      </div>
    </DraggableItem>
  )
}
