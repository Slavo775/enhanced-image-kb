"use client"

import type React from "react"
import { useState } from "react"
import { Download, Copy, Settings } from "lucide-react"
import type { ExportOptions } from "../types"

interface ExportPanelProps {
  onExport: (options: ExportOptions) => void
  onCopyToClipboard: () => Promise<boolean>
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ onExport, onCopyToClipboard }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "png",
    quality: 0.9,
    filename: "image-export",
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "success" | "error">("idle")

  const handleExport = () => {
    onExport(exportOptions)
  }

  const handleCopy = async () => {
    setCopyStatus("copying")
    try {
      const success = await onCopyToClipboard()
      setCopyStatus(success ? "success" : "error")
      setTimeout(() => setCopyStatus("idle"), 2000)
    } catch (error) {
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2000)
    }
  }

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case "copying":
        return "Copying..."
      case "success":
        return "Copied!"
      case "error":
        return "Failed"
      default:
        return "Copy to Clipboard"
    }
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "bold" }}>Export Image</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleExport}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              backgroundColor: "#1d9bf0",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <Download size={18} />
            Download
          </button>

          <button
            onClick={handleCopy}
            disabled={copyStatus === "copying"}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              backgroundColor: copyStatus === "success" ? "#10b981" : "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: copyStatus === "copying" ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            <Copy size={18} />
            {getCopyButtonText()}
          </button>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "8px",
            backgroundColor: "transparent",
            color: "#666",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <Settings size={16} />
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </button>

        {showAdvanced && (
          <div style={{ padding: "16px", backgroundColor: "#f9f9f9", borderRadius: "6px" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Format</label>
              <select
                value={exportOptions.format}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    format: e.target.value as "png" | "jpeg" | "webp",
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            {exportOptions.format !== "png" && (
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>
                  Quality: {Math.round(exportOptions.quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={exportOptions.quality}
                  onChange={(e) =>
                    setExportOptions({
                      ...exportOptions,
                      quality: Number.parseFloat(e.target.value),
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}>Filename</label>
              <input
                type="text"
                value={exportOptions.filename}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    filename: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
