"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"
import { RotateCcw, Settings } from "lucide-react"
import type { BackgroundSettings } from "../types"

interface BackgroundControlsProps {
  settings: BackgroundSettings
  onSettingsChange: (settings: BackgroundSettings) => void
}

export function BackgroundControls({ settings, onSettingsChange }: BackgroundControlsProps) {
  const handleReset = () => {
    onSettingsChange({
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      blur: 0,
    })
  }

  const updateSetting = (key: keyof BackgroundSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
          <Settings size={20} />
          🎛️ Nastavenia pozadia
        </CardTitle>
      </CardHeader>
      <CardContent style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Transform Controls */}
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>Transformácie</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Mierka: {settings.scale.toFixed(2)}x
              </label>
              <Slider
                value={settings.scale}
                onChange={(value) => updateSetting("scale", value)}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Rotácia: {settings.rotation}°
              </label>
              <Slider
                value={settings.rotation}
                onChange={(value) => updateSetting("rotation", value)}
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Posun X: {settings.offsetX}px
              </label>
              <Slider
                value={settings.offsetX}
                onChange={(value) => updateSetting("offsetX", value)}
                min={-200}
                max={200}
                step={1}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Posun Y: {settings.offsetY}px
              </label>
              <Slider
                value={settings.offsetY}
                onChange={(value) => updateSetting("offsetY", value)}
                min={-200}
                max={200}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Visual Effects */}
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>
            Vizuálne efekty
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Priehľadnosť: {Math.round(settings.opacity * 100)}%
              </label>
              <Slider
                value={settings.opacity}
                onChange={(value) => updateSetting("opacity", value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Jas: {Math.round(settings.brightness * 100)}%
              </label>
              <Slider
                value={settings.brightness}
                onChange={(value) => updateSetting("brightness", value)}
                min={0}
                max={2}
                step={0.01}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Kontrast: {Math.round(settings.contrast * 100)}%
              </label>
              <Slider
                value={settings.contrast}
                onChange={(value) => updateSetting("contrast", value)}
                min={0}
                max={2}
                step={0.01}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Sýtosť: {Math.round(settings.saturation * 100)}%
              </label>
              <Slider
                value={settings.saturation}
                onChange={(value) => updateSetting("saturation", value)}
                min={0}
                max={2}
                step={0.01}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                Rozmazanie: {settings.blur}px
              </label>
              <Slider
                value={settings.blur}
                onChange={(value) => updateSetting("blur", value)}
                min={0}
                max={20}
                step={0.5}
              />
            </div>
          </div>
        </div>

        <Button variant="outline" onClick={handleReset} style={{ width: "100%" }}>
          <RotateCcw size={16} style={{ marginRight: "8px" }} />
          Resetovať nastavenia
        </Button>
      </CardContent>
    </Card>
  )
}
