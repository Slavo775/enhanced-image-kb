"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Plus, Type, AtSign, MapPin, Download, Eye, Copy, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { ImageUpload } from "./ImageUpload"
import { DimensionControls } from "./DimensionControls"
import { BackgroundControls } from "./BackgroundControls"
import { DraggableItem } from "./DraggableItem"
import { useResizable } from "../hooks/useResizable"
import { useImageExport } from "../hooks/useImageExport"
import { generateId } from "../lib/utils"
import type {
  StickerItem,
  TextItem,
  MentionItem,
  LocationItem,
  BackgroundSettings,
  Dimensions,
  Position,
  Size,
} from "../types"

interface InteractiveImageViewerProps {
  imageSrc: string
  width: number
  height: number
}

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
]

const ResizableItem: React.FC<{
  id: string
  size: Size
  onSizeChange: (id: string, size: Size) => void
  isSelected: boolean
  children: React.ReactNode
}> = ({ id, size, onSizeChange, isSelected, children }) => {
  const {
    size: resizeSize,
    isResizing,
    resizeRef,
    handleResizeStart,
    handleTouchResizeStart,
  } = useResizable({
    initialSize: size,
    onSizeChange: (newSize) => onSizeChange(id, newSize),
    minSize: { width: 20, height: 20 },
  })

  return (
    <div
      ref={resizeRef}
      style={{
        width: resizeSize.width,
        height: resizeSize.height,
        position: "relative",
      }}
    >
      {children}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 12,
            height: 12,
            backgroundColor: "#3b82f6",
            borderRadius: "50%",
            cursor: "se-resize",
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onMouseDown={handleResizeStart}
          onTouchStart={handleTouchResizeStart}
        />
      )}
    </div>
  )
}

