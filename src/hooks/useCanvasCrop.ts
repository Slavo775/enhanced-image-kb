"use client"

import { useState, useEffect, type RefObject } from "react"
import type { AspectRatioType } from "../types"

interface Crop {
  unit: string
  x: number
  y: number
  width: number
  height: number
}

interface UseCanvasCropProps {
  imageSrc: string
  canvasRef: RefObject<HTMLCanvasElement>
  imageRef: RefObject<HTMLImageElement>
  zoom: number
  rotation: number
  aspect: AspectRatioType
}

export function useCanvasCrop({ imageSrc, canvasRef, imageRef, zoom, rotation, aspect }: UseCanvasCropProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  })

  useEffect(() => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const image = imageRef.current

    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context state
    ctx.save()

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(zoom, zoom)

    // Draw image
    ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2, image.naturalWidth, image.naturalHeight)

    // Restore context state
    ctx.restore()
  }, [imageSrc, zoom, rotation, aspect])

  return { crop, setCrop }
}
