"use client"

import type React from "react"
import { useCallback, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crop, Move, RotateCcw, Target } from "lucide-react"
import { useCanvasCrop, type CanvasCropData } from "@/hooks/useCanvasCrop"

interface CanvasCropperProps {
  imageSrc: string
  imageWidth: number
  imageHeight: number
  cropWidth: number
  cropHeight: number
  onCropChange: (cropData: CanvasCropData) => void
}

export const CanvasCropper: React.FC<CanvasCropperProps> = ({
  imageSrc,
  imageWidth,
  imageHeight,
  cropWidth,
  cropHeight,
  onCropChange,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 })

  const { canvasRef, cropData, previewWidth, previewHeight, loadAndRender, updateOffset, resetCrop } = useCanvasCrop(
    imageWidth,
    imageHeight,
    cropWidth,
    cropHeight,
  )

  // Load image pri zmene src
  useEffect(() => {
    if (imageSrc && imageWidth > 0 && imageHeight > 0) {
      loadAndRender(imageSrc)
    }
  }, [imageSrc, imageWidth, imageHeight, loadAndRender])

  // Pošli crop data rodičovi
  useEffect(() => {
    onCropChange(cropData)
  }, [cropData, onCropChange])

  // Mouse drag handling
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        startOffsetX: cropData.offsetX,
        startOffsetY: cropData.offsetY,
      })
    },
    [cropData],
  )

  // Touch drag handling
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
        startOffsetX: cropData.offsetX,
        startOffsetY: cropData.offsetY,
      })
    },
    [cropData],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      // Preveď delta z preview pixelov na source pixely
      const scaleToSource = 1 / cropData.scale
      const sourceDeltaX = deltaX * scaleToSource
      const sourceDeltaY = deltaY * scaleToSource

      // Inverzný pohyb - keď ťaháme doprava, crop sa posúva doľava
      const newOffsetX = dragStart.startOffsetX - sourceDeltaX
      const newOffsetY = dragStart.startOffsetY - sourceDeltaY

      updateOffset(newOffsetX, newOffsetY)
    },
    [isDragging, dragStart, cropData.scale, updateOffset],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return

      e.preventDefault()
      const touch = e.touches[0]
      const deltaX = touch.clientX - dragStart.x
      const deltaY = touch.clientY - dragStart.y

      // Preveď delta z preview pixelov na source pixely
      const scaleToSource = 1 / cropData.scale
      const sourceDeltaX = deltaX * scaleToSource
      const sourceDeltaY = deltaY * scaleToSource

      // Inverzný pohyb - keď ťaháme doprava, crop sa posúva doľava
      const newOffsetX = dragStart.startOffsetX - sourceDeltaX
      const newOffsetY = dragStart.startOffsetY - sourceDeltaY

      updateOffset(newOffsetX, newOffsetY)
    },
    [isDragging, dragStart, cropData.scale, updateOffset],
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
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Vypočítaj pomer strán a info
  const originalAspect = imageWidth / imageHeight
  const cropAspect = cropWidth / cropHeight
  const aspectMatch = Math.abs(originalAspect - cropAspect) < 0.01

  // Vypočítaj koľko z obrázka sa použije
  const coverageX = (cropData.sourceWidth / imageWidth) * 100
  const coverageY = (cropData.sourceHeight / imageHeight) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="w-5 h-5" />
          Canvas COVER Crop (Mobile Ready)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-300 rounded-lg cursor-grab active:cursor-grabbing touch-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                touchAction: "none",
              }}
            />

            {/* Overlay info */}
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              COVER: {cropWidth} × {cropHeight}px
            </div>

            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {aspectMatch ? "✅ Perfect" : "✂️ COVER"}
            </div>

            {/* Source info */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Source: {Math.round(cropData.sourceWidth)} × {Math.round(cropData.sourceHeight)}px
            </div>

            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Pos: ({Math.round(cropData.offsetX)}, {Math.round(cropData.offsetY)})
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 text-center">
          <Move className="w-4 h-4 inline mr-1" />
          Ťahaj pre posun COVER crop oblasti (Mobile & Desktop)
          <div className="text-xs text-green-600 mt-1 font-semibold">✅ COVER správanie - zachováva pomer strán!</div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={resetCrop} className="bg-transparent">
            <RotateCcw className="w-4 h-4 mr-1" />
            Center
          </Button>
          <Button variant="outline" size="sm" onClick={() => updateOffset(0, 0)} className="bg-transparent">
            <Target className="w-4 h-4 mr-1" />
            Top-Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Bottom-right
              const maxX = imageWidth - cropData.sourceWidth
              const maxY = imageHeight - cropData.sourceHeight
              updateOffset(maxX, maxY)
            }}
            className="bg-transparent"
          >
            Bottom-Right
          </Button>
        </div>

        {/* Detailed Info */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <div>
            <strong>Originálny obrázok:</strong> {imageWidth} × {imageHeight}px (pomer {originalAspect.toFixed(2)}:1)
          </div>
          <div>
            <strong>Target crop:</strong> {cropWidth} × {cropHeight}px (pomer {cropAspect.toFixed(2)}:1)
          </div>
          <div>
            <strong>Source crop (COVER):</strong> {Math.round(cropData.sourceWidth)} ×{" "}
            {Math.round(cropData.sourceHeight)}px
          </div>
          <div>
            <strong>Pozícia:</strong> ({Math.round(cropData.offsetX)}, {Math.round(cropData.offsetY)})
          </div>
          <div>
            <strong>Pokrytie:</strong> {coverageX.toFixed(1)}% × {coverageY.toFixed(1)}%
          </div>

          {/* COVER info */}
          <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
            <div className="text-xs font-semibold text-blue-800">COVER Správanie:</div>
            <div className="text-xs text-blue-600">
              • Source crop má rovnaký pomer ako target ({cropAspect.toFixed(2)}:1)
              <br />• Canvas drawImage zachováva pomer strán
              <br />• Žiadna deformácia - len orezávanie!
            </div>
          </div>

          {/* Status */}
          {aspectMatch ? (
            <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded">
              ✅ Perfektný pomer strán - celý obrázok sa zmestí bez orezania!
            </div>
          ) : (
            <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
              ✂️ COVER crop - obrázok pokryje celú oblasť s perfektným pomerom strán!
              <br />
              <span className="text-xs">
                Originál {originalAspect.toFixed(2)}:1 → Target {cropAspect.toFixed(2)}:1 → Source{" "}
                {cropAspect.toFixed(2)}:1 ✅
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
