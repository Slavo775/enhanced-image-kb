"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Slider } from "./ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { CropPreset, StickerItem, MentionItem, LocationItem, ImageData } from "../types"

interface ControlPanelProps {
  imageData: ImageData | null
  cropPreset: CropPreset | null
  onCropPresetChange: (preset: CropPreset) => void
  onImageUpdate: (imageData: ImageData) => void
  onAddSticker: (sticker: StickerItem) => void
  onAddMention: (mention: MentionItem) => void
  onAddLocation: (location: LocationItem) => void
  onExport: () => void
}

const CROP_PRESETS: CropPreset[] = [
  { name: "Instagram Post", width: 500, height: 500, aspectRatio: 1 },
  { name: "Instagram Story", width: 375, height: 667, aspectRatio: 9 / 16 },
  { name: "Facebook Post", width: 600, height: 315, aspectRatio: 1.91 },
  { name: "Twitter Post", width: 600, height: 335, aspectRatio: 1.79 },
  { name: "YouTube Thumbnail", width: 640, height: 360, aspectRatio: 16 / 9 },
]

const EMOJI_STICKERS = ["😀", "😍", "🔥", "💯", "👍", "❤️", "🎉", "✨", "🚀", "💪"]

export function ControlPanel({
  imageData,
  cropPreset,
  onCropPresetChange,
  onImageUpdate,
  onAddSticker,
  onAddMention,
  onAddLocation,
  onExport,
}: ControlPanelProps) {
  const [newMention, setNewMention] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newText, setNewText] = useState("")

  const handleAddMention = () => {
    if (!newMention.trim()) return

    const mention: MentionItem = {
      id: Date.now().toString(),
      username: newMention.trim(),
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: 120,
      height: 30,
      rotation: 0,
      scale: 1,
    }

    onAddMention(mention)
    setNewMention("")
  }

  const handleAddLocation = () => {
    if (!newLocation.trim()) return

    const location: LocationItem = {
      id: Date.now().toString(),
      name: newLocation.trim(),
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: 150,
      height: 30,
      rotation: 0,
      scale: 1,
    }

    onAddLocation(location)
    setNewLocation("")
  }

  const handleAddTextSticker = () => {
    if (!newText.trim()) return

    const sticker: StickerItem = {
      id: Date.now().toString(),
      type: "text",
      content: newText.trim(),
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: 100,
      height: 40,
      rotation: 0,
      scale: 1,
      fontSize: 20,
      color: "#000",
    }

    onAddSticker(sticker)
    setNewText("")
  }

  const handleAddEmojiSticker = (emoji: string) => {
    const sticker: StickerItem = {
      id: Date.now().toString(),
      type: "emoji",
      content: emoji,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: 50,
      height: 50,
      rotation: 0,
      scale: 1,
      fontSize: 40,
    }

    onAddSticker(sticker)
  }

  return (
    <div className="space-y-4">
      {/* Crop Presets */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">📐 Crop Format</h3>
        <Select
          value={cropPreset?.name || ""}
          onValueChange={(value) => {
            const preset = CROP_PRESETS.find((p) => p.name === value)
            if (preset) onCropPresetChange(preset)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyberte formát" />
          </SelectTrigger>
          <SelectContent>
            {CROP_PRESETS.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                {preset.name} ({preset.width}×{preset.height})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Image Controls */}
      {imageData && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">🖼️ Obrázok</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Scale: {Math.round(imageData.scale * 100)}%</label>
              <Slider
                value={[imageData.scale]}
                onValueChange={([value]) => onImageUpdate({ ...imageData, scale: value })}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rotácia: {imageData.rotation}°</label>
              <Slider
                value={[imageData.rotation]}
                onValueChange={([value]) => onImageUpdate({ ...imageData, rotation: value })}
                min={-180}
                max={180}
                step={1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Opacity: {Math.round(imageData.opacity * 100)}%</label>
              <Slider
                value={[imageData.opacity]}
                onValueChange={([value]) => onImageUpdate({ ...imageData, opacity: value })}
                min={0}
                max={1}
                step={0.1}
                className="mt-1"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Emoji Stickers */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">😀 Emoji Stickers</h3>
        <div className="grid grid-cols-5 gap-2">
          {EMOJI_STICKERS.map((emoji) => (
            <Button
              key={emoji}
              variant="outline"
              className="text-2xl p-2 h-12 bg-transparent"
              onClick={() => handleAddEmojiSticker(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </Card>

      {/* Text Sticker */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">📝 Text Sticker</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Napíšte text..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTextSticker()}
          />
          <Button onClick={handleAddTextSticker}>Pridať</Button>
        </div>
      </Card>

      {/* Mentions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">👤 Mentions</h3>
        <div className="flex gap-2">
          <Input
            placeholder="@username"
            value={newMention}
            onChange={(e) => setNewMention(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddMention()}
          />
          <Button onClick={handleAddMention}>Pridať</Button>
        </div>
      </Card>

      {/* Locations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">📍 Locations</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Názov miesta"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddLocation()}
          />
          <Button onClick={handleAddLocation}>Pridať</Button>
        </div>
      </Card>

      {/* Export */}
      <Card className="p-4">
        <Button onClick={onExport} className="w-full" size="lg">
          📥 Export obrázka
        </Button>
      </Card>
    </div>
  )
}
