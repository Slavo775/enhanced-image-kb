"use client"

import React from "react"
import { useState, useCallback, useRef } from "react"
import type { Size, Position } from "@/types"

export const useResizable = (initialSize: Size, onSizeChange: (size: Size) => void, editable = true) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string>("")
  const startPos = useRef<Position>({ x: 0, y: 0 })
  const startSize = useRef<Size>({ width: 0, height: 0 })

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: string) => {
      if (!editable) return

      e.preventDefault()
      e.stopPropagation()

      setIsResizing(true)
      setResizeHandle(handle)
      startPos.current = { x: e.clientX, y: e.clientY }
      startSize.current = { ...initialSize }
    },
    [editable, initialSize],
  )

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !editable) return

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      const newSize = { ...startSize.current }

      switch (resizeHandle) {
        case "se": // Southeast
          newSize.width = Math.max(20, startSize.current.width + deltaX)
          newSize.height = Math.max(20, startSize.current.height + deltaY)
          break
        case "sw": // Southwest
          newSize.width = Math.max(20, startSize.current.width - deltaX)
          newSize.height = Math.max(20, startSize.current.height + deltaY)
          break
        case "ne": // Northeast
          newSize.width = Math.max(20, startSize.current.width + deltaX)
          newSize.height = Math.max(20, startSize.current.height - deltaY)
          break
        case "nw": // Northwest
          newSize.width = Math.max(20, startSize.current.width - deltaX)
          newSize.height = Math.max(20, startSize.current.height - deltaY)
          break
      }

      onSizeChange(newSize)
    },
    [isResizing, resizeHandle, onSizeChange, editable],
  )

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizeHandle("")
  }, [])

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove)
      document.addEventListener("mouseup", handleResizeEnd)

      return () => {
        document.removeEventListener("mousemove", handleResizeMove)
        document.removeEventListener("mouseup", handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  return {
    isResizing,
    handleResizeStart,
  }
}
