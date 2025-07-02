export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
  const link = document.createElement("a")
  link.download = filename
  link.href = canvas.toDataURL("image/png")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement) => {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API not supported")
  }

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Failed to create blob from canvas"))
        return
      }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ])
        resolve()
      } catch (error) {
        reject(error)
      }
    }, "image/png")
  })
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const getDistance = (point1: { x: number; y: number }, point2: { x: number; y: number }): number => {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const getAngle = (point1: { x: number; y: number }, point2: { x: number; y: number }): number => {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

export const rotatePoint = (
  point: { x: number; y: number },
  center: { x: number; y: number },
  angle: number,
): { x: number; y: number } => {
  const radians = (angle * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  const dx = point.x - center.x
  const dy = point.y - center.y

  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  }
}
