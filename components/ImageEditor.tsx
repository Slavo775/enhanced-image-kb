"use client"

import type React from "react"

import { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from "react"
import { clsx } from "clsx"
import type { ImageEditorProps, ImageEditorData, Sticker, Mention, LocationTag } from "@/types"
import { StickerItem } from "./StickerItem"
import { MentionItem } from "./MentionItem"
import { LocationItem } from "./LocationItem"

interface CropData {
  x: number
  y: number
  width: number
  height: number
  scale: number
  scaledImageWidth: number
  scaledImageHeight: number
}

interface ExtendedImageEditorProps extends ImageEditorProps {
  cropData?: CropData
  originalImageWidth?: number
  originalImageHeight?: number
}

export const ImageEditor = forwardRef<
  {
    addSticker: (sticker: Omit<Sticker, "id">) => string
    addMention: (mention: Omit<Mention, "id">) => string
    addLocation: (location: Omit<LocationTag, "id">) => string
    getData: () => ImageEditorData
    setData: (data: ImageEditorData) => void
    getCropData: () => CropData | undefined
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

    const updateData = useCallback(
      (newData: ImageEditorData) => {
        setCurrentData(newData)
        onDataChange?.(newData)
      },
      [onDataChange],
    )

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true)
    }, [])

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

    // Vypočítaj pozíciu a rozmery obrázka
    let imageStyle: React.CSSProperties

    if (cropData) {
      // S crop - použij matematicky vypočítané rozmery
      imageStyle = {
        position: "absolute",
        // KRITICKÉ: PRESNÉ matematické rozmery - ŽIADNY object-fit!
        width: `${cropData.scaledImageWidth}px`,
        height: `${cropData.scaledImageHeight}px`,
        // Pozícia podľa crop offset (už v pixeloch)
        left: `${-cropData.x * cropData.scale}px`,
        top: `${-cropData.y * cropData.scale}px`,
        // ŽIADNE CSS transformácie, object-fit, object-position!
      }
    } else {
      // Bez crop - COVER správanie ale stále bez object-fit
      const imageAspect = (originalImageWidth || width) / (originalImageHeight || height)
      const containerAspect = width / height

      let imageWidth, imageHeight, imageLeft, imageTop

      if (imageAspect > containerAspect) {
        // Obrázok je širší - škáluj podľa výšky
        imageHeight = height
        imageWidth = height * imageAspect
        imageLeft = (width - imageWidth) / 2
        imageTop = 0
      } else {
        // Obrázok je vyšší - škáluj podľa šírky
        imageWidth = width
        imageHeight = width / imageAspect
        imageLeft = 0
        imageTop = (height - imageHeight) / 2
      }

      imageStyle = {
        position: "absolute",
        // KRITICKÉ: PRESNÉ matematické rozmery
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        left: `${imageLeft}px`,
        top: `${imageTop}px`,
        // ŽIADNY object-fit!
      }
    }

    return (
      <div
        className={clsx("image-editor", className)}
        style={{
          position: "relative",
          width,
          height,
          overflow: "hidden", // KRITICKÉ: orezáva čo sa nezmestí
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Obrázok s PRESNE vypočítanými rozmermi - ŽIADNY object-fit! */}
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          style={imageStyle}
          draggable={false}
          onLoad={handleImageLoad}
          onError={() => setImageLoaded(false)}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Načítavam obrázok...</p>
            </div>
          </div>
        )}

        {/* Stickers, mentions, locations - pozície relatívne k crop oblasti */}
        {imageLoaded && (
          <>
            {currentData.stickers.map((sticker) => {
              // Pozície stickers sú v absolútnych súradniciach obrázka
              // Prepočítaj ich na relatívne k crop oblasti
              const relativePosition = {
                x: sticker.position.x - (cropData?.x || 0),
                y: sticker.position.y - (cropData?.y || 0),
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
                      x: updatedSticker.position.x + (cropData?.x || 0),
                      y: updatedSticker.position.y + (cropData?.y || 0),
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
                x: mention.position.x - (cropData?.x || 0),
                y: mention.position.y - (cropData?.y || 0),
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
                      x: updatedMention.position.x + (cropData?.x || 0),
                      y: updatedMention.position.y + (cropData?.y || 0),
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
                x: location.position.x - (cropData?.x || 0),
                y: location.position.y - (cropData?.y || 0),
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
                      x: updatedLocation.position.x + (cropData?.x || 0),
                      y: updatedLocation.position.y + (cropData?.y || 0),
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
            Matematické: {Math.round(cropData.scaledImageWidth)}×{Math.round(cropData.scaledImageHeight)} | ŽIADNY
            object-fit! ✅
          </div>
        )}
      </div>
    )
  },
)

ImageEditor.displayName = "ImageEditor"
