"use client"

import type React from "react"
import { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from "react"
import type { ImageEditorData, Sticker, Mention, LocationTag, TextItem } from "../types"
import { StickerItem } from "./StickerItem"
import { MentionItem } from "./MentionItem"
import { LocationItem } from "./LocationItem"
import { TextItemComponent } from "./TextItem"
import { useInstagramEditor, type InstagramEditorState } from "../hooks/useInstagramEditor"

interface InstagramEditorProps {
  width: number
  height: number
  className?: string
  onDataChange?: (data: ImageEditorData) => void
  onStickerClick?: (sticker: Sticker) => void
  onMentionClick?: (mention: Mention) => void
  onLocationClick?: (location: LocationTag) => void
  onTextClick?: (text: TextItem) => void
  editable?: boolean
}

export interface InstagramEditorRef {
  loadImage: (src: string) => void
  addSticker: (sticker: Omit<Sticker, "id">) => string
  addMention: (mention: Omit<Mention, "id">) => string
  addLocation: (location: Omit<LocationTag, "id">) => string
  addText: (text: Omit<TextItem, "id">) => string
  getData: () => ImageEditorData
  setData: (data: ImageEditorData) => void
  getEditorState: () => InstagramEditorState
  updateBackground: (updates: any) => void
  resetToFit: () => void
  fillCanvas: () => void
  exportCanvas: (format?: "png" | "jpeg" | "webp", quality?: number) => string | null
  downloadCanvas: (filename: string, format?: "png" | "jpeg" | "webp", quality?: number) => void
  copyToClipboard: () => Promise<boolean>
}

export const InstagramEditor = forwardRef<InstagramEditorRef, InstagramEditorProps>(
  (
    {
      width,
      height,
      className,
      onDataChange,
      onStickerClick,
      onMentionClick,
      onLocationClick,
      onTextClick,
      editable = true,
    },
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
      copyToClipboard,
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

    const handleBackgroundTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (!editable || e.touches.length !== 1) return
        e.preventDefault()
        const touch = e.touches[0]
        setIsDraggingBackground(true)
        setDragStart({
          x: touch.clientX,
          y: touch.clientY,
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

    const handleBackgroundTouchMove = useCallback(
      (e: TouchEvent) => {
        if (!isDraggingBackground || e.touches.length !== 1) return

        const touch = e.touches[0]
        const deltaX = touch.clientX - dragStart.x
        const deltaY = touch.clientY - dragStart.y

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

    const handleBackgroundTouchEnd = useCallback(() => {
      setIsDraggingBackground(false)
    }, [])

    // Global mouse/touch events for background drag
    useEffect(() => {
      if (isDraggingBackground) {
        document.addEventListener("mousemove", handleBackgroundMouseMove)
        document.addEventListener("mouseup", handleBackgroundMouseUp)
        document.addEventListener("touchmove", handleBackgroundTouchMove)
        document.addEventListener("touchend", handleBackgroundTouchEnd)
        return () => {
          document.removeEventListener("mousemove", handleBackgroundMouseMove)
          document.removeEventListener("mouseup", handleBackgroundMouseUp)
          document.removeEventListener("touchmove", handleBackgroundTouchMove)
          document.removeEventListener("touchend", handleBackgroundTouchEnd)
        }
      }
    }, [
      isDraggingBackground,
      handleBackgroundMouseMove,
      handleBackgroundMouseUp,
      handleBackgroundTouchMove,
      handleBackgroundTouchEnd,
    ])

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

    const handleTextUpdate = useCallback(
      (updatedText: TextItem) => {
        const newData = {
          ...stickersData,
          texts: (stickersData.texts || []).map((text) => (text.id === updatedText.id ? updatedText : text)),
        }
        updateData(newData)
      },
      [stickersData, updateData],
    )

    const addSticker = useCallback(
      (sticker: Omit<Sticker, "id">) => {
        const newSticker: Sticker = {
          ...sticker,
          id: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
          id: `mention-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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
          id: `location-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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

    const addText = useCallback(
      (text: Omit<TextItem, "id">) => {
        const newText: TextItem = {
          ...text,
          id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }
        const newData = {
          ...stickersData,
          texts: [...(stickersData.texts || []), newText],
        }
        updateData(newData)
        return newText.id
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
        addText,
        getData: () => stickersData,
        setData: (data: ImageEditorData) => updateData(data),
        getEditorState,
        updateBackground,
        resetToFit,
        fillCanvas,
        exportCanvas,
        downloadCanvas,
        copyToClipboard,
      }),
      [
        loadImage,
        addSticker,
        addMention,
        addLocation,
        addText,
        stickersData,
        updateData,
        getEditorState,
        updateBackground,
        resetToFit,
        fillCanvas,
        exportCanvas,
        downloadCanvas,
        copyToClipboard,
      ],
    )

    return (
      <div
        className={className}
        style={{
          position: "relative",
          width: width,
          height: height,
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
          overflow: "hidden",
        }}
      >
        {/* Canvas with COMPLETE content (background + stickers) */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            cursor: isDraggingBackground ? "grabbing" : editable ? "grab" : "default",
          }}
          onMouseDown={handleBackgroundMouseDown}
          onTouchStart={handleBackgroundTouchStart}
        />

        {!imageLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "2px solid #3b82f6",
                  borderBottomColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                  marginBottom: "8px",
                }}
              />
              <p style={{ fontSize: "14px", color: "#666" }}>Loading image...</p>
              <style>
                {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                `}
              </style>
            </div>
          </div>
        )}

        {/* INVISIBLE Stickers Overlay - for interaction only! */}
        {imageLoaded && editable && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {stickersData.stickers.map((sticker) => (
              <div
                key={sticker.id}
                style={{
                  position: "absolute",
                  left: sticker.position.x,
                  top: sticker.position.y,
                  width: sticker.size.width,
                  height: sticker.size.height,
                  backgroundColor: "transparent",
                  border: "2px dashed rgba(0,122,255,0.3)",
                  borderRadius: "4px",
                  opacity: 0.7,
                  pointerEvents: "auto",
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
                  pointerEvents: "auto",
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
                  pointerEvents: "auto",
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

            {stickersData.texts?.map((text) => (
              <div
                key={text.id}
                style={{
                  position: "absolute",
                  left: text.position.x,
                  top: text.position.y,
                  width: text.size.width,
                  height: text.size.height,
                  backgroundColor: "transparent",
                  border: "2px dashed rgba(255,165,0,0.3)",
                  borderRadius: "4px",
                  opacity: 0.7,
                  pointerEvents: "auto",
                }}
              >
                <TextItemComponent text={text} onUpdate={handleTextUpdate} onClick={onTextClick} editable={editable} />
              </div>
            ))}
          </div>
        )}

        {/* Debug info */}
        {imageLoaded && (
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            Canvas: Background + Stickers ✅ | Export Ready 🎯
          </div>
        )}
      </div>
    )
  },
)

InstagramEditor.displayName = "InstagramEditor"
