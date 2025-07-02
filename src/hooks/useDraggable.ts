"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import type { Position, DraggableOptions } from "../types"

export function useDraggable({ initialPosition, onPositionChange, containerRef, disabled = false }: DraggableOptions) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef<Position>({ x: 0, y: 0 })
  const elementStartPos = useRef<Position>(initialPosition)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return

      e.preventDefault()
      e.stopPropagation()

      const rect = dragRef.current?.getBoundingClientRect()
      if (!rect) return

      dragStartPos.current = { x: e.clientX, y: e.clientY }
      elementStartPos.current = position
      setIsDragging(true)
    },
    [disabled, position],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return

      e.preventDefault()
      e.stopPropagation()

      const touch = e.touches[0]
      dragStartPos.current = { x: touch.clientX, y: touch.clientY }
      elementStartPos.current = position
      setIsDragging(true)
    },
    [disabled, position],
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y

      let newX = elementStartPos.current.x + deltaX
      let newY = elementStartPos.current.y + deltaY

      // Constrain to container bounds
      if (containerRef?.current && dragRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const elementRect = dragRef.current.getBoundingClientRect()

        newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width))
        newY = Math.max(0, Math.min(newY, containerRect.height - elementRect.height))
      }

      const newPosition = { x: newX, y: newY }
      setPosition(newPosition)
      onPositionChange?.(newPosition)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const deltaX = touch.clientX - dragStartPos.current.x
      const deltaY = touch.clientY - dragStartPos.current.y

      let newX = elementStartPos.current.x + deltaX
      let newY = elementStartPos.current.y + deltaY

      // Constrain to container bounds
      if (containerRef?.current && dragRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const elementRect = dragRef.current.getBoundingClientRect()

        newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width))
        newY = Math.max(0, Math.min(newY, containerRect.height - elementRect.height))
      }

      const newPosition = { x: newX, y: newY }
      setPosition(newPosition)
      onPositionChange?.(newPosition)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
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
  }, [isDragging, containerRef, onPositionChange])

  return {
    position,
    isDragging,
    dragRef,
    handleMouseDown,
    handleTouchStart,
  }
}
