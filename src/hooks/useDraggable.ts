"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import type { Position } from "../types"

export interface DraggableState {
  isDragging: boolean
  dragOffset: Position
  position: Position
}

export const useDraggable = (
  initialPosition: Position,
  onPositionChange: (position: Position) => void,
  editable = true,
) => {
  const [state, setState] = useState<DraggableState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    position: initialPosition,
  })

  const dragRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (!editable || !dragRef.current) return

      const rect = dragRef.current.getBoundingClientRect()
      const offsetX = clientX - rect.left
      const offsetY = clientY - rect.top

      setState((prev) => ({
        ...prev,
        isDragging: true,
        dragOffset: { x: offsetX, y: offsetY },
      }))
    },
    [editable],
  )

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!state.isDragging || !editable || !dragRef.current) return

      const parentRect = dragRef.current.parentElement?.getBoundingClientRect()
      if (!parentRect) return

      const newX = clientX - parentRect.left - state.dragOffset.x
      const newY = clientY - parentRect.top - state.dragOffset.y

      const newPosition = {
        x: newX,
        y: newY,
      }

      // Constrain to container bounds
      const maxX = parentRect.width - (dragRef.current.offsetWidth || 0)
      const maxY = parentRect.height - (dragRef.current.offsetHeight || 0)

      newPosition.x = Math.max(0, Math.min(maxX, newPosition.x))
      newPosition.y = Math.max(0, Math.min(maxY, newPosition.y))

      onPositionChange(newPosition)
      setState((prev) => ({
        ...prev,
        position: newPosition,
      }))
    },
    [state.isDragging, state.dragOffset, onPositionChange, editable],
  )

  const handleEnd = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDragging: false,
    }))
  }, [])

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleStart(e.clientX, e.clientY)
    },
    [handleStart],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    },
    [handleMove],
  )

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    },
    [handleStart],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    },
    [handleMove],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      handleEnd()
    },
    [handleEnd],
  )

  // Add global event listeners
  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return {
    dragRef,
    isDragging: state.isDragging,
    position: state.position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
