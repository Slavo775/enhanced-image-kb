"use client"

import type React from "react"
import type { LocationData, Position, Size } from "../types"
import { DraggableItem } from "./DraggableItem"
import { MapPin } from "lucide-react"

interface LocationItemProps {
  location: LocationData
  position: Position
  size: Size
  onPositionChange: (position: Position) => void
  onSizeChange: (size: Size) => void
  onClick?: (location: LocationData) => void
  editable?: boolean
}

export const LocationItem: React.FC<LocationItemProps> = ({
  location,
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
      onClick(location)
    }
  }

  return (
    <DraggableItem
      position={position}
      size={size}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      editable={editable}
      className="location-item"
    >
      <div
        onClick={handleClick}
        className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
        style={{ width: "100%", height: "100%" }}
      >
        <MapPin className="w-4 h-4" />
        <span>{location.name}</span>
      </div>
    </DraggableItem>
  )
}
