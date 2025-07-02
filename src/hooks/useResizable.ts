"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Size, ResizableOptions } from "../types"

export function useResizable({
  initialSize,
  onSizeChange,
  minSize = { width: 20, height: 20 },
  disabled = false,
}: ResizableOptions) {
  const [size, setSize] = useState<Size>(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  const resizeStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const elementStartSize = useRef<Size>(initialSize)

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return

      e.preventDefault()
      e.stopPropagation()

      resizeStartPos.current = { x: e.clientX, y: e.clientY }
      elementStartSize.current = size
      setIsResizing(true)
    },
    [disabled, size],
  )

  const handleTouchResizeStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return

      e.preventDefault()
      e.stopPropagation()

      const touch = e.touches[0]
      resizeStartPos.current = { x: touch.clientX, y: touch.clientY }
      elementStartSize.current = size
      setIsResizing(true)
    },
    [disabled, size],
  )

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStartPos.current.x
      const deltaY = e.clientY - resizeStartPos.current.y

      const newWidth = Math.max(minSize.width, elementStartSize.current.width + deltaX)
      const newHeight = Math.max(minSize.height, elementStartSize.current.height + deltaY)

      const newSize = { width: newWidth, height: newHeight }
      setSize(newSize)
      onSizeChange?.(newSize)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const deltaX = touch.clientX - resizeStartPos.current.x
      const deltaY = touch.clientY - resizeStartPos.current.y

      const newWidth = Math.max(minSize.width, elementStartSize.current.width + deltaX)
      const newHeight = Math.max(minSize.height, elementStartSize.current.height + deltaY)

      const newSize = { width: newWidth, height: newHeight }
      setSize(newSize)
      onSizeChange?.(newSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isResizing, minSize, onSizeChange])

  return {
    size,
    isResizing,
    resizeRef,
    handleResizeStart,
    handleTouchResizeStart,
  }
}
