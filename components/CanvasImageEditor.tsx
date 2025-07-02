"use client"
import { useState, useCallback, forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import { clsx } from "clsx"
import type { ImageEditorProps, ImageEditorData, Sticker, Mention, LocationTag } from "@/types"
import { StickerItem } from "./StickerItem"
import { MentionItem } from "./MentionItem"
import { LocationItem } from "./LocationItem"
import type { CanvasCropData } from "@/hooks/useCanvasCrop"

interface ExtendedImageEditorProps extends ImageEditorProps {
  cropData?: CanvasCropData
  originalImageWidth?: number
  originalImageHeight?: number
}

export const CanvasImageEditor = forwardRef<
  {
    addSticker: (sticker: Omit<Sticker, "id">) => string
    addMention: (mention: Omit<Mention, "id">) => string
    addLocation: (location: Omit<LocationTag, "id">) => string
    getData: () => ImageEditorData
    setData: (data: ImageEditorData) => void
    getCropData: () => CanvasCropData | undefined
  },
  ExtendedImageEditorProps
>(
  (
    {
      src,
      alt = "Image",
      width = 400,
      height = 400,
      data = { stickers: [], mentions: [], locations: [] },
      onDataChange,
      onStickerClick,
      onMentionClick,
      onLocationClick,
      editable = true,
      className,
      cropData,
      originalImageWidth,
      originalImageHeight,
    },
    ref,
  ) => {
    const [currentData, setCurrentData] = useState<ImageEditorData>(data)
    const [imageLoaded, setImageLoaded] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const updateData = useCallback(
      (newData: ImageEditorData) => {
        setCurrentData(newData)
        onDataChange?.(newData)
      },
      [onDataChange],
    )

    // Render canvas s crop
    const renderCanvas = useCallback(() => {
      const canvas = canvasRef.current
      const img = imageRef.current
      if (!canvas || !img || !cropData) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Nastav canvas rozmery na finálne crop rozmery
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Vyčisti canvas
      ctx.clearRect(0, 0, width, height)

      // Nakresli crop časť obrázka
      ctx.drawImage(
        img,
        cropData.sourceX, // source x v originálnom obrázku
        cropData.sourceY, // source y v originálnom obrázku
        cropData.sourceWidth, // source width v originálnom obrázku
        cropData.sourceHeight, // source height v originálnom obrázku
        0, // destination x na canvas
        0, // destination y na canvas
        width, // destination width na canvas
        height, // destination height na canvas
      )
    }, [cropData, width, height])

    // Load image
    useEffect(() => {
      if (src) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          imageRef.current = img
          setImageLoaded(true)
          renderCanvas()
        }
        img.onerror = () => setImageLoaded(false)
        img.src = src
      }
    }, [src, renderCanvas])

    // Re-render pri zmene crop data
    useEffect(() => {
      if (imageLoaded) {
        renderCanvas()
      }
    }, [cropData, imageLoaded, renderCanvas])

    const handleStickerUpdate = useCallback(
      (updatedSticker: Sticker) => {
        const newData = {
          ...currentData,
          stickers: currentData.stickers.map((sticker) =>
            sticker.id === updatedSticker.id ? updatedSticker : sticker,
          ),
        }
        updateData(newData)
      },
      [currentData, updateData],
    )

    const handleMentionUpdate = useCallback(
      (updatedMention: Mention) => {
        const newData = {
          ...currentData,
          mentions: currentData.mentions.map((mention) =>
            mention.id === updatedMention.id ? updatedMention : mention,
          ),
        }
        updateData(newData)
      },
      [currentData, updateData],
    )

    const handleLocationUpdate = useCallback(
      (updatedLocation: LocationTag) => {
        const newData = {
          ...currentData,
          locations: currentData.locations.map((location) =>
            location.id === updatedLocation.id ? updatedLocation : location,
          ),
        }
        updateData(newData)
      },
      [currentData, updateData],
    )

    const addSticker = useCallback(
      (sticker: Omit<Sticker, "id">) => {
        const newSticker: Sticker = {
          ...sticker,
          id: `sticker-${Date.now()}-${Math.random()}`,
        }
        const newData = {
          ...currentData,
          stickers: [...currentData.stickers, newSticker],
        }
        updateData(newData)
        return newSticker.id
      },
      [currentData, updateData],
    )

    const addMention = useCallback(
      (mention: Omit<Mention, "id">) => {
        const newMention: Mention = {
          ...mention,
          id: `mention-${Date.now()}-${Math.random()}`,
        }
        const newData = {
          ...currentData,
          mentions: [...currentData.mentions, newMention],
        }
        updateData(newData)
        return newMention.id
      },
      [currentData, updateData],
    )

    const addLocation = useCallback(
      (location: Omit<LocationTag, "id">) => {
        const newLocation: LocationTag = {
          ...location,
          id: `location-${Date.now()}-${Math.random()}`,
        }
        const newData = {
          ...currentData,
          locations: [...currentData.locations, newLocation],
        }
        updateData(newData)
        return newLocation.id
      },
      [currentData, updateData],
    )

    useImperativeHandle(
      ref,
      () => ({
        addSticker,
        addMention,
        addLocation,
        getData: () => currentData,
        setData: (newData: ImageEditorData) => {
          setCurrentData(newData)
          updateData(newData)
        },
        getCropData: () => cropData,
      }),
      [addSticker, addMention, addLocation, currentData, updateData, cropData],
    )

    useEffect(() => {
      setCurrentData(data)
    }, [data])

    return (
      <div
        className={clsx("canvas-image-editor", className)}
        style={{
          position: "relative",
          width,
          height,
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
          overflow: "hidden",
        }}
      >
        {/* Canvas pre crop rendering */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            width: "100%",
            height: "100%",
          }}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Načítavam obrázok...</p>
            </div>
          </div>
        )}

        {/* Interactive elements overlay */}
        {imageLoaded && (
          <>
            {currentData.stickers.map((sticker) => {
              // Pozície stickers sú v absolútnych súradniciach obrázka
              // Prepočítaj ich na relatívne k crop oblasti
              const relativePosition = {
                x: sticker.position.x - (cropData?.sourceX || 0),
                y: sticker.position.y - (cropData?.sourceY || 0),
              }

              // Zobraz len stickers ktoré sú viditeľné v crop oblasti
              if (
                relativePosition.x + sticker.size.width < 0 ||
                relativePosition.y + sticker.size.height < 0 ||
                relativePosition.x > width ||
                relativePosition.y > height
              ) {
                return null
              }

              return (
                <StickerItem
                  key={sticker.id}
                  sticker={{
                    ...sticker,
                    position: relativePosition,
                  }}
                  onUpdate={(updatedSticker) => {
                    // Pri update preveď pozíciu späť na absolútne súradnice
                    const absolutePosition = {
                      x: updatedSticker.position.x + (cropData?.sourceX || 0),
                      y: updatedSticker.position.y + (cropData?.sourceY || 0),
                    }
                    handleStickerUpdate({
                      ...updatedSticker,
                      id: sticker.id,
                      position: absolutePosition,
                    })
                  }}
                  onClick={onStickerClick}
                  editable={editable}
                />
              )
            })}

            {currentData.mentions.map((mention) => {
              const relativePosition = {
                x: mention.position.x - (cropData?.sourceX || 0),
                y: mention.position.y - (cropData?.sourceY || 0),
              }

              if (
                relativePosition.x + mention.size.width < 0 ||
                relativePosition.y + mention.size.height < 0 ||
                relativePosition.x > width ||
                relativePosition.y > height
              ) {
                return null
              }

              return (
                <MentionItem
                  key={mention.id}
                  mention={{
                    ...mention,
                    position: relativePosition,
                  }}
                  onUpdate={(updatedMention) => {
                    const absolutePosition = {
                      x: updatedMention.position.x + (cropData?.sourceX || 0),
                      y: updatedMention.position.y + (cropData?.sourceY || 0),
                    }
                    handleMentionUpdate({
                      ...updatedMention,
                      id: mention.id,
                      position: absolutePosition,
                    })
                  }}
                  onClick={onMentionClick}
                  editable={editable}
                />
              )
            })}

            {currentData.locations.map((location) => {
              const relativePosition = {
                x: location.position.x - (cropData?.sourceX || 0),
                y: location.position.y - (cropData?.sourceY || 0),
              }

              if (
                relativePosition.x + location.size.width < 0 ||
                relativePosition.y + location.size.height < 0 ||
                relativePosition.x > width ||
                relativePosition.y > height
              ) {
                return null
              }

              return (
                <LocationItem
                  key={location.id}
                  location={{
                    ...location,
                    position: relativePosition,
                  }}
                  onUpdate={(updatedLocation) => {
                    const absolutePosition = {
                      x: updatedLocation.position.x + (cropData?.sourceX || 0),
                      y: updatedLocation.position.y + (cropData?.sourceY || 0),
                    }
                    handleLocationUpdate({
                      ...updatedLocation,
                      id: location.id,
                      position: absolutePosition,
                    })
                  }}
                  onClick={onLocationClick}
                  editable={editable}
                />
              )
            })}
          </>
        )}

        {/* Debug info */}
        {cropData && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            Canvas: drawImage({Math.round(cropData.sourceX)}, {Math.round(cropData.sourceY)},{" "}
            {Math.round(cropData.sourceWidth)}, {Math.round(cropData.sourceHeight)}) ✅
          </div>
        )}
      </div>
    )
  },
)

CanvasImageEditor.displayName = "CanvasImageEditor"
