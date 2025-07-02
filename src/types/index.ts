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
export interface Sticker {
  id: string
  type: "emoji" | "text" | "image" | "svg"
  content: string
  position: Position
  size: Size
  rotation?: number
  zIndex?: number
}

// Mention types
export interface Mention {
  id: string
  username: string
  displayName: string
  avatar?: string
  position: Position
  size: Size
}

// Location types
export interface LocationTag {
  id: string
  name: string
  address?: string
  coordinates?: {
    lat: number
    lng: number
  }
  position: Position
  size: Size
}

// Editor data
export interface ImageEditorData {
  stickers: Sticker[]
  mentions: Mention[]
  locations: LocationTag[]
}

// Props interfaces
export interface ImageEditorProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  data?: ImageEditorData
  onDataChange?: (data: ImageEditorData) => void
  onStickerClick?: (sticker: Sticker) => void
  onMentionClick?: (mention: Mention) => void
  onLocationClick?: (location: LocationTag) => void
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
  scale: number
  scaledImageWidth: number
  scaledImageHeight: number
}

export interface EditorData {
  image: string | null
  stickers: Sticker[]
  cropArea: CropArea | null
  backgroundSettings: BackgroundSettings
}
