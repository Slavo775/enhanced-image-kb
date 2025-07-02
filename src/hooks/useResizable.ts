"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Size } from "../types"

interface UseResizableProps {
  initialSize: Size
  onSizeChange: (size: Size) => void
  minSize?: Size
  maxSize?: Size
}

export function useResizable({
  initialSize,
  onSizeChange,
  minSize = { width: 20, height: 20 },
  maxSize,
}: UseResizableProps) {
  const [size, setSize] = useState<Size>(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  const resizeStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const sizeStartRef = useRef<Size>(initialSize)

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsResizing(true)
      resizeStartRef.current = { x: e.clientX, y: e.clientY }
      sizeStartRef.current = size
    },
    [size],
  )

  const handleTouchResizeStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const touch = e.touches[0]
      setIsResizing(true)
      resizeStartRef.current = { x: touch.clientX, y: touch.clientY }
      sizeStartRef.current = size
    },
    [size],
  )

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - resizeStartRef.current.x
      const deltaY = e.clientY - resizeStartRef.current.y

      let newWidth = sizeStartRef.current.width + deltaX
      let newHeight = sizeStartRef.current.height + deltaY

      // Apply constraints
      newWidth = Math.max(minSize.width, newWidth)
      newHeight = Math.max(minSize.height, newHeight)

      if (maxSize) {
        newWidth = Math.min(maxSize.width, newWidth)
        newHeight = Math.min(maxSize.height, newHeight)
      }

      const newSize = { width: newWidth, height: newHeight }
      setSize(newSize)
      onSizeChange(newSize)
    },
    [isResizing, onSizeChange, minSize, maxSize],
  )

  const handleTouchResizeMove = useCallback(
    (e: TouchEvent) => {
      if (!isResizing) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - resizeStartRef.current.x
      const deltaY = touch.clientY - resizeStartRef.current.y

      let newWidth = sizeStartRef.current.width + deltaX
      let newHeight = sizeStartRef.current.height + deltaY

      // Apply constraints
      newWidth = Math.max(minSize.width, newWidth)
      newHeight = Math.max(minSize.height, newHeight)

      if (maxSize) {
        newWidth = Math.min(maxSize.width, newWidth)
        newHeight = Math.min(maxSize.height, newHeight)
      }

      const newSize = { width: newWidth, height: newHeight }
      setSize(newSize)
      onSizeChange(newSize)
    },
    [isResizing, onSizeChange, minSize, maxSize],
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove)
      document.addEventListener("mouseup", handleResizeEnd)
      document.addEventListener("touchmove", handleTouchResizeMove)
      document.addEventListener("touchend", handleResizeEnd)

      return () => {
        document.removeEventListener("mousemove", handleResizeMove)
        document.removeEventListener("mouseup", handleResizeEnd)
        document.removeEventListener("touchmove", handleTouchResizeMove)
        document.removeEventListener("touchend", handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd, handleTouchResizeMove])

  useEffect(() => {
    setSize(initialSize)
  }, [initialSize])

  return {
    size,
    isResizing,
    resizeRef,
    handleResizeStart,
    handleTouchResizeStart,
  }
}
