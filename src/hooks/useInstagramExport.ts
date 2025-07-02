"use client"

import { useCallback } from "react"
import type { InstagramEditorState } from "./useInstagramEditor"

export interface InstagramExportOptions {
  format: "png" | "jpeg" | "webp"
  quality: number
  pixelRatio?: number
  backgroundColor?: string
}

export const useInstagramExport = () => {
  const exportToCanvas = useCallback(
    async (
      imageSrc: string,
      editorState: InstagramEditorState,
      options: InstagramExportOptions = {
        format: "png",
        quality: 0.95,
        pixelRatio: 1,
      },
    ): Promise<HTMLCanvasElement> => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      const { canvasWidth, canvasHeight, backgroundImage, stickers } = editorState
      const pixelRatio = options.pixelRatio || 1

      // Set canvas size
      canvas.width = canvasWidth * pixelRatio
      canvas.height = canvasHeight * pixelRatio
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`

      ctx.scale(pixelRatio, pixelRatio)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Background color
      if (options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      }

      // Load and draw background image
      const img = new Image()
      img.crossOrigin = "anonymous"
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageSrc
      })

      // Draw background image with transforms
      ctx.save()
      ctx.translate(canvasWidth / 2, canvasHeight / 2)

      if (backgroundImage.rotation !== 0) {
        ctx.rotate((backgroundImage.rotation * Math.PI) / 180)
      }

      const scaledWidth = img.naturalWidth * backgroundImage.scale
      const scaledHeight = img.naturalHeight * backgroundImage.scale

      ctx.globalAlpha = backgroundImage.opacity
      ctx.drawImage(
        img,
        -scaledWidth / 2 + backgroundImage.offsetX,
        -scaledHeight / 2 + backgroundImage.offsetY,
        scaledWidth,
        scaledHeight,
      )
      ctx.restore()

      // Helper functions
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        })
      }

      const svgToImage = async (svgString: string, width: number, height: number): Promise<HTMLImageElement> => {
        const scaledSvg = svgString.replace(
          /viewBox="([^"]*)"/,
          `viewBox="$1" width="${width * pixelRatio}" height="${height * pixelRatio}"`,
        )
        const svgBlob = new Blob([scaledSvg], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(svgBlob)
        try {
          const img = await loadImage(url)
          return img
        } finally {
          URL.revokeObjectURL(url)
        }
      }

      // Draw stickers (pozície sú už relatívne k canvasu)
      for (const sticker of stickers.stickers) {
        const x = sticker.position.x
        const y = sticker.position.y
        const width = sticker.size.width
        const height = sticker.size.height

        ctx.save()

        if (sticker.rotation !== 0) {
          ctx.translate(x + width / 2, y + height / 2)
          ctx.rotate((sticker.rotation * Math.PI) / 180)
          ctx.translate(-width / 2, -height / 2)
        } else {
          ctx.translate(x, y)
        }

        switch (sticker.type) {
          case "emoji":
            const emojiSize = Math.min(width, height) * 0.8
            ctx.font = `${emojiSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", sans-serif`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = "#000"
            ctx.fillText(sticker.content, width / 2, height / 2)
            break

          case "text":
            const gradient = ctx.createLinearGradient(0, 0, width, height)
            gradient.addColorStop(0, "#ff6b6b")
            gradient.addColorStop(1, "#4ecdc4")

            ctx.fillStyle = gradient
            ctx.roundRect(0, 0, width, height, 8)
            ctx.fill()

            const textSize = Math.min(width, height) * 0.3
            ctx.fillStyle = "white"
            ctx.font = `bold ${textSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"

            ctx.shadowColor = "rgba(0,0,0,0.8)"
            ctx.shadowBlur = 4 * pixelRatio
            ctx.shadowOffsetX = 2 * pixelRatio
            ctx.shadowOffsetY = 2 * pixelRatio

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
                const img = await svgToImage(svgString, width, height)
                ctx.drawImage(img, 0, 0, width, height)
              } else {
                const img = await loadImage(sticker.content)
                ctx.drawImage(img, 0, 0, width, height)
              }
            } catch (error) {
              console.warn("Failed to load sticker image:", error)
            }
            break

          case "image":
            try {
              const img = await loadImage(sticker.content)
              ctx.drawImage(img, 0, 0, width, height)
            } catch (error) {
              console.warn("Failed to load sticker image:", error)
            }
            break
        }

        ctx.restore()
      }

      // Draw mentions
      for (const mention of stickers.mentions) {
        const x = mention.position.x
        const y = mention.position.y
        const width = mention.size.width
        const height = mention.size.height

        ctx.save()
        ctx.translate(x, y)

        ctx.fillStyle = "rgba(0, 122, 255, 0.9)"
        ctx.roundRect(0, 0, width, height, 16)
        ctx.fill()

        ctx.strokeStyle = "rgba(255,255,255,0.3)"
        ctx.lineWidth = 2 * pixelRatio
        ctx.roundRect(0, 0, width, height, 16)
        ctx.stroke()

        ctx.fillStyle = "white"
        ctx.font = `600 ${14}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`@${mention.username}`, width / 2, height / 2)

        ctx.restore()
      }

      // Draw locations
      for (const location of stickers.locations) {
        const x = location.position.x
        const y = location.position.y
        const width = location.size.width
        const height = location.size.height

        ctx.save()
        ctx.translate(x, y)

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.roundRect(0, 0, width, height, 12)
        ctx.fill()

        ctx.strokeStyle = "rgba(255,255,255,0.3)"
        ctx.lineWidth = 1 * pixelRatio
        ctx.roundRect(0, 0, width, height, 12)
        ctx.stroke()

        ctx.fillStyle = "white"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"

        ctx.font = `${16}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
        ctx.fillText("📍", 10, height / 2)

        ctx.font = `500 ${13}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        ctx.fillText(location.name, 30, height / 2)

        ctx.restore()
      }

      return canvas
    },
    [],
  )

  const downloadImage = useCallback(
    async (
      imageSrc: string,
      editorState: InstagramEditorState,
      filename: string,
      options: InstagramExportOptions = { format: "png", quality: 0.95, pixelRatio: 1 },
    ) => {
      const canvas = await exportToCanvas(imageSrc, editorState, options)

      const link = document.createElement("a")
      link.download = filename
      link.href = canvas.toDataURL(`image/${options.format}`, options.format === "png" ? undefined : options.quality)

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    [exportToCanvas],
  )

  return {
    exportToCanvas,
    downloadImage,
  }
}
