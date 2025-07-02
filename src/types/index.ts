import type React from "react"
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

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

export interface ImageState {
  src: string | null
  scale: number
  rotation: number
  position: Position
  opacity: number
  brightness: number
  contrast: number
  saturation: number
  blur: number
}

export interface StickerItem {
  id: string
  type: "emoji" | "text" | "mention" | "location"
  content: string
  position: Position
  size: Size
  rotation: number
  opacity: number
  selected: boolean
  zIndex: number
}

export interface EditorState {
  image: ImageState | null
  stickers: StickerItem[]
  cropArea: CropArea | null
  canvasSize: Size
}

export interface EditorData {
  image: ImageState | null
  stickers: StickerItem[]
  cropArea: CropArea | null
  backgroundSettings: BackgroundSettings
}

export interface ImageEditorProps {
  width?: number
  height?: number
  onStateChange?: (state: EditorState) => void
  onExport?: (canvas: HTMLCanvasElement) => void
}

// Add missing types used in components:

export interface Sticker {
  id: string
  type: "emoji" | "text" | "svg" | "image"
  content: string
  position: Position
  size: Size
  rotation?: number
  opacity?: number
}

export interface MentionData {
  username: string
  displayName: string
  avatar?: string
}

export interface Mention {
  id: string
  position: Position
  size: Size
  username: string
  displayName: string
  avatar?: string
}

export interface LocationData {
  name: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface LocationTag {
  id: string
  position: Position
  size: Size
  name: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface ImageEditorData {
  stickers: Sticker[]
  mentions: Mention[]
  locations: LocationTag[]
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
