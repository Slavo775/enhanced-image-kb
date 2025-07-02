"use client"

import { useCallback } from "react"
import type { EditorState } from "../types"

export function useImageExport() {
  const exportToCanvas = useCallback(async (editorState: EditorState, quality = 1): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    canvas.width = editorState.dimensions.width * quality
    canvas.height = editorState.dimensions.height * quality

    // Scale context for quality
    ctx.scale(quality, quality)

    // Fill background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, editorState.dimensions.width, editorState.dimensions.height)

    // Draw background image if exists
    if (editorState.backgroundImage) {
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = editorState.backgroundImage!
      })

      const { backgroundSettings } = editorState

      ctx.save()
      ctx.globalAlpha = backgroundSettings.opacity

      // Apply filters
      const filters = [
        `brightness(${backgroundSettings.brightness}%)`,
        `contrast(${backgroundSettings.contrast}%)`,
        `saturate(${backgroundSettings.saturation}%)`,
        `blur(${backgroundSettings.blur}px)`,
      ]
      ctx.filter = filters.join(" ")

      // Calculate scaled dimensions
      const scale = backgroundSettings.scale
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale

      // Center the image and apply offset
      const x = (editorState.dimensions.width - scaledWidth) / 2 + backgroundSettings.offsetX
      const y = (editorState.dimensions.height - scaledHeight) / 2 + backgroundSettings.offsetY

      // Apply rotation
      if (backgroundSettings.rotation !== 0) {
        ctx.translate(editorState.dimensions.width / 2, editorState.dimensions.height / 2)
        ctx.rotate((backgroundSettings.rotation * Math.PI) / 180)
        ctx.translate(-editorState.dimensions.width / 2, -editorState.dimensions.height / 2)
      }

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
      ctx.restore()
    }

    // Draw stickers
    for (const sticker of editorState.stickers) {
      ctx.save()
      ctx.globalAlpha = sticker.opacity
      ctx.font = `${sticker.size.width}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (sticker.rotation !== 0) {
        ctx.translate(sticker.position.x + sticker.size.width / 2, sticker.position.y + sticker.size.height / 2)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.translate(-sticker.size.width / 2, -sticker.size.height / 2)
      } else {
        ctx.translate(sticker.position.x, sticker.position.y)
      }

      ctx.fillText(sticker.emoji, sticker.size.width / 2, sticker.size.height / 2)
      ctx.restore()
    }

    // Draw texts
    for (const text of editorState.texts) {
      ctx.save()
      ctx.globalAlpha = text.opacity
      ctx.font = `${text.fontSize}px ${text.fontFamily}`
      ctx.fillStyle = text.color
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (text.rotation !== 0) {
        ctx.translate(text.position.x, text.position.y)
        ctx.rotate((text.rotation * Math.PI) / 180)
        ctx.fillText(text.text, 0, 0)
      } else {
        ctx.fillText(text.text, text.position.x, text.position.y)
      }

      ctx.restore()
    }

    // Draw mentions
    for (const mention of editorState.mentions) {
      ctx.save()
      ctx.globalAlpha = mention.opacity
      ctx.font = "16px Arial"
      ctx.fillStyle = "#1da1f2"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (mention.rotation !== 0) {
        ctx.translate(mention.position.x, mention.position.y)
        ctx.rotate((mention.rotation * Math.PI) / 180)
        ctx.fillText(`@${mention.username}`, 0, 0)
      } else {
        ctx.fillText(`@${mention.username}`, mention.position.x, mention.position.y)
      }

      ctx.restore()
    }

    // Draw locations
    for (const location of editorState.locations) {
      ctx.save()
      ctx.globalAlpha = location.opacity
      ctx.font = "16px Arial"
      ctx.fillStyle = "#e1306c"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (location.rotation !== 0) {
        ctx.translate(location.position.x, location.position.y)
        ctx.rotate((location.rotation * Math.PI) / 180)
        ctx.fillText(`📍 ${location.name}`, 0, 0)
      } else {
        ctx.fillText(`📍 ${location.name}`, location.position.x, location.position.y)
      }

      ctx.restore()
    }

    return canvas
  }, [])

  const exportCanvasUpdated = useCallback(
    (canvas: HTMLCanvasElement, format: "png" | "jpeg" = "png", quality = 0.9) => {
      return canvas.toDataURL(`image/${format}`, quality)
    },
    [],
  )

  const downloadCanvasUpdated = useCallback(
    (canvas: HTMLCanvasElement, filename: string, format: "png" | "jpeg" = "png", quality = 0.9) => {
      const dataUrl = canvas.toDataURL(`image/${format}`, quality)
      const link = document.createElement("a")
      link.download = filename
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    [],
  )

  const copyToClipboardUpdated = useCallback(async (canvas: HTMLCanvasElement) => {
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, "image/png")
      })

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ])

      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }, [])

  return {
    exportToCanvas,
    exportCanvas: exportCanvasUpdated,
    downloadCanvas: downloadCanvasUpdated,
    copyToClipboard: copyToClipboardUpdated,
  }
}
