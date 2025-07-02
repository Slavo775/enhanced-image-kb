"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCw, Download, ZoomIn, ZoomOut, Crop } from "lucide-react"

interface InteractiveImageViewerProps {
  imageSrc: string
  width: number
  height: number
}

interface StickerType {
  id: string
  emoji: string
  x: number
  y: number
  rotation: number
  scale: number
  isDragging?: boolean
  isResizing?: boolean
}

interface DragState {
  isDragging: boolean
  dragId: string | null
  offset: { x: number; y: number }
  isResizing: boolean
  resizeHandle: string | null
}

const SAMPLE_STICKERS = ["😀", "😍", "🔥", "💯", "👍", "❤️", "😂", "🎉", "✨", "🌟", "🚀", "🎯"]

export const InteractiveImageViewer: React.FC<InteractiveImageViewerProps> = ({ imageSrc, width, height }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stickers, setStickers] = useState<StickerType[]>([])
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragId: null,
    offset: { x: 0, y: 0 },
    isResizing: false,
    resizeHandle: null,
  })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isCropMode, setIsCropMode] = useState(false)

  // Add sticker
  const addSticker = (emoji: string) => {
    const newSticker: StickerType = {
      id: `sticker-${Date.now()}-${Math.random()}`,
      emoji,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      rotation: 0,
      scale: 1,
    }
    setStickers((prev) => [...prev, newSticker])
  }

  // Mouse/Touch handlers for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, stickerId: string) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const sticker = stickers.find((s) => s.id === stickerId)
      if (!sticker) return

      const clientX = e.clientX
      const clientY = e.clientY

      setDragState({
        isDragging: true,
        dragId: stickerId,
        offset: {
          x: clientX - rect.left - sticker.x,
          y: clientY - rect.top - sticker.y,
        },
        isResizing: false,
        resizeHandle: null,
      })

      // Mark sticker as dragging
      setStickers((prev) =>
        prev.map((s) => (s.id === stickerId ? { ...s, isDragging: true } : { ...s, isDragging: false })),
      )
    },
    [stickers],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.dragId) return

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left - dragState.offset.x
      const y = e.clientY - rect.top - dragState.offset.y

      setStickers((prev) =>
        prev.map((sticker) =>
          sticker.id === dragState.dragId
            ? {
                ...sticker,
                x: Math.max(0, Math.min(width - 50, x)),
                y: Math.max(0, Math.min(height - 50, y)),
              }
            : sticker,
        ),
      )
    },
    [dragState, width, height],
  )

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragId: null,
      offset: { x: 0, y: 0 },
      isResizing: false,
      resizeHandle: null,
    })

    setStickers((prev) => prev.map((s) => ({ ...s, isDragging: false, isResizing: false })))
  }, [])

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, stickerId: string) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const sticker = stickers.find((s) => s.id === stickerId)
      if (!sticker) return

      const touch = e.touches[0]
      const clientX = touch.clientX
      const clientY = touch.clientY

      setDragState({
        isDragging: true,
        dragId: stickerId,
        offset: {
          x: clientX - rect.left - sticker.x,
          y: clientY - rect.top - sticker.y,
        },
        isResizing: false,
        resizeHandle: null,
      })

      setStickers((prev) =>
        prev.map((s) => (s.id === stickerId ? { ...s, isDragging: true } : { ...s, isDragging: false })),
      )
    },
    [stickers],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragState.isDragging || !dragState.dragId) return
      e.preventDefault()

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const touch = e.touches[0]
      const x = touch.clientX - rect.left - dragState.offset.x
      const y = touch.clientY - rect.top - dragState.offset.y

      setStickers((prev) =>
        prev.map((sticker) =>
          sticker.id === dragState.dragId
            ? {
                ...sticker,
                x: Math.max(0, Math.min(width - 50, x)),
                y: Math.max(0, Math.min(height - 50, y)),
              }
            : sticker,
        ),
      )
    },
    [dragState, width, height],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      handleMouseUp()
    },
    [handleMouseUp],
  )

  // Resize handler
  const handleResizeStart = useCallback((e: React.MouseEvent, stickerId: string, handle: string) => {
    e.stopPropagation()
    e.preventDefault()

    setDragState({
      isDragging: false,
      dragId: stickerId,
      offset: { x: 0, y: 0 },
      isResizing: true,
      resizeHandle: handle,
    })

    setStickers((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, isResizing: true } : { ...s, isResizing: false })),
    )
  }, [])

  const handleResizeMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isResizing || !dragState.dragId || !dragState.resizeHandle) return

      const sticker = stickers.find((s) => s.id === dragState.dragId)
      if (!sticker) return

      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate distance from sticker center
      const dx = mouseX - sticker.x
      const dy = mouseY - sticker.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Update scale based on distance
      const newScale = Math.max(0.5, Math.min(3, distance / 50))

      setStickers((prev) => prev.map((s) => (s.id === dragState.dragId ? { ...s, scale: newScale } : s)))
    },
    [dragState, stickers],
  )

  // Global mouse handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - dragState.offset.x
        const y = e.clientY - rect.top - dragState.offset.y

        setStickers((prev) =>
          prev.map((sticker) =>
            sticker.id === dragState.dragId
              ? {
                  ...sticker,
                  x: Math.max(0, Math.min(width - 50, x)),
                  y: Math.max(0, Math.min(height - 50, y)),
                }
              : sticker,
          ),
        )
      } else if (dragState.isResizing) {
        handleResizeMove(e as any)
      }
    }

    const handleGlobalMouseUp = () => {
      handleMouseUp()
    }

    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [dragState, handleMouseUp, handleResizeMove, width, height])

  // Rotate sticker
  const rotateSticker = (stickerId: string, direction: number) => {
    setStickers((prev) => prev.map((s) => (s.id === stickerId ? { ...s, rotation: s.rotation + direction * 15 } : s)))
  }

  // Delete sticker
  const deleteSticker = (stickerId: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== stickerId))
  }

  // Export as image
  const exportImage = useCallback(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Draw background image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)

      // Draw stickers
      stickers.forEach((sticker) => {
        ctx.save()
        ctx.translate(sticker.x, sticker.y)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.scale(sticker.scale, sticker.scale)
        ctx.font = "48px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(sticker.emoji, 0, 0)
        ctx.restore()
      })

      // Download
      const link = document.createElement("a")
      link.download = `edited-image-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    img.src = imageSrc
  }, [imageSrc, width, height, stickers])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}>
          <ZoomIn className="w-4 h-4 mr-1" />
          Zoom In
        </Button>
        <Button variant="outline" size="sm" onClick={() => setZoom((prev) => Math.max(0.1, prev - 0.1))}>
          <ZoomOut className="w-4 h-4 mr-1" />
          Zoom Out
        </Button>
        <Button variant="outline" size="sm" onClick={() => setRotation((prev) => prev + 90)}>
          <RotateCw className="w-4 h-4 mr-1" />
          Rotate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCropMode(!isCropMode)}
          className={isCropMode ? "bg-blue-100" : ""}
        >
          <Crop className="w-4 h-4 mr-1" />
          Crop
        </Button>
        <Button variant="outline" size="sm" onClick={exportImage}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Sticker Palette */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_STICKERS.map((emoji) => (
          <Button
            key={emoji}
            variant="outline"
            size="sm"
            onClick={() => addSticker(emoji)}
            className="text-lg p-2 h-10 w-10"
          >
            {emoji}
          </Button>
        ))}
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100"
        style={{
          width: Math.min(width, 800),
          height: Math.min(height, 600),
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transformOrigin: "center",
          touchAction: "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Background Image */}
        <img
          src={imageSrc || "/placeholder.svg"}
          alt="Editable"
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Stickers */}
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className={`absolute cursor-move select-none ${sticker.isDragging ? "z-50" : "z-10"}`}
            style={{
              left: sticker.x - 25,
              top: sticker.y - 25,
              transform: `rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
              transformOrigin: "center",
            }}
            onMouseDown={(e) => handleMouseDown(e, sticker.id)}
            onTouchStart={(e) => handleTouchStart(e, sticker.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sticker */}
            <div className="relative">
              <span className="text-4xl block text-center leading-none">{sticker.emoji}</span>

              {/* Resize Handles */}
              {(sticker.isDragging || sticker.isResizing) && (
                <>
                  {/* Corner resize handles */}
                  <div
                    className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize border-2 border-white shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, sticker.id, "nw")}
                  />
                  <div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize border-2 border-white shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, sticker.id, "ne")}
                  />
                  <div
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize border-2 border-white shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, sticker.id, "sw")}
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize border-2 border-white shadow-md"
                    onMouseDown={(e) => handleResizeStart(e, sticker.id, "se")}
                  />

                  {/* Rotation handle */}
                  <div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full cursor-pointer border-2 border-white shadow-md"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      rotateSticker(sticker.id, 1)
                    }}
                  />

                  {/* Delete button */}
                  <button
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 border-2 border-white shadow-md"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSticker(sticker.id)
                    }}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Crop overlay */}
        {isCropMode && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="border-2 border-white border-dashed w-3/4 h-3/4 bg-transparent" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <strong>📱 Instructions:</strong>
        <br />• Click emoji buttons to add stickers
        <br />• Drag stickers to move them
        <br />• Use blue handles to resize
        <br />• Use orange handle to rotate
        <br />• Click × to delete stickers
        <br />• Works on mobile, tablet & desktop
      </div>
    </div>
  )
}
