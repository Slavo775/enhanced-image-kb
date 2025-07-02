import type React from "react"

// Core types for the image editor
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Dimensions {
  width: number
  height: number
}

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageDimensions {
  width: number
  height: number
  naturalWidth: number
  naturalHeight: number
}

export interface ExportSettings {
  format: "png" | "jpg" | "webp"
  quality: number
  width?: number
  height?: number
}

// Instagram specific types
export interface InstagramStoryDimensions {
  name: "story"
  width: 1080
  height: 1920
  aspectRatio: "9:16"
}

export interface InstagramPostDimensions {
  name: "post"
  width: 1080
  height: 1080
  aspectRatio: "1:1"
}

export interface InstagramReelDimensions {
  name: "reel"
  width: 1080
  height: 1920
  aspectRatio: "9:16"
}

export type InstagramFormat = InstagramStoryDimensions | InstagramPostDimensions | InstagramReelDimensions

// Draggable item types
export interface DraggableItemProps {
  id: string
  type: "text" | "sticker" | "mention" | "location"
  position: Position
  size: Size
  rotation: number
  content: string
  style?: React.CSSProperties
  onUpdate: (id: string, updates: Partial<DraggableItemProps>) => void
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
}

// Text item specific types
export interface TextItemProps extends DraggableItemProps {
  type: "text"
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor?: string
  textAlign: "left" | "center" | "right"
  fontWeight: "normal" | "bold"
  fontStyle: "normal" | "italic"
}

// Sticker item types
export interface StickerItemProps extends DraggableItemProps {
  type: "sticker"
  stickerUrl: string
}

export interface StickerItem {
  id: string
  emoji: string
  position: Position
  size: Size
  rotation: number
  opacity: number
}

// Mention item types
export interface MentionItemProps extends DraggableItemProps {
  type: "mention"
  username: string
}

export interface MentionItem {
  id: string
  username: string
  position: Position
  opacity: number
  rotation: number
}

// Location item types
export interface LocationItemProps extends DraggableItemProps {
  type: "location"
  locationName: string
}

export interface LocationItem {
  id: string
  name: string
  position: Position
  opacity: number
  rotation: number
}

// Editor state types
export interface EditorState {
  image: HTMLImageElement | null
  items: DraggableItemProps[]
  selectedItemId: string | null
  canvasSize: Size
  zoom: number
  backgroundColor: string
  backgroundSettings: BackgroundSettings
  filterSettings: FilterSettings
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

export interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hue: number
  sepia: number
  grayscale: number
}

// Hook return types
export interface UseInstagramEditorReturn {
  state: EditorState
  actions: {
    setImage: (image: HTMLImageElement) => void
    addTextItem: (text: string) => void
    addStickerItem: (stickerUrl: string) => void
    addMentionItem: (username: string) => void
    addLocationItem: (locationName: string) => void
    updateItem: (id: string, updates: Partial<DraggableItemProps>) => void
    deleteItem: (id: string) => void
    selectItem: (id: string) => void
    clearSelection: () => void
    setZoom: (zoom: number) => void
    setBackgroundColor: (color: string) => void
    setBackgroundSettings: (settings: BackgroundSettings) => void
    setFilterSettings: (settings: FilterSettings) => void
    exportImage: (options: ExportSettings) => Promise<string>
  }
}

export interface UseDraggableReturn {
  isDragging: boolean
  position: Position
  dragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
  }
}

export interface UseResizableReturn {
  isResizing: boolean
  size: Size
  resizeHandlers: {
    onMouseDown: (e: React.MouseEvent, direction: ResizeDirection) => void
    onTouchStart: (e: React.TouchEvent, direction: ResizeDirection) => void
  }
}

export type ResizeDirection = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w"

// Canvas crop types
export interface CropState {
  isActive: boolean
  startPoint: Position | null
  endPoint: Position | null
  cropArea: CropArea | null
}

export interface UseCanvasCropReturn {
  cropState: CropState
  startCrop: (point: Position) => void
  updateCrop: (point: Position) => void
  finishCrop: () => CropArea | null
  cancelCrop: () => void
}

// Export types
export interface UseImageExportReturn {
  exportImage: (canvas: HTMLCanvasElement, options: ExportSettings) => Promise<string>
  exportInstagramStory: (canvas: HTMLCanvasElement, options?: Partial<ExportSettings>) => Promise<string>
  exportInstagramPost: (canvas: HTMLCanvasElement, options?: Partial<ExportSettings>) => Promise<string>
  exportInstagramReel: (canvas: HTMLCanvasElement, options?: Partial<ExportSettings>) => Promise<string>
}
