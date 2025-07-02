"use client"

import type React from "react"
import { useState, useCallback, forwardRef, useImperativeHandle } from "react"
import { clsx } from "clsx"
import type { ImageEditorData, Sticker, Mention, LocationTag } from "@/types"
import { StickerItem } from "./StickerItem"
import { MentionItem } from "./MentionItem"
import { LocationItem } from "./LocationItem"
import { useInstagramEditor, type InstagramEditorState } from "@/hooks/useInstagramEditor"

interface InstagramEditorProps {
  width: number
  height: number
  className?: string
  onDataChange?: (data: ImageEditorData) => void
  onStickerClick?: (sticker: Sticker) => void
  onMentionClick?: (mention: Mention) => void
  onLocationClick?: (location: LocationTag) => void
  editable?: boolean
}

export const InstagramEditor = forwardRef<
  {
    loadImage: (src: string) => void
    addSticker: (sticker: Omit<Sticker, "id">) => string
    addMention: (mention: Omit<Mention, "id">) => string
    addLocation: (location: Omit<LocationTag, "id">) => string
    getData: () => ImageEditorData
    setData: (data: ImageEditorData) => void
    getEditorState: () => InstagramEditorState
    updateBackground: (updates: any) => void
    resetToFit: () => void
    fillCanvas: () => void
    exportCanvas: (format?: "png" | "jpeg" | "webp", quality?: number) => string | null
    downloadCanvas: (filename: string, format?: "png" | "jpeg" | "webp", quality?: number) => void
  },
  InstagramEditorProps