export const InteractiveImageViewer: React.FC<InteractiveImageViewerProps> = ({
  imageSrc: initialImageSrc,
  width: initialWidth,
  height: initialHeight,
}) => {
  const [imageSrc, setImageSrc] = useState(initialImageSrc)
  const [dimensions, setDimensions] = useState<Dimensions>({ width: initialWidth, height: initialHeight })
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
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

  const [stickers, setStickers] = useState<StickerItem[]>([])
  const [texts, setTexts] = useState<TextItem[]>([])
  const [mentions, setMentions] = useState<MentionItem[]>([])
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showStickers, setShowStickers] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { exportCanvas, downloadCanvas, copyToClipboard } = useImageExport()

  const handleImageSelect = useCallback((newImageSrc: string, newDimensions: Dimensions) => {
    setImageSrc(newImageSrc)
    setDimensions(newDimensions)
  }, [])

  const addSticker = useCallback((emoji: string) => {
    const newSticker: StickerItem = {
      id: generateId(),
      emoji,
      position: { x: 50, y: 50 },
      size: { width: 60, height: 60 },
      rotation: 0,
      opacity: 1,
    }
    setStickers((prev) => [...prev, newSticker])
    setSelectedItem(newSticker.id)
  }, [])

  const addText = useCallback(() => {
    const newText: TextItem = {
      id: generateId(),
      text: "Your text here",
      position: { x: 100, y: 100 },
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      opacity: 1,
      rotation: 0,
    }
    setTexts((prev) => [...prev, newText])
    setSelectedItem(newText.id)
  }, [])

  const addMention = useCallback(() => {
    const newMention: MentionItem = {
      id: generateId(),
      username: "@username",
      position: { x: 150, y: 150 },
      opacity: 1,
      rotation: 0,
    }
    setMentions((prev) => [...prev, newMention])
    setSelectedItem(newMention.id)
  }, [])

  const addLocation = useCallback(() => {
    const newLocation: LocationItem = {
      id: generateId(),
      name: "Location Name",
      position: { x: 200, y: 200 },
      opacity: 1,
      rotation: 0,
    }
    setLocations((prev) => [...prev, newLocation])
    setSelectedItem(newLocation.id)
  }, [])

  const updateStickerPosition = useCallback((id: string, position: Position) => {
    setStickers((prev) => prev.map((sticker) => (sticker.id === id ? { ...sticker, position } : sticker)))
  }, [])

  const updateStickerSize = useCallback((id: string, size: Size) => {
    setStickers((prev) => prev.map((sticker) => (sticker.id === id ? { ...sticker, size } : sticker)))
  }, [])

  const updateTextPosition = useCallback((id: string, position: Position) => {
    setTexts((prev) => prev.map((text) => (text.id === id ? { ...text, position } : text)))
  }, [])

  const updateMentionPosition = useCallback((id: string, position: Position) => {
    setMentions((prev) => prev.map((mention) => (mention.id === id ? { ...mention, position } : mention)))
  }, [])

  const updateLocationPosition = useCallback((id: string, position: Position) => {
    setLocations((prev) => prev.map((location) => (location.id === id ? { ...location, position } : location)))
  }, [])

  const deleteSelectedItem = useCallback(() => {
    if (!selectedItem) return

    setStickers((prev) => prev.filter((s) => s.id !== selectedItem))
    setTexts((prev) => prev.filter((t) => t.id !== selectedItem))
    setMentions((prev) => prev.filter((m) => m.id !== selectedItem))
    setLocations((prev) => prev.filter((l) => l.id !== selectedItem))
    setSelectedItem(null)
  }, [selectedItem])

  const exportToCanvas = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    if (imageSrc) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.save()

        // Apply background transformations
        ctx.globalAlpha = backgroundSettings.opacity
        ctx.filter = `brightness(${backgroundSettings.brightness}) contrast(${backgroundSettings.contrast}) saturate(${backgroundSettings.saturation}) blur(${backgroundSettings.blur}px)`

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        ctx.translate(centerX + backgroundSettings.offsetX, centerY + backgroundSettings.offsetY)
        ctx.rotate((backgroundSettings.rotation * Math.PI) / 180)
        ctx.scale(backgroundSettings.scale, backgroundSettings.scale)

        const scaledWidth = img.width * backgroundSettings.scale
        const scaledHeight = img.height * backgroundSettings.scale

        ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
        ctx.restore()

        // Draw stickers
        stickers.forEach((sticker) => {
          ctx.save()
          ctx.globalAlpha = sticker.opacity
          ctx.font = `${sticker.size.height}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(
            sticker.emoji,
            sticker.position.x + sticker.size.width / 2,
            sticker.position.y + sticker.size.height / 2,
          )
          ctx.restore()
        })

        // Draw texts
        texts.forEach((text) => {
          ctx.save()
          ctx.globalAlpha = text.opacity
          ctx.font = `${text.fontSize}px ${text.fontFamily}`
          ctx.fillStyle = text.color
          ctx.textAlign = "left"
          ctx.textBaseline = "top"
          ctx.fillText(text.text, text.position.x, text.position.y)
          ctx.restore()
        })

        // Draw mentions
        mentions.forEach((mention) => {
          ctx.save()
          ctx.globalAlpha = mention.opacity
          ctx.font = "16px Arial"
          ctx.fillStyle = "#1d9bf0"
          ctx.textAlign = "left"
          ctx.textBaseline = "top"
          ctx.fillText(mention.username, mention.position.x, mention.position.y)
          ctx.restore()
        })

        // Draw locations
        locations.forEach((location) => {
          ctx.save()
          ctx.globalAlpha = location.opacity
          ctx.font = "14px Arial"
          ctx.fillStyle = "#666"
          ctx.textAlign = "left"
          ctx.textBaseline = "top"
          ctx.fillText(location.name, location.position.x, location.position.y)
          ctx.restore()
        })
      }
      img.src = imageSrc
    }
  }, [imageSrc, dimensions, backgroundSettings, stickers, texts, mentions, locations])

  const handleExport = useCallback(() => {
    exportToCanvas()
    setShowPreview(true)
  }, [exportToCanvas])

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return
    exportToCanvas()
    setTimeout(() => {
      if (canvasRef.current) {
        downloadCanvas(canvasRef.current, "image-edit.png")
      }
    }, 100)
  }, [exportToCanvas, downloadCanvas])

  const handleCopyToClipboard = useCallback(async () => {
    if (!canvasRef.current) return
    exportToCanvas()
    setTimeout(async () => {
      if (canvasRef.current) {
        const success = await copyToClipboard(canvasRef.current)
        alert(success ? "Copied to clipboard!" : "Failed to copy to clipboard")
      }
    }, 100)
  }, [exportToCanvas, copyToClipboard])

  const backgroundStyle = imageSrc
    ? {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${100 * backgroundSettings.scale}%`,
        backgroundPosition: `${50 + (backgroundSettings.offsetX / dimensions.width) * 100}% ${50 + (backgroundSettings.offsetY / dimensions.height) * 100}%`,
        backgroundRepeat: "no-repeat",
        transform: `rotate(${backgroundSettings.rotation}deg)`,
        opacity: backgroundSettings.opacity,
        filter: `brightness(${backgroundSettings.brightness}) contrast(${backgroundSettings.contrast}) saturate(${backgroundSettings.saturation}) blur(${backgroundSettings.blur}px)`,
      }
    : {}

  return (
    <div style={{ padding: "1rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem", alignItems: "start" }}>
        {/* Main Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Image Upload */}
          <ImageUpload onImageSelect={handleImageSelect} />

          {/* Canvas */}
          <div style={{ position: "relative", border: "2px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
            <div
              ref={containerRef}
              style={{
                width: Math.min(dimensions.width, 800),
                height: Math.min(dimensions.height, 600),
                position: "relative",
                backgroundColor: "#f9fafb",
                ...backgroundStyle,
              }}
              onClick={() => setSelectedItem(null)}
            >
              {/* Stickers */}
              {stickers.map((sticker) => (
                <DraggableItem
                  key={sticker.id}
                  id={sticker.id}
                  position={sticker.position}
                  onPositionChange={updateStickerPosition}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem === sticker.id}
                  containerRef={containerRef}
                >
                  <ResizableItem
                    id={sticker.id}
                    size={sticker.size}
                    onSizeChange={updateStickerSize}
                    isSelected={selectedItem === sticker.id}
                  >
                    <div
                      style={{
                        fontSize: sticker.size.height,
                        lineHeight: 1,
                        opacity: sticker.opacity,
                        userSelect: "none",
                      }}
                    >
                      {sticker.emoji}
                    </div>
                  </ResizableItem>
                </DraggableItem>
              ))}

              {/* Texts */}
              {texts.map((text) => (
                <DraggableItem
                  key={text.id}
                  id={text.id}
                  position={text.position}
                  onPositionChange={updateTextPosition}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem === text.id}
                  containerRef={containerRef}
                >
                  <div
                    style={{
                      fontSize: text.fontSize,
                      fontFamily: text.fontFamily,
                      color: text.color,
                      opacity: text.opacity,
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {text.text}
                  </div>
                </DraggableItem>
              ))}

              {/* Mentions */}
              {mentions.map((mention) => (
                <DraggableItem
                  key={mention.id}
                  id={mention.id}
                  position={mention.position}
                  onPositionChange={updateMentionPosition}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem === mention.id}
                  containerRef={containerRef}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#1d9bf0",
                      fontWeight: "600",
                      opacity: mention.opacity,
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mention.username}
                  </div>
                </DraggableItem>
              ))}

              {/* Locations */}
              {locations.map((location) => (
                <DraggableItem
                  key={location.id}
                  id={location.id}
                  position={location.position}
                  onPositionChange={updateLocationPosition}
                  onSelect={setSelectedItem}
                  isSelected={selectedItem === location.id}
                  containerRef={containerRef}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      opacity: location.opacity,
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      backgroundColor: "rgba(255,255,255,0.9)",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      border: "1px solid #ddd",
                    }}
                  >
                    📍 {location.name}
                  </div>
                </DraggableItem>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              onClick={() => setShowStickers(!showStickers)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <Plus size={16} />
              Stickers
              {showStickers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <button
              onClick={addText}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <Type size={16} />
              Add Text
            </button>

            <button
              onClick={addMention}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#1d9bf0",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <AtSign size={16} />
              Add Mention
            </button>

            <button
              onClick={addLocation}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <MapPin size={16} />
              Add Location
            </button>

            {selectedItem && (
              <button
                onClick={deleteSelectedItem}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>

          {/* Stickers Panel */}
          {showStickers && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                Choose a Sticker
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
                  gap: "0.5rem",
                }}
              >
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addSticker(emoji)}
                    style={{
                      padding: "0.5rem",
                      fontSize: "1.5rem",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      aspectRatio: "1",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6"
                      e.currentTarget.style.transform = "scale(1.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb"
                      e.currentTarget.style.transform = "scale(1)"
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              onClick={handleExport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <Eye size={16} />
              Preview
            </button>

            <button
              onClick={handleDownload}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#059669",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={handleCopyToClipboard}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              <Copy size={16} />
              Copy to Clipboard
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <DimensionControls dimensions={dimensions} onDimensionsChange={setDimensions} />
          <BackgroundControls settings={backgroundSettings} onSettingsChange={setBackgroundSettings} />
        </div>
      </div>

      {/* Hidden Canvas for Export */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowPreview(false)}
        >
          <div style={{ maxWidth: "90%", maxHeight: "90%" }}>
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
