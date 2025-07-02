"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"
import { RotateCcw, Settings } from "lucide-react"

interface BackgroundControlsProps {
  backgroundState?: {
    scale: number
    rotation: number
    offsetX: number
    offsetY: number
    opacity: number
  }
  onUpdate: (updates: any) => void
  onResetToFit: () => void
  onFillCanvas: () => void
}

export function BackgroundControls({
  backgroundState = {
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    opacity: 1,
  },
  onUpdate,
  onResetToFit,
  onFillCanvas,
}: BackgroundControlsProps) {
  const handleReset = () => {
    onUpdate({
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
    })
  }

  const updateSetting = (key: string, value: number) => {
    onUpdate({ [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4" />
          🎛️ Background Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Transform Controls */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-gray-700">Transformations</h4>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-xs font-medium">Scale: {backgroundState.scale.toFixed(2)}x</label>
              <Slider
                value={[backgroundState.scale]}
                onValueChange={(value) => updateSetting("scale", value[0])}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-medium">Rotation: {backgroundState.rotation}°</label>
              <Slider
                value={[backgroundState.rotation]}
                onValueChange={(value) => updateSetting("rotation", value[0])}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-medium">Offset X: {backgroundState.offsetX}px</label>
              <Slider
                value={[backgroundState.offsetX]}
                onValueChange={(value) => updateSetting("offsetX", value[0])}
                min={-200}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-medium">Offset Y: {backgroundState.offsetY}px</label>
              <Slider
                value={[backgroundState.offsetY]}
                onValueChange={(value) => updateSetting("offsetY", value[0])}
                min={-200}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-medium">
                Opacity: {Math.round(backgroundState.opacity * 100)}%
              </label>
              <Slider
                value={[backgroundState.opacity]}
                onValueChange={(value) => updateSetting("opacity", value[0])}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} size="sm" className="flex-1 bg-transparent">
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          <Button variant="outline" onClick={onResetToFit} size="sm" className="flex-1 bg-transparent">
            Fit
          </Button>
          <Button variant="outline" onClick={onFillCanvas} size="sm" className="flex-1 bg-transparent">
            Fill
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
