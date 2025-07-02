"use client"

import { useCallback } from "react"
import type { ImageEditorData } from "../types"
import type { CanvasCropData } from "./useCanvasCrop"

export interface ExportOptions {
  format: "png" | "jpeg" | "webp"
  quality: number
  width?: number
  height?: number
  backgroundColor?: string
  pixelRatio?: number
  antiAlias?: boolean
  textQuality?: "low" | "medium" | "high"
}

export interface ExportResult {
  canvas: HTMLCanvasElement
  dataUrl: string
  blob: Blob
  file: File
  interactiveData: ImageEditorData
}

export const useImageExport = () => {
  const exportToCanvas = useCallback(
    async (
      imageSrc: string,
      data: ImageEditorData,
      editorWidth: number,
      editorHeight: number,
      options: ExportOptions = {
        format: "png",
        quality: 0.95,
        pixelRatio: 1,
        antiAlias: true,
        textQuality: "high",
      },
      cropData?: CanvasCropData,
      originalImageWidth?: number,
      originalImageHeight?: number,
    ): Promise<HTMLCanvasElement> => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d", {
        alpha: options.format === "png",
        desynchronized: false,
        colorSpace: "srgb",
      })!

      // Finálne rozmery
      const finalWidth = options.width || editorWidth
      const finalHeight = options.height || editorHeight
      const pixelRatio = options.pixelRatio || 1

      canvas.width = finalWidth * pixelRatio
      canvas.height = finalHeight * pixelRatio
      canvas.style.width = `${finalWidth}px`
      canvas.style.height = `${finalHeight}px`

      ctx.scale(pixelRatio, pixelRatio)

      if (options.antiAlias) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
      }

      if (options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(0, 0, finalWidth, finalHeight)
      }

      // Load base image
      const baseImage = new Image()
      baseImage.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        baseImage.onload = resolve
        baseImage.onerror = reject
        baseImage.src = imageSrc
      })

      // Draw base image s COVER správaním
      ctx.save()
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      if (cropData) {
        // S crop data - použij COVER source rozmery
        ctx.drawImage(
          baseImage,
          cropData.sourceX, // source x (COVER pozícia)
          cropData.sourceY, // source y (COVER pozícia)
          cropData.sourceWidth, // source width (COVER rozmery)
          cropData.sourceHeight, // source height (COVER rozmery)
          0, // dest x
          0, // dest y
          finalWidth, // dest width
          finalHeight, // dest height
        )
      } else {
        // Bez crop - COVER správanie
        const imageAspect = baseImage.naturalWidth / baseImage.naturalHeight
        const targetAspect = finalWidth / finalHeight

        let sourceX, sourceY, sourceWidth, sourceHeight

        if (imageAspect > targetAspect) {
          // Obrázok je širší - škáluj podľa výšky
          sourceHeight = baseImage.naturalHeight
          sourceWidth = sourceHeight * targetAspect
          sourceX = (baseImage.naturalWidth - sourceWidth) / 2
          sourceY = 0
        } else {
          // Obrázok je vyšší - škáluj podľa šírky
          sourceWidth = baseImage.naturalWidth
          sourceHeight = sourceWidth / targetAspect
          sourceX = 0
          sourceY = (baseImage.naturalHeight - sourceHeight) / 2
        }

        ctx.drawImage(baseImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, finalWidth, finalHeight)
      }
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

      // Škálovanie pre finálne rozmery
      const scaleX = finalWidth / editorWidth
      const scaleY = finalHeight / editorHeight

      // Draw stickers (pozície relatívne k crop oblasti)
      for (const sticker of data.stickers) {
        // Pozície sú v absolútnych súradniciach obrázka
        // Preveď na relatívne k crop oblasti
        const relativeX = sticker.position.x - (cropData?.sourceX || 0)
        const relativeY = sticker.position.y - (cropData?.sourceY || 0)

        // Škáluj na finálne rozmery
        const x = relativeX * scaleX
        const y = relativeY * scaleY
        const width = sticker.size.width * scaleX
        const height = sticker.size.height * scaleY

        // Skip ak je mimo crop oblasti
        if (x + width < 0 || y + height < 0 || x > finalWidth || y > finalHeight) continue

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
            ctx.roundRect(0, 0, width, height, 8 * scaleX)
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

            const words = sticker.content.split(" ")
            const maxWidth = width - 16 * scaleX
            let line = ""
            let y_offset = height / 2 - (words.length > 3 ? 10 * scaleY : 0)

            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + " "
              const metrics = ctx.measureText(testLine)
              const testWidth = metrics.width

              if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, width / 2, y_offset)
                line = words[n] + " "
                y_offset += textSize * 1.2
              } else {
                line = testLine
              }
            }
            ctx.fillText(line, width / 2, y_offset)

            ctx.shadowColor = "transparent"
            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
            break

          case "svg":
            try {
              ctx.imageSmoothingEnabled = true
              ctx.imageSmoothingQuality = "high"

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
              ctx.imageSmoothingEnabled = true
              ctx.imageSmoothingQuality = "high"
              const img = await loadImage(sticker.content)
              ctx.drawImage(img, 0, 0, width, height)
            } catch (error) {
              console.warn("Failed to load sticker image:", error)
            }
            break
        }

        ctx.restore()
      }

      // Draw mentions (rovnako ako stickers)
      for (const mention of data.mentions) {
        const relativeX = mention.position.x - (cropData?.sourceX || 0)
        const relativeY = mention.position.y - (cropData?.sourceY || 0)

        const x = relativeX * scaleX
        const y = relativeY * scaleY
        const width = mention.size.width * scaleX
        const height = mention.size.height * scaleY

        if (x + width < 0 || y + height < 0 || x > finalWidth || y > finalHeight) continue

        ctx.save()
        ctx.translate(x, y)

        ctx.fillStyle = "rgba(0, 122, 255, 0.9)"
        ctx.roundRect(0, 0, width, height, 16 * scaleX)
        ctx.fill()

        ctx.strokeStyle = "rgba(255,255,255,0.3)"
        ctx.lineWidth = 2 * pixelRatio
        ctx.roundRect(0, 0, width, height, 16 * scaleX)
        ctx.stroke()

        ctx.fillStyle = "white"
        ctx.font = `600 ${14 * scaleX}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`@${mention.username}`, width / 2, height / 2)

        ctx.restore()
      }

      // Draw locations (rovnako ako stickers)
      for (const location of data.locations) {
        const relativeX = location.position.x - (cropData?.sourceX || 0)
        const relativeY = location.position.y - (cropData?.sourceY || 0)

        const x = relativeX * scaleX
        const y = relativeY * scaleY
        const width = location.size.width * scaleX
        const height = location.size.height * scaleY

        if (x + width < 0 || y + height < 0 || x > finalWidth || y > finalHeight) continue

        ctx.save()
        ctx.translate(x, y)

        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
        ctx.roundRect(0, 0, width, height, 12 * scaleX)
        ctx.fill()

        ctx.strokeStyle = "rgba(255,255,255,0.3)"
        ctx.lineWidth = 1 * pixelRatio
        ctx.roundRect(0, 0, width, height, 12 * scaleX)
        ctx.stroke()

        ctx.fillStyle = "white"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"

        ctx.font = `${16 * scaleX}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
        ctx.fillText("📍", 10 * scaleX, height / 2)

        ctx.font = `500 ${13 * scaleX}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        ctx.fillText(location.name, 30 * scaleX, height / 2)

        ctx.restore()
      }

      return canvas
    },
    [],
  )

  const exportToBlob = useCallback(
    async (
      imageSrc: string,
      data: ImageEditorData,
      editorWidth: number,
      editorHeight: number,
      options: ExportOptions = { format: "png", quality: 0.95, pixelRatio: 1 },
      cropData?: CanvasCropData,
      originalImageWidth?: number,
      originalImageHeight?: number,
    ): Promise<Blob> => {
      const canvas = await exportToCanvas(
        imageSrc,
        data,
        editorWidth,
        editorHeight,
        options,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob!),
          `image/${options.format}`,
          options.format === "png" ? undefined : options.quality,
        )
      })
    },
    [exportToCanvas],
  )

  const exportToFile = useCallback(
    async (
      imageSrc: string,
      data: ImageEditorData,
      editorWidth: number,
      editorHeight: number,
      filename: string,
      options: ExportOptions = { format: "png", quality: 0.95, pixelRatio: 1 },
      cropData?: CanvasCropData,
      originalImageWidth?: number,
      originalImageHeight?: number,
    ): Promise<File> => {
      const blob = await exportToBlob(
        imageSrc,
        data,
        editorWidth,
        editorHeight,
        options,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )
      return new File([blob], filename, { type: blob.type })
    },
    [exportToBlob],
  )

  const exportComplete = useCallback(
    async (
      imageSrc: string,
      data: ImageEditorData,
      editorWidth: number,
      editorHeight: number,
      filename: string,
      options: ExportOptions = { format: "png", quality: 0.95, pixelRatio: 1 },
      cropData?: CanvasCropData,
      originalImageWidth?: number,
      originalImageHeight?: number,
    ): Promise<ExportResult> => {
      const canvas = await exportToCanvas(
        imageSrc,
        data,
        editorWidth,
        editorHeight,
        options,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )
      const dataUrl = canvas.toDataURL(
        `image/${options.format}`,
        options.format === "png" ? undefined : options.quality,
      )
      const blob = await exportToBlob(
        imageSrc,
        data,
        editorWidth,
        editorHeight,
        options,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )
      const file = new File([blob], filename, { type: blob.type })

      return {
        canvas,
        dataUrl,
        blob,
        file,
        interactiveData: data,
      }
    },
    [exportToCanvas, exportToBlob],
  )

  const downloadImage = useCallback(
    async (
      imageSrc: string,
      data: ImageEditorData,
      editorWidth: number,
      editorHeight: number,
      filename: string,
      options: ExportOptions = { format: "png", quality: 0.95, pixelRatio: 1 },
      cropData?: CanvasCropData,
      originalImageWidth?: number,
      originalImageHeight?: number,
    ) => {
      const canvas = await exportToCanvas(
        imageSrc,
        data,
        editorWidth,
        editorHeight,
        options,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )

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
    exportToBlob,
    exportToFile,
    exportComplete,
    downloadImage,
  }
}
