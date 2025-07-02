"use client"

import type React from "react"
import { clsx } from "clsx"
import type { DraggableItemProps } from "@/types"
import { useDraggable } from "@/hooks/useDraggable"
import { useResizable } from "@/hooks/useResizable"

export const DraggableItem: React.FC<DraggableItemProps> = ({
  children,
  position,
  size,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  rotation = 0,
  editable = true,
  className,
}) => {
  const { elementRef, isDragging, handleMouseDown } = useDraggable(position, onPositionChange, editable)

  const { isResizing, handleResizeStart } = useResizable(size, onSizeChange, editable)

  const style: React.CSSProperties = {
    position: "absolute",
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    transform: `rotate(${rotation}deg)`,
    cursor: isDragging ? "grabbing" : editable ? "grab" : "pointer",
    userSelect: "none",
    zIndex: isDragging || isResizing ? 1000 : 1,
  }

  return (
    <div
      ref={elementRef}
      style={style}
      className={clsx(
        "draggable-item",
        {
          dragging: isDragging,
          resizing: isResizing,
          editable: editable,
        },
        className,
      )}
      onMouseDown={handleMouseDown}
    >
      {children}

      {editable && (
        <>
          {/* Resize handles */}
          <div
            className="resize-handle resize-handle-se"
            style={{
              position: "absolute",
              bottom: -4,
              right: -4,
              width: 8,
              height: 8,
              backgroundColor: "#007AFF",
              borderRadius: "50%",
              cursor: "se-resize",
              border: "2px solid white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />

          {/* Rotation handle */}
          {onRotationChange && (
            <div
              className="rotation-handle"
              style={{
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                width: 16,
                height: 16,
                backgroundColor: "#007AFF",
                borderRadius: "50%",
                cursor: "grab",
                border: "2px solid white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Implement rotation logic here
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
