"use client"

import type React from "react"
import { useRef, useEffect, useCallback } from "react"
import { Card } from "./ui/card"
import type { EditorState } from "../types"

interface ImagePreviewProps {
  editorState: EditorState
  sourceCanvas: HTMLCanvasElement | null
  width?: number
  height?: number
  onExport?: (canvas: HTMLCanvasElement) => void
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  editorState,
  sourceCanvas,
  width = 200,
  height = 200,
  onExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  const renderPreview = useCallback(async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const cropPreset = editorState.cropPreset || { width: 500, height: 500, aspectRatio: 1 }
    canvas.width = cropPreset.width
    canvas.height = cropPreset.height

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, cropPreset.width, cropPreset.height)

    // Draw image if exists
    if (editorState.image && editorState.image.src) {
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = editorState.image!.src!
      })

      ctx.save()

      // Apply image filters and transformations
      ctx.globalAlpha = editorState.image.opacity
      ctx.filter = `
        brightness(${editorState.image.brightness})
      `

      const centerX = cropPreset.width / 2
      const centerY = cropPreset.height / 2

      ctx.translate(centerX, centerY)
      ctx.rotate((editorState.image.rotation * Math.PI) / 180)
      ctx.scale(editorState.image.scale, editorState.image.scale)
      ctx.translate(-centerX, -centerY)
      ctx.translate(editorState.image.x, editorState.image.y)

      // Calculate image dimensions to fit crop
      const aspectRatio = img.width / img.height
      let drawWidth = cropPreset.width
      let drawHeight = cropPreset.height

      if (aspectRatio > cropPreset.aspectRatio) {
        drawWidth = drawHeight * aspectRatio
      } else {
        drawHeight = drawWidth / aspectRatio
      }

      const offsetX = (cropPreset.width - drawWidth) / 2
      const offsetY = (cropPreset.height - drawHeight) / 2

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      ctx.restore()
    }

    // Draw stickers
    for (const sticker of editorState.stickers) {
      ctx.save()
      ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2)
      ctx.rotate((sticker.rotation * Math.PI) / 180)
      ctx.translate(-sticker.width / 2, -sticker.height / 2)

      const fontSize = Math.min(sticker.width, sticker.height) * 0.6

      if (sticker.type === "emoji") {
        ctx.font = `${fontSize}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(sticker.content, sticker.width / 2, sticker.height / 2)
      } else {
        ctx.font = `bold ${fontSize * 0.5}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        ctx.fillStyle = "#333"
        ctx.fillText(sticker.content, sticker.width / 2, sticker.height / 2)
      }

      ctx.restore()
    }

    // Draw mentions
    for (const mention of editorState.mentions) {
      ctx.save()
      ctx.fillStyle = "rgba(0, 123, 255, 0.9)"
      ctx.fillRect(mention.x, mention.y, mention.width, mention.height)
      ctx.fillStyle = "#fff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`@${mention.username}`, mention.x + mention.width / 2, mention.y + mention.height / 2)
      ctx.restore()
    }

    // Draw locations
    for (const location of editorState.locations) {
      ctx.save()
      ctx.fillStyle = "rgba(40, 167, 69, 0.9)"
      ctx.fillRect(location.x, location.y, location.width, location.height)
      ctx.fillStyle = "#fff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`📍 ${location.name}`, location.x + location.width / 2, location.y + location.height / 2)
      ctx.restore()
    }

    return canvas
  }, [editorState])

  const updatePreview = useCallback(async () => {
    const previewCanvas = canvasRef.current
    if (!previewCanvas) return

    const renderedCanvas = await renderPreview()
    const previewCtx = previewCanvas.getContext("2d")!

    // Set preview canvas size
    previewCanvas.width = renderedCanvas.width
    previewCanvas.height = renderedCanvas.height

    // Draw rendered canvas to preview
    previewCtx.drawImage(renderedCanvas, 0, 0)
  }, [renderPreview])

  useEffect(() => {
    updatePreview()
  }, [updatePreview])

  const handleDownload = useCallback(async () => {
    try {
      const canvas = await renderPreview()
      const link = document.createElement("a")
      link.download = "image-editor-export.png"
      link.href = canvas.toDataURL("image/png")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      onExport?.(canvas)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    }
  }, [renderPreview, onExport])

  const handleCopyToClipboard = useCallback(async () => {
    try {
      const canvas = await renderPreview()
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        alert("Image copied to clipboard!")
      })
    } catch (error) {
      console.error("Copy failed:", error)
      alert("Copy to clipboard failed. Please try again.")
    }
  }, [renderPreview])

  useEffect(() => {
    if (!sourceCanvas || !previewCanvasRef.current) return

    const previewCanvas = previewCanvasRef.current
    const previewCtx = previewCanvas.getContext("2d")
    if (!previewCtx) return

    // Clear preview canvas
    previewCtx.clearRect(0, 0, width, height)

    // Scale and draw the source canvas
    const scaleX = width / sourceCanvas.width
    const scaleY = height / sourceCanvas.height
    const scale = Math.min(scaleX, scaleY)

    const scaledWidth = sourceCanvas.width * scale
    const scaledHeight = sourceCanvas.height * scale
    const offsetX = (width - scaledWidth) / 2
    const offsetY = (height - scaledHeight) / 2

    previewCtx.drawImage(sourceCanvas, offsetX, offsetY, scaledWidth, scaledHeight)
  }, [sourceCanvas, width, height])

  if (!editorState.image) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#666",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🖼️</div>
        <p>Preview will appear here after uploading an image</p>
      </div>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">👁️ Preview</h3>
      <div className="flex justify-center">
        <canvas ref={previewCanvasRef} width={width} height={height} className="border border-gray-200 rounded" />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">
          📥 Download
        </button>
        <button onClick={handleCopyToClipboard} className="bg-green-500 text-white px-4 py-2 rounded">
          📋 Copy
        </button>
      </div>
    </Card>
  )
}
