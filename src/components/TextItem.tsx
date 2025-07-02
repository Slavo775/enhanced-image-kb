"use client"

import type React from "react"
import { useCallback } from "react"
import type { TextItem } from "../types"
import { useDraggable } from "../hooks/useDraggable"
import { useResizable } from "../hooks/useResizable"

interface TextItemProps {
  text: TextItem
  onUpdate: (text: TextItem) => void
  onClick?: (text: TextItem) => void
  editable?: boolean
}

export const TextItemComponent: React.FC<TextItemProps> = ({ text, onUpdate, onClick, editable = true }) => {
  const handleClick = useCallback(() => {
    onClick?.(text)
  }, [onClick, text])

  const handleDragEnd = useCallback(
    (x: number, y: number) => {
      onUpdate({
        ...text,
        position: { x, y },
      })
    },
    [text, onUpdate],
  )

  const handleResizeEnd = useCallback(
    (width: number, height: number) => {
      onUpdate({
        ...text,
        size: { width, height },
      })
    },
    [text, onUpdate],
  )

  const handleRotate = useCallback(() => {
    onUpdate({
      ...text,
      rotation: (text.rotation || 0) + 15,
    })
  }, [text, onUpdate])

  const { dragRef } = useDraggable({
    initialPosition: text.position,
    onDragEnd: handleDragEnd,
    disabled: !editable,
  })

  const { resizeRef, resizeHandles } = useResizable({
    initialSize: text.size,
    onResizeEnd: handleResizeEnd,
    minWidth: 50,
    minHeight: 30,
    disabled: !editable,
  })

  return (
    <div
      ref={dragRef}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: editable ? "move" : "default",
        transform: text.rotation ? `rotate(${text.rotation}deg)` : undefined,
        transformOrigin: "center center",
      }}
      onClick={handleClick}
    >
      <div
        ref={resizeRef}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: text.backgroundColor || "transparent",
          borderRadius: "4px",
          overflow: "hidden",
          color: text.color || "#ffffff",
          fontFamily: text.fontFamily || "Arial, sans-serif",
          fontSize: text.fontSize || "16px",
          fontWeight: text.fontWeight || "normal",
          textAlign: "center",
          padding: "4px",
          boxSizing: "border-box",
          textShadow: text.shadow ? "1px 1px 2px rgba(0,0,0,0.5)" : "none",
          opacity: text.opacity || 1,
        }}
      >
        {text.content}
      </div>

      {editable && resizeHandles}

      {editable && (
        <button
          onClick={handleRotate}
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          ↻
        </button>
      )}
    </div>
  )
}
