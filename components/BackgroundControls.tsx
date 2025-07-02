"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RotateCcw, Maximize, Minimize, RotateCw, Move } from "lucide-react"
import type { BackgroundImageState } from "@/hooks/useInstagramEditor"

interface BackgroundControlsProps {
  backgroundState: BackgroundImageState
  onUpdate: (updates: Partial<BackgroundImageState>) => void
  onResetToFit: () => void
  onFillCanvas: () => void
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  backgroundState,
  onUpdate,
  onResetToFit,
  onFillCanvas,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move className="w-5 h-5" />
          Background Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scale Control */}
        <div>
          <Label>Zoom: {Math.round(backgroundState.scale * 100)}%</Label>
          <Slider
            value={[backgroundState.scale]}
            onValueChange={([value]) => onUpdate({ scale: value })}
            min={0.1}
            max={3}
            step={0.1}
            className="mt-2"
          />
          <div className="text-xs text-gray-500 mt-1">10% (zoom out) → 300% (zoom in)</div>
        </div>

        {/* Rotation Control */}
        <div>
          <Label>Rotation: {Math.round(backgroundState.rotation)}°</Label>
          <Slider
            value={[backgroundState.rotation]}
            onValueChange={([value]) => onUpdate({ rotation: value })}
            min={-180}
            max={180}
            step={5}
            className="mt-2"
          />
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate({ rotation: backgroundState.rotation - 90 })}
              className="bg-transparent"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate({ rotation: 0 })}
              className="bg-transparent flex-1"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate({ rotation: backgroundState.rotation + 90 })}
              className="bg-transparent"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Opacity Control */}
        <div>
          <Label>Opacity: {Math.round(backgroundState.opacity * 100)}%</Label>
          <Slider
            value={[backgroundState.opacity]}
            onValueChange={([value]) => onUpdate({ opacity: value })}
            min={0.1}
            max={1}
            step={0.1}
            className="mt-2"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={onResetToFit} className="bg-transparent">
            <Minimize className="w-4 h-4 mr-1" />
            Fit
          </Button>
          <Button variant="outline" size="sm" onClick={onFillCanvas} className="bg-transparent">
            <Maximize className="w-4 h-4 mr-1" />
            Fill
          </Button>
        </div>

        {/* Position Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate({ offsetX: 0, offsetY: 0 })}
          className="w-full bg-transparent"
        >
          Center Position
        </Button>

        {/* Info */}
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          💡 <strong>Instagram Style:</strong>
          <br />• Ťahaj obrázok pre posun
          <br />• Zoom pre zväčšenie/zmenšenie
          <br />• Rotation pre natočenie
          <br />• Stickers sa pridávajú na vrch
        </div>
      </CardContent>
    </Card>
  )
}
