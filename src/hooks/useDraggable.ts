"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Position } from "../types"

interface UseDraggableProps {
  initialPosition: Position
  onPositionChange: (position: Position) => void
  containerRef: React.RefObject<HTMLDivElement>
}

export function useDraggable({ initialPosition, onPositionChange, containerRef }: UseDraggableProps) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const elementStartRef = useRef<Position>(initialPosition)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      elementStartRef.current = position
    },
    [position],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const touch = e.touches[0]
      setIsDragging(true)
      dragStartRef.current = { x: touch.clientX, y: touch.clientY }
      elementStartRef.current = position
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newPosition = {
        x: Math.max(0, elementStartRef.current.x + deltaX),
        y: Math.max(0, elementStartRef.current.y + deltaY),
      }

      // Constrain to container bounds
      if (containerRef.current && dragRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const elementRect = dragRef.current.getBoundingClientRect()

        newPosition.x = Math.min(newPosition.x, containerRect.width - elementRect.width)
        newPosition.y = Math.min(newPosition.y, containerRect.height - elementRect.height)
      }

      setPosition(newPosition)
      onPositionChange(newPosition)
    },
    [isDragging, onPositionChange, containerRef],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - dragStartRef.current.x
      const deltaY = touch.clientY - dragStartRef.current.y

      const newPosition = {
        x: Math.max(0, elementStartRef.current.x + deltaX),
        y: Math.max(0, elementStartRef.current.y + deltaY),
      }

      // Constrain to container bounds
      if (containerRef.current && dragRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const elementRect = dragRef.current.getBoundingClientRect()

        newPosition.x = Math.min(newPosition.x, containerRect.width - elementRect.width)
        newPosition.y = Math.min(newPosition.y, containerRect.height - elementRect.height)
      }

      setPosition(newPosition)
      onPositionChange(newPosition)
    },
    [isDragging, onPositionChange, containerRef],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  useEffect(() => {
    setPosition(initialPosition)
  }, [initialPosition])

  return {
    position,
    isDragging,
    dragRef,
    handleMouseDown,
    handleTouchStart,
  }
}
