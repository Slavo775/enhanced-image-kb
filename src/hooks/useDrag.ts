"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface UseDragOptions {
  onDrag?: (deltaX: number, deltaY: number) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export const useDrag = (options: UseDragOptions = {}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setLastPosition({ x: e.clientX, y: e.clientY })
      options.onDragStart?.()

      const handleMouseMove = (e: MouseEvent) => {
        if (!lastPosition) return

        const deltaX = e.clientX - lastPosition.x
        const deltaY = e.clientY - lastPosition.y

        options.onDrag?.(deltaX, deltaY)
        setLastPosition({ x: e.clientX, y: e.clientY })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        setLastPosition(null)
        options.onDragEnd?.()
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [lastPosition, options],
  )

  return {
    isDragging,
    handleMouseDown,
  }
}
