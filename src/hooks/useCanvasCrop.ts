"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export interface CanvasCropData {
  // Crop pozícia v originálnom obrázku (s COVER správaním)
  sourceX: number
  sourceY: number
  sourceWidth: number
  sourceHeight: number
  // Canvas rozmery (finálne crop rozmery)
  canvasWidth: number
  canvasHeight: number
  // Scale pre UI
  scale: number
  // Offset pre drag
  offsetX: number
  offsetY: number
}

export const useCanvasCrop = (imageWidth: number, imageHeight: number, cropWidth: number, cropHeight: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Offset pre drag (v source pixeloch)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  // Vypočítaj scale pre preview
  const previewScale = Math.min(1, Math.min(400 / cropWidth, 300 / cropHeight))
  const previewWidth = cropWidth * previewScale
  const previewHeight = cropHeight * previewScale

  // KRITICKÉ: Vypočítaj COVER source rozmery
  const calculateCoverSource = useCallback(() => {
    if (imageWidth <= 0 || imageHeight <= 0 || cropWidth <= 0 || cropHeight <= 0) {
      return { sourceWidth: 0, sourceHeight: 0, maxOffsetX: 0, maxOffsetY: 0 }
    }

    const imageAspect = imageWidth / imageHeight
    const cropAspect = cropWidth / cropHeight

    let sourceWidth: number, sourceHeight: number

    if (imageAspect > cropAspect) {
      // Obrázok je širší ako crop - škáluj podľa výšky
      sourceHeight = imageHeight
      sourceWidth = sourceHeight * cropAspect
    } else {
      // Obrázok je vyšší ako crop - škáluj podľa šírky
      sourceWidth = imageWidth
      sourceHeight = sourceWidth / cropAspect
    }

    // Maximálny offset aby source crop nevyšiel z obrázka
    const maxOffsetX = Math.max(0, imageWidth - sourceWidth)
    const maxOffsetY = Math.max(0, imageHeight - sourceHeight)

    return { sourceWidth, sourceHeight, maxOffsetX, maxOffsetY }
  }, [imageWidth, imageHeight, cropWidth, cropHeight])

  // Reset offset pri zmene rozmerov
  useEffect(() => {
    const { maxOffsetX, maxOffsetY } = calculateCoverSource()
    // Vycentruj
    setOffsetX(maxOffsetX / 2)
    setOffsetY(maxOffsetY / 2)
  }, [calculateCoverSource])

  // Aktuálne crop data s COVER správaním
  const cropData: CanvasCropData = (() => {
    const { sourceWidth, sourceHeight, maxOffsetX, maxOffsetY } = calculateCoverSource()

    // Obmedz offset
    const clampedOffsetX = Math.max(0, Math.min(maxOffsetX, offsetX))
    const clampedOffsetY = Math.max(0, Math.min(maxOffsetY, offsetY))

    return {
      sourceX: clampedOffsetX,
      sourceY: clampedOffsetY,
      sourceWidth,
      sourceHeight,
      canvasWidth: cropWidth,
      canvasHeight: cropHeight,
      scale: previewScale,
      offsetX: clampedOffsetX,
      offsetY: clampedOffsetY,
    }
  })()

  // Render crop na canvas s COVER správaním
  const renderCrop = useCallback(
    (imageSrc: string) => {
      const canvas = canvasRef.current
      const img = imageRef.current
      if (!canvas || !img) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Nastav canvas rozmery na preview
      canvas.width = previewWidth
      canvas.height = previewHeight
      canvas.style.width = `${previewWidth}px`
      canvas.style.height = `${previewHeight}px`

      // Vyčisti canvas
      ctx.clearRect(0, 0, previewWidth, previewHeight)

      // KRITICKÉ: Render s COVER správaním - pomer strán sa zachová!
      ctx.drawImage(
        img,
        cropData.sourceX, // source x (s offsetom)
        cropData.sourceY, // source y (s offsetom)
        cropData.sourceWidth, // source width (COVER rozmery)
        cropData.sourceHeight, // source height (COVER rozmery)
        0, // dest x
        0, // dest y
        previewWidth, // dest width (scaled preview)
        previewHeight, // dest height (scaled preview)
      )

      // Nakresli crop rám
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(0, 0, previewWidth, previewHeight)
      ctx.setLineDash([])
    },
    [previewWidth, previewHeight, cropData],
  )

  // Load image a render
  const loadAndRender = useCallback(
    (imageSrc: string) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        imageRef.current = img
        renderCrop(imageSrc)
      }
      img.src = imageSrc
    },
    [renderCrop],
  )

  // Update offset
  const updateOffset = useCallback((newOffsetX: number, newOffsetY: number) => {
    setOffsetX(newOffsetX)
    setOffsetY(newOffsetY)
  }, [])

  // Reset crop na stred
  const resetCrop = useCallback(() => {
    const { maxOffsetX, maxOffsetY } = calculateCoverSource()
    setOffsetX(maxOffsetX / 2)
    setOffsetY(maxOffsetY / 2)
  }, [calculateCoverSource])

  // Re-render pri zmene
  useEffect(() => {
    if (imageRef.current) {
      renderCrop(imageRef.current.src)
    }
  }, [offsetX, offsetY, renderCrop])

  return {
    canvasRef,
    cropData,
    previewWidth,
    previewHeight,
    loadAndRender,
    updateOffset,
    resetCrop,
    renderCrop,
  }
}
