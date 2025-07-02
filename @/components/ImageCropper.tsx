"use client"

import type React from "react"
import { useCallback, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crop, Move, RotateCcw } from "lucide-react"
import { useCropLogic } from "@/hooks/useCropLogic"

interface ImageCropperProps {
  imageSrc: string
  imageWidth: number
  imageHeight: number
  cropWidth: number
  cropHeight: number
  onCropChange: (cropData: {
    x: number
    y: number
    width: number
    height: number
    scale: number
    scaledImageWidth: number
    scaledImageHeight: number
  }) => void
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  imageWidth,
  imageHeight,
  cropWidth,
  cropHeight,
  onCropChange,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 })

  const { scale, offsetX, offsetY, scaledImageWidth, scaledImageHeight, cropData, updateOffset, reset } = useCropLogic(
    imageWidth,
    imageHeight,
    cropWidth,
    cropHeight,
  )

  // Pošli crop data rodičovi
  useEffect(() => {
    onCropChange(cropData)
  }, [cropData, onCropChange])

  // Drag handling
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        startOffsetX: offsetX,
        startOffsetY: offsetY,
      })
    },
    [offsetX, offsetY],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      updateOffset(dragStart.startOffsetX + deltaX, dragStart.startOffsetY + deltaY)
    },
    [isDragging, dragStart, updateOffset],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Vypočítaj pomer strán
  const originalAspect = imageWidth / imageHeight
  const cropAspect = cropWidth / cropHeight
  const aspectMatch = Math.abs(originalAspect - cropAspect) < 0.01

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crop className="w-5 h-5" />
          Crop Preview - MATEMATICKÉ ŠKÁLOVANIE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview - PRESNÉ rozmery, ŽIADNY object-fit */}
        <div className="flex justify-center">
          <div
            className="relative border-2 border-gray-300 rounded-lg bg-gray-100"
            style={{
              width: cropWidth,
              height: cropHeight,
              maxWidth: "100%",
              maxHeight: "70vh",
              overflow: "hidden", // KRITICKÉ: orezáva čo sa nezmestí
            }}
          >
            {/* Obrázok s PRESNE vypočítanými rozmermi - ŽIADNY object-fit! */}
            <img
              src={imageSrc || "/placeholder.svg"}
              alt="Crop preview"
              className="absolute select-none"
              style={{
                // KRITICKÉ: PRESNÉ matematické rozmery
                width: `${scaledImageWidth}px`,
                height: `${scaledImageHeight}px`,
                // Pozícia pre crop
                left: `${offsetX}px`,
                top: `${offsetY}px`,
                cursor: isDragging ? "grabbing" : "grab",
                // ŽIADNY object-fit, object-position, transform scale!
                // Len presné width/height a position!
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />

            {/* Crop rám */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-blue-500 border-dashed opacity-30" />
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Crop: {cropWidth} × {cropHeight}
                <div className="text-xs opacity-75">Scale: {(scale * 100).toFixed(0)}%</div>
              </div>

              {/* Aspect ratio indicator */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {aspectMatch ? "✅ Pomer OK" : "✂️ Orezáva"}
              </div>

              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 opacity-50"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 opacity-50"></div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-600 text-center">
          <Move className="w-4 h-4 inline mr-1" />
          Ťahaj obrázok pre posun crop oblasti
          <div className="text-xs text-green-600 mt-1 font-semibold">
            ✅ MATEMATICKÉ ŠKÁLOVANIE - presné rozmery, žiadny object-fit!
          </div>
        </div>

        {/* Tlačidlá */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={reset} className="bg-transparent">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Vycentruj
              const centerX = (scaledImageWidth - cropWidth) / 2
              const centerY = (scaledImageHeight - cropHeight) / 2
              updateOffset(-centerX, -centerY)
            }}
            className="bg-transparent"
          >
            Center
          </Button>
        </div>

        {/* Detailné info */}
        <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <div>
            <strong>Originál:</strong> {imageWidth} × {imageHeight}px (pomer {(imageWidth / imageHeight).toFixed(2)}:1)
          </div>
          <div>
            <strong>Crop:</strong> {cropWidth} × {cropHeight}px (pomer {(cropWidth / cropHeight).toFixed(2)}:1)
          </div>
          <div>
            <strong>Matematický scale:</strong> {(scale * 100).toFixed(1)}%
          </div>
          <div>
            <strong>Vypočítané rozmery:</strong> {Math.round(scaledImageWidth)} × {Math.round(scaledImageHeight)}px
          </div>
          <div>
            <strong>Pozícia:</strong> ({Math.round(offsetX)}, {Math.round(offsetY)})px
          </div>
          <div>
            <strong>Crop výrez:</strong> {Math.round(cropData.width)} × {Math.round(cropData.height)}px
          </div>

          {/* Status */}
          {aspectMatch ? (
            <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded">
              ✅ Perfektný pomer strán - celý obrázok sa zmestí!
            </div>
          ) : (
            <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
              ✂️ Obrázok sa orezáva ale ZACHOVÁVA POMER STRÁN!
              <br />
              <span className="text-xs">
                Škálovaný: {Math.round(scaledImageWidth)}×{Math.round(scaledImageHeight)} → Crop: {cropWidth}×
                {cropHeight}
              </span>
              <br />
              <span className="text-xs font-semibold">ŽIADNE DEFORMÁCIE - len matematické orezávanie!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
