"use client"

import { useState, useEffect, useRef } from "react"
import type { CropArea, ImageDimensions } from "../types"

interface UseCanvasCropProps {
  imageUrl: string
  initialCrop?: CropArea
  outputDimensions?: ImageDimensions
}

export function useCanvasCrop({ imageUrl, initialCrop, outputDimensions }: UseCanvasCropProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({ width: 0, height: 0 })
  const [cropArea, setCropArea] = useState<CropArea>(initialCrop || { x: 0, y: 0, width: 0, height: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load the image
  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      setImageDimensions({ width: img.width, height: img.height })

      // Set default crop area if not provided
      if (!initialCrop) {
        setCropArea({
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        })
      }

      setIsLoading(false)
    }
    img.onerror = () => {
      console.error("Failed to load image")
      setIsLoading(false)
    }
    img.src = imageUrl
  }, [imageUrl, initialCrop])

  // Draw the cropped image to canvas
  const drawCroppedImage = () => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to output dimensions or crop area
    const width = outputDimensions?.width || cropArea.width
    const height = outputDimensions?.height || cropArea.height

    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw the cropped portion of the image
    ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, width, height)
  }

  // Update canvas when crop area or image changes
  useEffect(() => {
    if (!isLoading && image) {
      drawCroppedImage()
    }
  }, [cropArea, image, isLoading, outputDimensions])

  return {
    canvasRef,
    cropArea,
    setCropArea,
    imageDimensions,
    isLoading,
    drawCroppedImage,
  }
}
