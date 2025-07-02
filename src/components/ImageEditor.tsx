"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useCanvasCrop } from "../hooks/useCanvasCrop"
import { useImageExport } from "../hooks/useImageExport"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { AspectRatioType } from "../types"

interface ImageEditorProps {
  imageSrc: string
  onSave: (blob: Blob) => void
  onCancel: () => void
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState<AspectRatioType>("original")
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [exportWidth, setExportWidth] = useState(500)
  const [exportHeight, setExportHeight] = useState(500)

  const { crop, setCrop } = useCanvasCrop({
    imageSrc,
    canvasRef,
    imageRef,
    zoom,
    rotation,
    aspect,
  })

  const { exportImage } = useImageExport({
    imageSrc,
    crop,
    zoom,
    rotation,
    aspect,
  })

  useEffect(() => {
    setCrop({
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    })
  }, [imageSrc, setCrop])

  const handleImageLoad = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const image = imageRef.current
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      setExportWidth(image.naturalWidth)
      setExportHeight(image.naturalHeight)
    }
  }

  const handleZoomChange = (value: number) => {
    setZoom(value)
  }

  const handleRotationChange = (value: number) => {
    setRotation(value)
  }

  const handleAspectChange = (value: AspectRatioType) => {
    setAspect(value)
  }

  const handleSave = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const blob = await exportImage(canvas, exportWidth, exportHeight)
      if (blob) {
        onSave(blob)
      }
    }
  }

  const handleCancelClick = () => {
    onCancel()
  }

  const handleExportOptionsOpen = () => {
    setShowExportOptions(true)
  }

  const handleExportOptionsClose = () => {
    setShowExportOptions(false)
  }

  const handleExportWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExportWidth(Number.parseInt(e.target.value))
  }

  const handleExportHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExportHeight(Number.parseInt(e.target.value))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        <img
          ref={imageRef}
          src={imageSrc || "/placeholder.svg"}
          alt="Source"
          style={{ display: "none" }}
          onLoad={handleImageLoad}
        />
      </div>

      <div className="p-4">
        <div className="mb-4">
          <Label htmlFor="zoom">Zoom:</Label>
          <Slider id="zoom" min={1} max={3} step={0.1} value={zoom} onValueChange={handleZoomChange} />
        </div>

        <div className="mb-4">
          <Label htmlFor="rotation">Rotation:</Label>
          <Slider id="rotation" min={-180} max={180} step={1} value={rotation} onValueChange={handleRotationChange} />
        </div>

        <div className="mb-4">
          <Label>Aspect Ratio:</Label>
          <Select onValueChange={handleAspectChange} defaultValue={aspect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select aspect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">Original</SelectItem>
              <SelectItem value="1/1">1:1</SelectItem>
              <SelectItem value="4/3">4:3</SelectItem>
              <SelectItem value="16/9">16:9</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={handleCancelClick}>
            Cancel
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Save</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Export Options</DialogTitle>
                <DialogDescription>Customize the dimensions of the exported image.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="width" className="text-right">
                    Width
                  </Label>
                  <input
                    type="number"
                    id="width"
                    value={exportWidth}
                    onChange={handleExportWidthChange}
                    className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-right">
                    Height
                  </Label>
                  <input
                    type="number"
                    id="height"
                    value={exportHeight}
                    onChange={handleExportHeightChange}
                    className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Export</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
