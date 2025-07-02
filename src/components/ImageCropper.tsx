"use client"

import { useRef, useCallback, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Crop, RotateCcw } from "lucide-react"
import { useCrop } from "../hooks/useCrop"
import type { CropArea } from "../types"

interface ImageCropperProps {
  imageSrc: string
  imageWidth: number
  imageHeight: number
  onCropComplete: (croppedImageSrc: string, cropData: CropArea) => void
}

export function ImageCropper({ imageSrc, imageWidth, imageHeight, onCropComplete }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [displaySize] = useState({ width: 350, height: 250 })
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined)

  const { crop, isDragging, handleCropDragStart, handleResizeStart, setCrop } = useCrop({
    initialCrop: {
      x: 25,
      y: 25,
      width: Math.min(200, displaySize.width - 50),
      height: Math.min(150, displaySize.height - 50),
    },
    aspectRatio,
    minCropSize: { width: 50, height: 50 },
  })

  // Calculate scale factors
  const scaleX = imageWidth / displaySize.width
  const scaleY = imageHeight / displaySize.height

  const handleCropImage = useCallback(async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to crop size
    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    // Load and draw the image
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Draw the cropped portion
      ctx.drawImage(
        img,
        crop.x * scaleX, // source x
        crop.y * scaleY, // source y
        crop.width * scaleX, // source width
        crop.height * scaleY, // source height
        0, // destination x
        0, // destination y
        canvas.width, // destination width
        canvas.height, // destination height
      )

      // Convert to data URL and call callback
      const croppedImageSrc = canvas.toDataURL("image/png")
      onCropComplete(croppedImageSrc, {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      })
    }

    img.src = imageSrc
  }, [imageSrc, crop, scaleX, scaleY, onCropComplete])

  const resetCrop = () => {
    setCrop({
      x: 25,
      y: 25,
      width: Math.min(200, displaySize.width - 50),
      height: Math.min(150, displaySize.height - 50),
    })
  }

  const setAspectRatioPreset = (ratio: number | undefined) => {
    setAspectRatio(ratio)
    if (ratio) {
      const newHeight = crop.width / ratio
      setCrop({ ...crop, height: newHeight })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
          <Crop size={20} />
          ✂️ Crop obrázka
        </CardTitle>
      </CardHeader>
      <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Image with crop overlay */}
        <div
          style={{
            position: "relative",
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            margin: "0 auto",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#f8f9fa",
            cursor: isDragging ? "grabbing" : "default",
          }}
        >
          {/* Background image */}
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="Crop preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
            }}
          />

          {/* Crop area */}
          <div
            style={{
              position: "absolute",
              left: `${crop.x}px`,
              top: `${crop.y}px`,
              width: `${crop.width}px`,
              height: `${crop.height}px`,
              border: "2px solid #007bff",
              backgroundColor: "transparent",
              cursor: "move",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            }}
            onMouseDown={handleCropDragStart}
            onTouchStart={handleCropDragStart}
          >
            {/* Crop info label */}
            <div
              style={{
                position: "absolute",
                top: "-30px",
                left: "0",
                backgroundColor: "#007bff",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {Math.round(crop.width * scaleX)} × {Math.round(crop.height * scaleY)}px
            </div>

            {/* Resize handles */}
            <div
              style={{
                position: "absolute",
                top: "-6px",
                left: "-6px",
                width: "12px",
                height: "12px",
                backgroundColor: "#007bff",
                border: "2px solid white",
                borderRadius: "50%",
                cursor: "nw-resize",
              }}
              onMouseDown={(e) => handleResizeStart(e, "nw")}
              onTouchStart={(e) => handleResizeStart(e, "nw")}
            />
            <div
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                width: "12px",
                height: "12px",
                backgroundColor: "#007bff",
                border: "2px solid white",
                borderRadius: "50%",
                cursor: "ne-resize",
              }}
              onMouseDown={(e) => handleResizeStart(e, "ne")}
              onTouchStart={(e) => handleResizeStart(e, "ne")}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "-6px",
                width: "12px",
                height: "12px",
                backgroundColor: "#007bff",
                border: "2px solid white",
                borderRadius: "50%",
                cursor: "sw-resize",
              }}
              onMouseDown={(e) => handleResizeStart(e, "sw")}
              onTouchStart={(e) => handleResizeStart(e, "sw")}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                right: "-6px",
                width: "12px",
                height: "12px",
                backgroundColor: "#007bff",
                border: "2px solid white",
                borderRadius: "50%",
                cursor: "se-resize",
              }}
              onMouseDown={(e) => handleResizeStart(e, "se")}
              onTouchStart={(e) => handleResizeStart(e, "se")}
            />
          </div>
        </div>

        {/* Aspect ratio presets */}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
            Pomer strán:
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <Button
              size="sm"
              variant={aspectRatio === undefined ? "default" : "outline"}
              onClick={() => setAspectRatioPreset(undefined)}
            >
              Voľný
            </Button>
            <Button
              size="sm"
              variant={aspectRatio === 1 ? "default" : "outline"}
              onClick={() => setAspectRatioPreset(1)}
            >
              1:1
            </Button>
            <Button
              size="sm"
              variant={aspectRatio === 4 / 3 ? "default" : "outline"}
              onClick={() => setAspectRatioPreset(4 / 3)}
            >
              4:3
            </Button>
            <Button
              size="sm"
              variant={aspectRatio === 16 / 9 ? "default" : "outline"}
              onClick={() => setAspectRatioPreset(16 / 9)}
            >
              16:9
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="outline" onClick={resetCrop} style={{ flex: 1 }}>
            <RotateCcw size={16} style={{ marginRight: "6px" }} />
            Reset
          </Button>
          <Button onClick={handleCropImage} style={{ flex: 1 }}>
            <Crop size={16} style={{ marginRight: "6px" }} />
            Orezať
          </Button>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  )
}
