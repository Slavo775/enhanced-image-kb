import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Image utility functions
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function resizeImage(
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const { width, height } = image
  const aspectRatio = width / height

  let newWidth = width
  let newHeight = height

  if (width > maxWidth) {
    newWidth = maxWidth
    newHeight = newWidth / aspectRatio
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = newHeight * aspectRatio
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) }
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getImageDataUrl(canvas: HTMLCanvasElement, format = "image/png", quality = 1): string {
  return canvas.toDataURL(format, quality)
}

// Position and size utilities
export function clampPosition(
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  itemSize: { width: number; height: number },
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(bounds.width - itemSize.width, position.x)),
    y: Math.max(0, Math.min(bounds.height - itemSize.height, position.y)),
  }
}

export function getDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function getAngle(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// File utilities
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Instagram format utilities
export const INSTAGRAM_DIMENSIONS = {
  story: { width: 1080, height: 1920 },
  post: { width: 1080, height: 1080 },
  reel: { width: 1080, height: 1920 },
} as const

export function getInstagramDimensions(format: keyof typeof INSTAGRAM_DIMENSIONS) {
  return INSTAGRAM_DIMENSIONS[format]
}

export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  }
}
