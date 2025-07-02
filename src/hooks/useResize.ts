"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface UseResizeOptions {
  onResize?: (deltaWidth: number, deltaHeight: number) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
}

export const useResize = (options: UseResizeOptions = {}) => {
  const [isResizing, setIsResizing] = useState(false)
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      setLastPosition({ x: e.clientX, y: e.clientY })
      options.onResizeStart?.()

      const handleMouseMove = (e: MouseEvent) => {
        if (!lastPosition) return

        const deltaX = e.clientX - lastPosition.x
        const deltaY = e.clientY - lastPosition.y

        options.onResize?.(deltaX, deltaY)
        setLastPosition({ x: e.clientX, y: e.clientY })
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        setLastPosition(null)
        options.onResizeEnd?.()
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [lastPosition, options],
  )

  return {
    isResizing,
    handleMouseDown,
  }
}
