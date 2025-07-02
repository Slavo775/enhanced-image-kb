"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Monitor, Square, Maximize } from "lucide-react"

interface DimensionControlsProps {
  width: number
  height: number
  onDimensionChange: (width: number, height: number) => void
}

const PRESETS = [
  { name: "Instagram Square", width: 1080, height: 1080, icon: Square },
  { name: "Instagram Story", width: 1080, height: 1920, icon: Smartphone },
  { name: "Facebook Post", width: 1200, height: 630, icon: Monitor },
  { name: "Twitter Header", width: 1500, height: 500, icon: Maximize },
]

export const DimensionControls: React.FC<DimensionControlsProps> = ({ width, height, onDimensionChange }) => {
  const [localWidth, setLocalWidth] = useState(width)
  const [localHeight, setLocalHeight] = useState(height)

  useEffect(() => {
    setLocalWidth(width)
    setLocalHeight(height)
  }, [width, height])

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number.parseInt(e.target.value) || 0
    setLocalWidth(newWidth)
    onDimensionChange(newWidth, localHeight)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number.parseInt(e.target.value) || 0
    setLocalHeight(newHeight)
    onDimensionChange(localWidth, newHeight)
  }

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setLocalWidth(presetWidth)
    setLocalHeight(presetHeight)
    onDimensionChange(presetWidth, presetHeight)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={localWidth}
            onChange={handleWidthChange}
            min="100"
            max="4000"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={localHeight}
            onChange={handleHeightChange}
            min="100"
            max="4000"
            className="mt-1"
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium">Presets</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {PRESETS.map((preset) => {
            const Icon = preset.icon
            return (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.width, preset.height)}
                className="justify-start text-xs"
              >
                <Icon className="w-3 h-3 mr-2" />
                {preset.name}
                <span className="ml-auto text-gray-500">
                  {preset.width}×{preset.height}
                </span>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        Current: {localWidth} × {localHeight} px
        <br />
        Aspect Ratio: {(localWidth / localHeight).toFixed(2)}:1
      </div>
    </div>
  )
}