>(
  (
    { width, height, className, onDataChange, onStickerClick, onMentionClick, onLocationClick, editable = true },
    ref,
  ) => {
    const {
      canvasRef,
      imageLoaded,
      backgroundState,
      stickersData,
      loadImage,
      updateBackground,
      setStickersData,
      getEditorState,
      resetToFit,
      fillCanvas,
      exportCanvas,
      downloadCanvas,
    } = useInstagramEditor(width, height)

    const [isDraggingBackground, setIsDraggingBackground] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, startOffsetX: 0, startOffsetY: 0 })

    // Background drag handling
    const handleBackgroundMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!editable) return
        e.preventDefault()
        setIsDraggingBackground(true)
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          startOffsetX: backgroundState.offsetX,
          startOffsetY: backgroundState.offsetY,
        })
      },
      [editable, backgroundState],
    )

    const handleBackgroundMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDraggingBackground) return

        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y

        updateBackground({
          offsetX: dragStart.startOffsetX + deltaX,
          offsetY: dragStart.startOffsetY + deltaY,
        })
      },
      [isDraggingBackground, dragStart, updateBackground],
    )

    const handleBackgroundMouseUp = useCallback(() => {
      setIsDraggingBackground(false)
    }, [])

    // Global mouse events for background drag
    useState(() => {
      if (isDraggingBackground) {
        document.addEventListener("mousemove", handleBackgroundMouseMove)
        document.addEventListener("mouseup", handleBackgroundMouseUp)
        return () => {
          document.removeEventListener("mousemove", handleBackgroundMouseMove)
          document.removeEventListener("mouseup", handleBackgroundMouseUp)
        }
      }
    }, [isDraggingBackground, handleBackgroundMouseMove, handleBackgroundMouseUp])

    // Sticker management
    const updateData = useCallback(
      (newData: ImageEditorData) => {
        setStickersData(newData)
        onDataChange?.(newData)
      },
      [setStickersData, onDataChange],
    )

    const handleStickerUpdate = useCallback(
      (updatedSticker: Sticker) => {
        const newData = {
          ...stickersData,
          stickers: stickersData.stickers.map((sticker) =>
            sticker.id === updatedSticker.id ? updatedSticker : sticker,
          ),
        }
        updateData(newData)
      },
      [stickersData, updateData],
    )

    const handleMentionUpdate = useCallback(
      (updatedMention: Mention) => {
        const newData = {
          ...stickersData,
          mentions: stickersData.mentions.map((mention) =>
            mention.id === updatedMention.id ? updatedMention : mention,
          ),
        }
        updateData(newData)
      },
      [stickersData, updateData],
    )

    const handleLocationUpdate = useCallback(
      (updatedLocation: LocationTag) => {
        const newData = {
          ...stickersData,
          locations: stickersData.locations.map((location) =>
            location.id === updatedLocation.id ? updatedLocation : location,
          ),
        }
        updateData(newData)
      },
      [stickersData, updateData],
    )

    const addSticker = useCallback(
      (sticker: Omit<Sticker, "id">) => {
        const newSticker: Sticker = {
          ...sticker,
          id: `sticker-${Date.now()}-${Math.random()}`,
        }
        const newData = {
          ...stickersData,
          stickers: [...stickersData.stickers, newSticker],
        }
        updateData(newData)
        return newSticker.id
      },
      [stickersData, updateData],
    )

    const addMention = useCallback(
      (mention: Omit<Mention, "id">) => {
        const newMention: Mention = {
          ...mention,
          id: `mention-${Date.now()}-${Math.random()}`,
        }
        const newData = {
          ...stickersData,
          mentions: [...stickersData.mentions, newMention],
        }
        updateData(newData)
        return newMention.id
      },
      [stickersData, updateData],
    )

    const addLocation = useCallback(
      (location: Omit<LocationTag, "id">) => {
        const newLocation: LocationTag = {
          ...location,
          id: `location-${Date.now()}-${Math.random()}`,
        }
        const newData = {
          ...stickersData,
          locations: [...stickersData.locations, newLocation],
        }
        updateData(newData)
        return newLocation.id
      },
      [stickersData, updateData],
    )

    useImperativeHandle(
      ref,
      () => ({
        loadImage,
        addSticker,
        addMention,
        addLocation,
        getData: () => stickersData,
        setData: (data: ImageEditorData) => updateData(data),
        getEditorState,
        updateBackground,
        resetToFit,
        fillCanvas,
        exportCanvas,
        downloadCanvas,
      }),
      [
        loadImage,
        addSticker,
        addMention,
        addLocation,
        stickersData,
        updateData,
        getEditorState,
        updateBackground,
        resetToFit,
        fillCanvas,
        exportCanvas,
        downloadCanvas,
      ],
    )

    return (
      <div
        className={clsx("instagram-editor", className)}
        style={{
          position: "relative",
          width,
          height,
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
          overflow: "hidden",
        }}
      >
        {/* Canvas s KOMPLETNÝM obsahom (background + stickers) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            width: "100%",
            height: "100%",
            cursor: isDraggingBackground ? "grabbing" : editable ? "grab" : "default",
          }}
          onMouseDown={handleBackgroundMouseDown}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Načítavam obrázok...</p>
            </div>
          </div>
        )}

        {/* INVISIBLE Stickers Overlay - len pre interakciu! */}
        {imageLoaded && editable && (
          <div className="absolute inset-0 pointer-events-none">
            {stickersData.stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="pointer-events-auto"
                style={{
                  position: "absolute",
                  left: sticker.position.x,
                  top: sticker.position.y,
                  width: sticker.size.width,
                  height: sticker.size.height,
                  // INVISIBLE - len pre drag handles
                  backgroundColor: "transparent",
                  border: "2px dashed rgba(0,122,255,0.3)",
                  borderRadius: "4px",
                  opacity: 0.7,
                }}
              >
                <StickerItem
                  sticker={sticker}
                  onUpdate={handleStickerUpdate}
                  onClick={onStickerClick}
                  editable={editable}
                />
              </div>
            ))}

            {stickersData.mentions.map((mention) => (
              <div
                key={mention.id}
                className="pointer-events-auto"
                style={{
                  position: "absolute",
                  left: mention.position.x,
                  top: mention.position.y,
                  width: mention.size.width,
                  height: mention.size.height,
                  backgroundColor: "transparent",
                  border: "2px dashed rgba(0,255,0,0.3)",
                  borderRadius: "4px",
                  opacity: 0.7,
                }}
              >
                <MentionItem
                  mention={mention}
                  onUpdate={handleMentionUpdate}
                  onClick={onMentionClick}
                  editable={editable}
                />
              </div>
            ))}

            {stickersData.locations.map((location) => (
              <div
                key={location.id}
                className="pointer-events-auto"
                style={{
                  position: "absolute",
                  left: location.position.x,
                  top: location.position.y,
                  width: location.size.width,
                  height: location.size.height,
                  backgroundColor: "transparent",
                  border: "2px dashed rgba(255,0,255,0.3)",
                  borderRadius: "4px",
                  opacity: 0.7,
                }}
              >
                <LocationItem
                  location={location}
                  onUpdate={handleLocationUpdate}
                  onClick={onLocationClick}
                  editable={editable}
                />
              </div>
            ))}
          </div>
        )}

        {/* Debug info */}
        {imageLoaded && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            Canvas: Background + Stickers ✅ | Export Ready 🎯
          </div>
        )}
      </div>
    )
  },
)

InstagramEditor.displayName = "InstagramEditor"
