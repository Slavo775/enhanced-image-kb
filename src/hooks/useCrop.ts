"use client"

import { useState, useCallback } from "react"
import type { CropArea, Size } from "../types"

interface UseCropOptions {
  onCropChange?: (cropArea: CropArea | null) => void
}

export const useCrop = (canvasSize: Size, options: UseCropOptions = {}) => {
  const [cropArea, setCropArea] = useState<CropArea | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const startCrop = useCallback((x: number, y: number) => {
    setIsDragging(true)
    setDragStart({ x, y })
    setCropArea({
      x,
      y,
      width: 0,
      height: 0,
    })
  }, [])

  const updateCrop = useCallback(
    (x: number, y: number) => {
      if (!isDragging || !dragStart) return

      const newCropArea: CropArea = {
        x: Math.min(dragStart.x, x),
        y: Math.min(dragStart.y, y),
        width: Math.abs(x - dragStart.x),
        height: Math.abs(y - dragStart.y),
      }

      // Clamp to canvas bounds
      newCropArea.x = Math.max(0, Math.min(newCropArea.x, canvasSize.width))
      newCropArea.y = Math.max(0, Math.min(newCropArea.y, canvasSize.height))
      newCropArea.width = Math.min(newCropArea.width, canvasSize.width - newCropArea.x)
      newCropArea.height = Math.min(newCropArea.height, canvasSize.height - newCropArea.y)

      setCropArea(newCropArea)
      options.onCropChange?.(newCropArea)
    },
    [isDragging, dragStart, canvasSize, options],
  )

  const endCrop = useCallback(() => {
    setIsDragging(false)
    setDragStart(null)
  }, [])

  const clearCrop = useCallback(() => {
    setCropArea(null)
    setIsDragging(false)
    setDragStart(null)
    options.onCropChange?.(null)
  }, [options])

  return {
    cropArea,
    isDragging,
    startCrop,
    updateCrop,
    endCrop,
    clearCrop,
  }
}
