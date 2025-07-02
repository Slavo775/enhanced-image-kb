"use client"

import type React from "react"
import { Monitor, Smartphone, Square, Video } from "lucide-react"
import type { Dimensions } from "../types"

interface DimensionControlsProps {
  dimensions: Dimensions
  onDimensionsChange: (dimensions: Dimensions) => void
}

const presets = [
  { name: "Instagram Square", icon: Square, width: 1080, height: 1080 },
  { name: "Instagram Story", icon: Smartphone, width: 1080, height: 1920 },
  { name: "Twitter Post", icon: Monitor, width: 1200, height: 675 },
  { name: "Facebook Post", icon: Monitor, width: 1200, height: 630 },
  { name: "YouTube Thumbnail", icon: Video, width: 1280, height: 720 },
]

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  dimensions = { width: 800, height: 600 },
  onDimensionsChange,
}) => {
  const handlePresetClick = (preset: { width: number; height: number }) => {
    onDimensionsChange(preset)
  }

  const handleCustomChange = (field: "width" | "height", value: string) => {
    const numValue = Number.parseInt(value) || 0
    onDimensionsChange({
      ...dimensions,
      [field]: Math.max(100, Math.min(4000, numValue)),
    })
  }

  return (
    <div
      style={{ padding: "1rem", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
    >
      <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
        Canvas Dimensions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {presets.map((preset) => {
          const Icon = preset.icon
          return (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem",
                backgroundColor:
                  dimensions.width === preset.width && dimensions.height === preset.height ? "#3b82f6" : "#f9fafb",
                color: dimensions.width === preset.width && dimensions.height === preset.height ? "white" : "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={16} />
              <div style={{ textAlign: "left" }}>
                <div>{preset.name}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                  {preset.width} × {preset.height}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.25rem",
            }}
          >
            Width
          </label>
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => handleCustomChange("width", e.target.value)}
            min="100"
            max="4000"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.25rem",
            }}
          >
            Height
          </label>
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => handleCustomChange("height", e.target.value)}
            min="100"
            max="4000"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          />
        </div>
      </div>
    </div>
  )
}
