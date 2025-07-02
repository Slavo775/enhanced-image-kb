"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import type { ImageData, StickerItem, MentionItem, LocationItem, CropPreset, EditorState } from "../types"

interface CanvasEditorProps {
  width: number
  height: number
  imageData: ImageData | null
  cropPreset: CropPreset | null
  stickers: StickerItem[]
  mentions: MentionItem[]
  locations: LocationItem[]
  selectedItem: string | null
  onStateChange: (state: Partial<EditorState>) => void
  onPreviewUpdate: (canvas: HTMLCanvasElement) => void
}

export function CanvasEditor({
  width,
  height,
  imageData,
  cropPreset,
  stickers,
  mentions,
  locations,
  selectedItem,
  onStateChange,
  onPreviewUpdate,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragTarget, setDragTarget] = useState<string | null>(null)

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, width, height)

    // Draw crop area outline if preset exists
    if (cropPreset) {
      const cropX = (width - cropPreset.width) / 2
      const cropY = (height - cropPreset.height) / 2

      // Draw crop area background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(cropX, cropY, cropPreset.width, cropPreset.height)

      // Draw crop area border
      ctx.strokeStyle = "#007bff"
      ctx.lineWidth = 2
      ctx.strokeRect(cropX, cropY, cropPreset.width, cropPreset.height)

      // Draw crop area label
      ctx.fillStyle = "#007bff"
      ctx.font = "14px Arial"
      ctx.fillText(cropPreset.name, cropX + 10, cropY - 10)
    }

    // Draw image if available
    if (imageData) {
      const img = new Image()
      img.onload = () => {
        ctx.save()

        if (cropPreset) {
          const cropX = (width - cropPreset.width) / 2
          const cropY = (height - cropPreset.height) / 2
          ctx.beginPath()
          ctx.rect(cropX, cropY, cropPreset.width, cropPreset.height)
          ctx.clip()
        }

        const centerX = width / 2
        const centerY = height / 2

        ctx.translate(centerX + imageData.x, centerY + imageData.y)
        ctx.rotate((imageData.rotation * Math.PI) / 180)
        ctx.scale(imageData.scale, imageData.scale)
        ctx.globalAlpha = imageData.opacity

        const drawWidth = img.width * imageData.brightness
        const drawHeight = img.height * imageData.brightness

        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
        ctx.restore()

        // Draw interactive elements after image
        drawInteractiveElements(ctx)

        // Update preview
        onPreviewUpdate(canvas)
      }
      img.src = imageData.src
    } else {
      drawInteractiveElements(ctx)
    }
  }, [width, height, imageData, cropPreset, stickers, mentions, locations, onPreviewUpdate])

  const drawInteractiveElements = (ctx: CanvasRenderingContext2D) => {
    // Draw stickers
    stickers.forEach((sticker) => {
      ctx.save()
      ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2)
      ctx.rotate((sticker.rotation * Math.PI) / 180)
      ctx.scale(sticker.scale, sticker.scale)

      if (sticker.type === "emoji") {
        ctx.font = `${sticker.fontSize || 40}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(sticker.content, 0, 0)
      } else {
        ctx.font = `${sticker.fontSize || 20}px Arial`
        ctx.fillStyle = sticker.color || "#000"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(sticker.content, 0, 0)
      }

      // Draw selection border
      if (selectedItem === sticker.id) {
        ctx.strokeStyle = "#007bff"
        ctx.lineWidth = 2
        ctx.strokeRect(-sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height)
      }

      ctx.restore()
    })

    // Draw mentions
    mentions.forEach((mention) => {
      ctx.save()
      ctx.translate(mention.x + mention.width / 2, mention.y + mention.height / 2)
      ctx.rotate((mention.rotation * Math.PI) / 180)
      ctx.scale(mention.scale, mention.scale)

      // Background
      ctx.fillStyle = "rgba(0, 123, 255, 0.8)"
      ctx.fillRect(-mention.width / 2, -mention.height / 2, mention.width, mention.height)

      // Text
      ctx.fillStyle = "#fff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`@${mention.username}`, 0, 0)

      // Selection border
      if (selectedItem === mention.id) {
        ctx.strokeStyle = "#007bff"
        ctx.lineWidth = 2
        ctx.strokeRect(-mention.width / 2, -mention.height / 2, mention.width, mention.height)
      }

      ctx.restore()
    })

    // Draw locations
    locations.forEach((location) => {
      ctx.save()
      ctx.translate(location.x + location.width / 2, location.y + location.height / 2)
      ctx.rotate((location.rotation * Math.PI) / 180)
      ctx.scale(location.scale, location.scale)

      // Background
      ctx.fillStyle = "rgba(255, 87, 108, 0.8)"
      ctx.fillRect(-location.width / 2, -location.height / 2, location.width, location.height)

      // Icon and text
      ctx.fillStyle = "#fff"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`📍 ${location.name}`, 0, 0)

      // Selection border
      if (selectedItem === location.id) {
        ctx.strokeStyle = "#007bff"
        ctx.lineWidth = 2
        ctx.strokeRect(-location.width / 2, -location.height / 2, location.width, location.height)
      }

      ctx.restore()
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on interactive elements
    const clickedSticker = stickers.find((s) => x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height)
    const clickedMention = mentions.find((m) => x >= m.x && x <= m.x + m.width && y >= m.y && y <= m.y + m.height)
    const clickedLocation = locations.find((l) => x >= l.x && x <= l.x + l.width && y >= l.y && y <= l.y + l.height)

    if (clickedSticker) {
      setDragTarget(clickedSticker.id)
      onStateChange({ selectedItem: clickedSticker.id })
    } else if (clickedMention) {
      setDragTarget(clickedMention.id)
      onStateChange({ selectedItem: clickedMention.id })
    } else if (clickedLocation) {
      setDragTarget(clickedLocation.id)
      onStateChange({ selectedItem: clickedLocation.id })
    } else if (imageData) {
      // Dragging image
      setDragTarget("image")
      onStateChange({ selectedItem: null })
    }

    setIsDragging(true)
    setDragStart({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragTarget) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const deltaX = x - dragStart.x
    const deltaY = y - dragStart.y

    if (dragTarget === "image" && imageData) {
      onStateChange({
        image: {
          ...imageData,
          x: imageData.x + deltaX,
          y: imageData.y + deltaY,
        },
      })
    } else {
      // Update sticker/mention/location position
      const updatedStickers = stickers.map((s) =>
        s.id === dragTarget ? { ...s, x: s.x + deltaX, y: s.y + deltaY } : s,
      )
      const updatedMentions = mentions.map((m) =>
        m.id === dragTarget ? { ...m, x: m.x + deltaX, y: m.y + deltaY } : m,
      )
      const updatedLocations = locations.map((l) =>
        l.id === dragTarget ? { ...l, x: l.x + deltaX, y: l.y + deltaY } : l,
      )

      onStateChange({
        stickers: updatedStickers,
        mentions: updatedMentions,
        locations: updatedLocations,
      })
    }

    setDragStart({ x, y })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragTarget(null)
  }

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  )
}
