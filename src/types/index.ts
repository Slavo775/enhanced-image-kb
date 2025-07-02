import type React from "react"
// Position and Size interfaces
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

// Sticker types
export interface StickerItem {
  id: string
  type: "emoji" | "text" | "svg" | "image"
  content: string
  position: Position
  size: Size
  rotation: number
  zIndex: number
}

// Mention types
export interface MentionItem {
  id: string
  username: string
  position: Position
  size: Size
  zIndex: number
}

// Location types
export interface LocationItem {
  id: string
  name: string
  position: Position
  size: Size
  zIndex: number
}

// Editor data
export interface ImageEditorData {
  stickers: StickerItem[]
  mentions: MentionItem[]
  locations: LocationItem[]
}

// Props interfaces
export interface ImageEditorProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  data?: ImageEditorData
  onDataChange?: (data: ImageEditorData) => void
  onStickerClick?: (sticker: StickerItem) => void
  onMentionClick?: (mention: MentionItem) => void
  onLocationClick?: (location: LocationItem) => void
  editable?: boolean
  className?: string
}

export interface DraggableItemProps {
  children: React.ReactNode
  position: Position
  size: Size
  onPositionChange: (position: Position) => void
  onSizeChange: (size: Size) => void
  onRotationChange?: (rotation: number) => void
  rotation?: number
  editable?: boolean
  className?: string
}

// Legacy types for compatibility
export interface MentionData {
  username: string
  displayName: string
  avatar?: string
}

export interface LocationData {
  name: string
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// Background and crop types
export interface BackgroundSettings {
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

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ExportSettings {
  format: "png" | "jpeg" | "webp"
  quality: number
  width?: number
  height?: number
  backgroundColor?: string
}

export interface EditorData {
  image: string | null
  stickers: StickerItem[]
  cropArea: CropArea | null
  backgroundSettings: BackgroundSettings
}
