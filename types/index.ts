import type React from "react"
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Sticker {
  id: string
  type: "emoji" | "image" | "text" | "svg"
  content: string
  position: Position
  size: Size
  rotation: number
  zIndex: number
}

export interface Mention {
  id: string
  username: string
  displayName: string
  position: Position
  size: Size
}

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

export interface ImageEditorData {
  stickers: Sticker[]
  mentions: Mention[]
  locations: LocationTag[]
}

export interface ImageEditorProps {
  src: string
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
