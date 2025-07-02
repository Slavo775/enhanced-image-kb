"use client"

import { useState, useCallback, useEffect, useMemo } from "react"

export interface CropData {
  x: number
  y: number
  width: number
  height: number
  scale: number
  // Pridané: skutočné rozmery škálovaného obrázka
  scaledImageWidth: number
  scaledImageHeight: number
}

export const useCropLogic = (imageWidth: number, imageHeight: number, cropWidth: number, cropHeight: number) => {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  // KRITICKÉ: Vypočítaj scale aby obrázok POKRYL celú crop oblasť (COVER správanie)
  const scale = useMemo(() => {
    if (imageWidth <= 0 || imageHeight <= 0 || cropWidth <= 0 || cropHeight <= 0) return 1

    // COVER scale - obrázok pokryje celú crop oblasť, zachová pomer strán
    const scaleX = cropWidth / imageWidth
    const scaleY = cropHeight / imageHeight

    // Použij väčší scale aby pokryl celú oblasť
    return Math.max(scaleX, scaleY)
  }, [imageWidth, imageHeight, cropWidth, cropHeight])

  // Skutočné rozmery škálovaného obrázka
  const scaledImageWidth = useMemo(() => imageWidth * scale, [imageWidth, scale])
  const scaledImageHeight = useMemo(() => imageHeight * scale, [imageHeight, scale])

  // Reset pri zmene rozmerov
  useEffect(() => {
    // Vycentruj obrázok
    const centerX = (scaledImageWidth - cropWidth) / 2
    const centerY = (scaledImageHeight - cropHeight) / 2
    setOffsetX(-centerX)
    setOffsetY(-centerY)
  }, [scale, scaledImageWidth, scaledImageHeight, cropWidth, cropHeight])

  // Vypočítaj crop data - MEMOIZED
  const cropData = useMemo((): CropData => {
    // Pozícia obrázka v crop kontajneri
    const imageX = offsetX
    const imageY = offsetY

    // Čo je viditeľné z obrázka v crop oblasti (v škálovaných súradniciach)
    const visibleLeft = Math.max(0, -imageX)
    const visibleTop = Math.max(0, -imageY)
    const visibleRight = Math.min(scaledImageWidth, cropWidth - Math.max(0, imageX))
    const visibleBottom = Math.min(scaledImageHeight, cropHeight - Math.max(0, imageY))

    const visibleWidth = Math.max(0, visibleRight - visibleLeft)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)

    // Preveď na originálne súradnice (bez škálovania)
    return {
      x: visibleLeft / scale,
      y: visibleTop / scale,
      width: visibleWidth / scale,
      height: visibleHeight / scale,
      scale: scale,
      scaledImageWidth,
      scaledImageHeight,
    }
  }, [offsetX, offsetY, scale, scaledImageWidth, scaledImageHeight, cropWidth, cropHeight])

  // Aktualizuj offset s obmedzeniami
  const updateOffset = useCallback(
    (newOffsetX: number, newOffsetY: number) => {
      // Obmedz posun aby obrázok nepokryl celú crop oblasť
      const maxOffsetX = Math.max(-(scaledImageWidth - cropWidth), Math.min(0, newOffsetX))
      const maxOffsetY = Math.max(-(scaledImageHeight - cropHeight), Math.min(0, newOffsetY))

      setOffsetX(maxOffsetX)
      setOffsetY(maxOffsetY)
    },
    [scaledImageWidth, scaledImageHeight, cropWidth, cropHeight],
  )

  // Reset
  const reset = useCallback(() => {
    const centerX = (scaledImageWidth - cropWidth) / 2
    const centerY = (scaledImageHeight - cropHeight) / 2
    setOffsetX(-centerX)
    setOffsetY(-centerY)
  }, [scaledImageWidth, scaledImageHeight, cropWidth, cropHeight])

  return {
    scale,
    offsetX,
    offsetY,
    scaledImageWidth,
    scaledImageHeight,
    cropData,
    updateOffset,
    reset,
  }
}
