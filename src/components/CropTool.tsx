"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { CropArea, Size } from "../types"

interface CropToolProps {
  canvasSize: Size
  onCropChange: (cropArea: CropArea | null) => void
}

export const CropTool: React.FC<CropToolProps> = ({ canvasSize, onCropChange }) => {
  const [isCropMode, setIsCropMode] = useState(false)
  const [cropArea, setCropArea] = useState<CropArea | null>(null)

  const handleToggleCrop = useCallback(() => {
    const newCropMode = !isCropMode
    setIsCropMode(newCropMode)

    if (newCropMode) {
      // Start with a default crop area
      const defaultCrop: CropArea = {
        x: canvasSize.width * 0.1,
        y: canvasSize.height * 0.1,
        width: canvasSize.width * 0.8,
        height: canvasSize.height * 0.8,
      }
      setCropArea(defaultCrop)
      onCropChange(defaultCrop)
    } else {
      setCropArea(null)
      onCropChange(null)
    }
  }, [isCropMode, canvasSize, onCropChange])

  const handleClearCrop = useCallback(() => {
    setCropArea(null)
    setIsCropMode(false)
    onCropChange(null)
  }, [onCropChange])

  return (
    <div
      style={{
        padding: "16px",
        background: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600", color: "#333" }}>✂️ Crop Tool</h3>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={handleToggleCrop}
          style={{
            padding: "8px 16px",
            border: `1px solid ${isCropMode ? "#dc3545" : "#007bff"}`,
            borderRadius: "4px",
            background: isCropMode ? "#dc3545" : "#007bff",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {isCropMode ? "Cancel Crop" : "Start Crop"}
        </button>

        {cropArea && (
          <button
            onClick={handleClearCrop}
            style={{
              padding: "8px 16px",
              border: "1px solid #6c757d",
              borderRadius: "4px",
              background: "#6c757d",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Clear Crop
          </button>
        )}
      </div>

      {cropArea && (
        <div style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
          <strong>Crop Area:</strong> {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
          <br />
          <strong>Position:</strong> ({Math.round(cropArea.x)}, {Math.round(cropArea.y)})
        </div>
      )}

      {isCropMode && (
        <div
          style={{
            marginTop: "12px",
            padding: "8px",
            background: "#e7f3ff",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#0066cc",
          }}
        >
          💡 Click and drag on the image to select crop area
        </div>
      )}
    </div>
  )
}
