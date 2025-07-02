"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { ImageEditorData } from "../types"

export interface BackgroundImageState {
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
  opacity: number
  brightness: number
  contrast: number
  saturation: number
  blur: number
}

export interface InstagramEditorState {
  canvasWidth: number
  canvasHeight: number
  backgroundImage: BackgroundImageState
  stickers: ImageEditorData
}

export const useInstagramEditor = (canvasWidth: number, canvasHeight: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Background image state
  const [backgroundState, setBackgroundState] = useState<BackgroundImageState>({
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    opacity: 1,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  })

  // Stickers state (positions relative to canvas)
  const [stickersData, setStickersData] = useState<ImageEditorData>({
    stickers: [],
    mentions: [],
    locations: [],
    texts: [],
  })

  // Load image
  const loadImage = useCallback(
    (imageSrc: string) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        imageRef.current = img
        setImageLoaded(true)

        // Auto-fit image to canvas
        const imageAspect = img.naturalWidth / img.naturalHeight
        const canvasAspect = canvasWidth / canvasHeight

        let initialScale: number
        if (imageAspect > canvasAspect) {
          // Image is wider - fit by height
          initialScale = canvasHeight / img.naturalHeight
        } else {
          // Image is taller - fit by width
          initialScale = canvasWidth / img.naturalWidth
        }

        setBackgroundState((prev) => ({
          ...prev,
          scale: initialScale,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
        }))
      }
      img.onerror = () => setImageLoaded(false)
      img.src = imageSrc
    },
    [canvasWidth, canvasHeight],
  )

  // Update background image
  const updateBackground = useCallback((updates: Partial<BackgroundImageState>) => {
    setBackgroundState((prev) => ({ ...prev, ...updates }))
  }, [])

  // Helper functions for drawing
  const loadImageHelper = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const svgToImage = async (svgString: string): Promise<HTMLImageElement> => {
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)
    try {
      const img = await loadImageHelper(url)
      return img
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  // Render COMPLETE canvas (background + stickers)
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img || !imageLoaded) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw background image with transforms
    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight / 2)

    if (backgroundState.rotation !== 0) {
      ctx.rotate((backgroundState.rotation * Math.PI) / 180)
    }

    const scaledWidth = img.naturalWidth * backgroundState.scale
    const scaledHeight = img.naturalHeight * backgroundState.scale

    ctx.globalAlpha = backgroundState.opacity
    ctx.filter = `brightness(${backgroundState.brightness}%) contrast(${backgroundState.contrast}%) saturate(${backgroundState.saturation}%) blur(${backgroundState.blur}px)`
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    ctx.drawImage(
      img,
      -scaledWidth / 2 + backgroundState.offsetX,
      -scaledHeight / 2 + backgroundState.offsetY,
      scaledWidth,
      scaledHeight,
    )
    ctx.restore()
    ctx.filter = "none"

    // Draw ALL stickers on canvas
    for (const sticker of stickersData.stickers) {
      const x = sticker.position.x
      const y = sticker.position.y
      const width = sticker.size.width
      const height = sticker.size.height

      ctx.save()

      // Apply rotation if needed
      if (sticker.rotation !== 0) {
        ctx.translate(x + width / 2, y + height / 2)
        ctx.rotate((sticker.rotation * Math.PI) / 180)
        ctx.translate(-width / 2, -height / 2)
      } else {
        ctx.translate(x, y)
      }

      // Apply opacity
      ctx.globalAlpha = sticker.opacity || 1

      switch (sticker.type) {
        case "emoji":
          const emojiSize = Math.min(width, height) * 0.8
          ctx.font = `${emojiSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(sticker.content, width / 2, height / 2)
          break

        case "text":
          // Create gradient background for text
          const gradient = ctx.createLinearGradient(0, 0, width, height)
          gradient.addColorStop(0, sticker.color || "#ff6b6b")
          gradient.addColorStop(1, sticker.secondaryColor || "#4ecdc4")

          ctx.fillStyle = gradient
          ctx.roundRect(0, 0, width, height, 8)
          ctx.fill()

          // Draw text
          const textSize = Math.min(width, height) * 0.3
          ctx.fillStyle = "white"
          ctx.font = `bold ${textSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          ctx.shadowColor = "rgba(0,0,0,0.8)"
          ctx.shadowBlur = 4
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2

          ctx.fillText(sticker.content, width / 2, height / 2)

          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
          break

        case "svg":
          try {
            if (sticker.content.startsWith("data:image/svg+xml;base64,")) {
              const svgString = atob(sticker.content.split(",")[1])
              const img = await svgToImage(svgString)
              ctx.drawImage(img, 0, 0, width, height)
            } else {
              const img = await loadImageHelper(sticker.content)
              ctx.drawImage(img, 0, 0, width, height)
            }
          } catch (error) {
            console.warn("Failed to load sticker image:", error)
          }
          break

        case "image":
          try {
            const img = await loadImageHelper(sticker.content)
            ctx.drawImage(img, 0, 0, width, height)
          } catch (error) {
            console.warn("Failed to load sticker image:", error)
          }
          break
      }

      ctx.restore()
    }

    // Draw mentions on canvas
    for (const mention of stickersData.mentions) {
      const x = mention.position.x
      const y = mention.position.y
      const width = mention.size.width
      const height = mention.size.height

      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = mention.opacity || 1

      // Draw mention background
      ctx.fillStyle = "rgba(0, 122, 255, 0.9)"
      ctx.roundRect(0, 0, width, height, 16)
      ctx.fill()

      // Draw mention border
      ctx.strokeStyle = "rgba(255,255,255,0.3)"
      ctx.lineWidth = 2
      ctx.roundRect(0, 0, width, height, 16)
      ctx.stroke()

      // Draw mention text
      ctx.fillStyle = "white"
      ctx.font = `600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`@${mention.username}`, width / 2, height / 2)

      ctx.restore()
    }

    // Draw locations on canvas
    for (const location of stickersData.locations) {
      const x = location.position.x
      const y = location.position.y
      const width = location.size.width
      const height = location.size.height

      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = location.opacity || 1

      // Draw location background
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.roundRect(0, 0, width, height, 12)
      ctx.fill()

      // Draw location border
      ctx.strokeStyle = "rgba(255,255,255,0.3)"
      ctx.lineWidth = 1
      ctx.roundRect(0, 0, width, height, 12)
      ctx.stroke()

      // Draw location icon and text
      ctx.fillStyle = "white"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      ctx.font = `16px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
      ctx.fillText("📍", 10, height / 2)

      ctx.font = `500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
      ctx.fillText(location.name, 30, height / 2)

      ctx.restore()
    }

    // Draw custom texts
    for (const text of stickersData.texts || []) {
      const x = text.position.x
      const y = text.position.y
      const width = text.size.width
      const height = text.size.height

      ctx.save()

      // Apply rotation if needed
      if (text.rotation !== 0) {
        ctx.translate(x + width / 2, y + height / 2)
        ctx.rotate((text.rotation * Math.PI) / 180)
        ctx.translate(-width / 2, -height / 2)
      } else {
        ctx.translate(x, y)
      }

      // Apply opacity
      ctx.globalAlpha = text.opacity || 1

      // Draw text
      const fontSize = text.fontSize || Math.min(width, height) * 0.4
      ctx.fillStyle = text.color || "#ffffff"
      ctx.font = `${text.fontWeight || "bold"} ${fontSize}px ${text.fontFamily || "Arial, sans-serif"}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Add text shadow if specified
      if (text.shadow) {
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.shadowBlur = 4
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2
      }

      // Draw text with word wrap if needed
      const words = text.content.split(" ")
      let line = ""
      const lineHeight = fontSize * 1.2
      const textY = height / 2 - ((words.length - 1) * lineHeight) / 2

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > width * 0.9 && i > 0) {
          ctx.fillText(line, width / 2, textY + i * lineHeight)
          line = words[i] + " "
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, width / 2, textY + words.length * lineHeight)

      ctx.restore()
    }
  }, [canvasWidth, canvasHeight, backgroundState, imageLoaded, stickersData])

  // Re-render when state changes
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  // Get current editor state
  const getEditorState = useCallback(
    (): InstagramEditorState => ({
      canvasWidth,
      canvasHeight,
      backgroundImage: backgroundState,
      stickers: stickersData,
    }),
    [canvasWidth, canvasHeight, backgroundState, stickersData],
  )

  // Reset to fit image
  const resetToFit = useCallback(() => {
    const img = imageRef.current
    if (!img) return

    const imageAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = canvasWidth / canvasHeight

    let fitScale: number
    if (imageAspect > canvasAspect) {
      fitScale = canvasHeight / img.naturalHeight
    } else {
      fitScale = canvasWidth / img.naturalWidth
    }

    setBackgroundState((prev) => ({
      ...prev,
      scale: fitScale,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
    }))
  }, [canvasWidth, canvasHeight])

  // Fill canvas (cover mode)
  const fillCanvas = useCallback(() => {
    const img = imageRef.current
    if (!img) return

    const imageAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = canvasWidth / canvasHeight

    let fillScale: number
    if (imageAspect > canvasAspect) {
      fillScale = canvasWidth / img.naturalWidth
    } else {
      fillScale = canvasHeight / img.naturalHeight
    }

    setBackgroundState((prev) => ({
      ...prev,
      scale: fillScale,
      offsetX: 0,
      offsetY: 0,
    }))
  }, [canvasWidth, canvasHeight])

  // Export canvas directly
  const exportCanvas = useCallback((format: "png" | "jpeg" | "webp" = "png", quality = 0.95) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    return canvas.toDataURL(`image/${format}`, format === "png" ? undefined : quality)
  }, [])

  // Download canvas as image
  const downloadCanvas = useCallback((filename: string, format: "png" | "jpeg" | "webp" = "png", quality = 0.95) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = filename
    link.href = canvas.toDataURL(`image/${format}`, format === "png" ? undefined : quality)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // Copy canvas to clipboard
  const copyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return false

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return false

        try {
          const item = new ClipboardItem({ "image/png": blob })
          await navigator.clipboard.write([item])
          return true
        } catch (err) {
          console.error("Failed to copy to clipboard:", err)
          return false
        }
      }, "image/png")
    } catch (err) {
      console.error("Failed to create blob:", err)
      return false
    }
  }, [])

  return {
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
    renderCanvas,
    exportCanvas,
    downloadCanvas,
    copyToClipboard,
  }
}
