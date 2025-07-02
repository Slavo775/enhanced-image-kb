export interface ImageData {
  src: string
  file: File
  originalWidth: number
  originalHeight: number
  scale: number
  rotation: number
  opacity: number
  brightness: number
  x: number
  y: number
}

export interface CropPreset {
  name: string
  width: number
  height: number
  aspectRatio: number
}

export interface StickerItem {
  id: string
  type: "emoji" | "text"
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scale: number
  fontSize?: number
  color?: string
}

export interface MentionItem {
  id: string
  username: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scale: number
}

export interface LocationItem {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scale: number
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface EditorState {
  image: ImageData | null
  cropArea: CropArea | null
  cropPreset: CropPreset | null
  stickers: StickerItem[]
  mentions: MentionItem[]
  locations: LocationItem[]
  selectedItem: string | null
}

export interface ImageEditorProps {
  width?: number
  height?: number
  onStateChange?: (state: EditorState) => void
  onExport?: (canvas: HTMLCanvasElement) => void
}
