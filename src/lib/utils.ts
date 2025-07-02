import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename = "image.png") {
  const link = document.createElement("a")
  link.download = filename
  link.href = canvas.toDataURL()
  link.click()
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, "image/png")
    })

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ])
    return true
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    return false
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
