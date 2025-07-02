"use client"

import type React from "react"
import { useCallback, useRef } from "react"
import { useDrag } from "../hooks/useDrag"
import { useResize } from "../hooks/useResize"
import type { StickerItem as StickerItemType } from "../types"

interface StickerItemProps {
  sticker: StickerItemType
  isSelected: boolean
  onUpdate: (id: string, updates: Partial<StickerItemType>) => void
  onSelect: (id: string) => void
}

export const StickerItem: React.FC<StickerItemProps> = ({ sticker, isSelected, onUpdate, onSelect }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  const { isDragging, handleMouseDown: handleDragStart } = useDrag({
    onDrag: useCallback(
      (deltaX: number, deltaY: number) => {
        onUpdate(sticker.id, {
          position: {
            x: sticker.position.x + deltaX,
            y: sticker.position.y + deltaY,
          },
        })
      },
      [sticker.id, sticker.position, onUpdate],
    ),
  })

  const { isResizing, handleMouseDown: handleResizeStart } = useResize({
    onResize: useCallback(
      (deltaWidth: number, deltaHeight: number) => {
        const newWidth = Math.max(20, sticker.size.width + deltaWidth)
        const newHeight = Math.max(20, sticker.size.height + deltaHeight)

        onUpdate(sticker.id, {
          size: {
            width: newWidth,
            height: newHeight,
          },
        })
      },
      [sticker.id, sticker.size, onUpdate],
    ),
  })

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(sticker.id)
    },
    [sticker.id, onSelect],
  )

  const handleRotate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const newRotation = (sticker.rotation + 15) % 360
      onUpdate(sticker.id, { rotation: newRotation })
    },
    [sticker.id, sticker.rotation, onUpdate],
  )

  const renderContent = () => {
    const fontSize = Math.min(sticker.size.width, sticker.size.height) * 0.6

    if (sticker.type === "emoji") {
      return (
        <div
          style={{
            fontSize: `${fontSize}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            userSelect: "none",
          }}
        >
          {sticker.content}
        </div>
      )
    }

    const textStyle: React.CSSProperties = {
      fontSize: `${fontSize * 0.5}px`,
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      textAlign: "center",
      userSelect: "none",
      wordBreak: "break-word",
      padding: "4px",
    }

    if (sticker.type === "mention") {
      return <div style={{ ...textStyle, color: "#007bff" }}>@{sticker.content}</div>
    }

    if (sticker.type === "location") {
      return <div style={{ ...textStyle, color: "#28a745" }}>📍 {sticker.content}</div>
    }

    return <div style={{ ...textStyle, color: "#333" }}>{sticker.content}</div>
  }

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${sticker.position.x}px`,
        top: `${sticker.position.y}px`,
        width: `${sticker.size.width}px`,
        height: `${sticker.size.height}px`,
        transform: `rotate(${sticker.rotation}deg)`,
        opacity: sticker.opacity,
        cursor: isDragging ? "grabbing" : "grab",
        border: isSelected ? "2px solid #007bff" : "2px solid transparent",
        borderRadius: "4px",
        zIndex: sticker.zIndex,
        background: isSelected ? "rgba(0, 123, 255, 0.1)" : "transparent",
      }}
      onClick={handleClick}
      onMouseDown={handleDragStart}
    >
      {renderContent()}

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Resize handle */}
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              right: "-6px",
              width: "12px",
              height: "12px",
              background: "#007bff",
              border: "2px solid #fff",
              borderRadius: "50%",
              cursor: "se-resize",
              zIndex: 1000,
            }}
            onMouseDown={handleResizeStart}
          />

          {/* Rotate handle */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-6px",
              width: "12px",
              height: "12px",
              background: "#28a745",
              border: "2px solid #fff",
              borderRadius: "50%",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onClick={handleRotate}
            title="Rotate 15°"
          />
        </>
      )}
    </div>
  )
}
