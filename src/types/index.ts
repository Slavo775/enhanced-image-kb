export type AspectRatioType = "original" | "1/1" | "4/3" | "16/9"

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface DraggableItemProps {
  id: string
  type: "text" | "sticker" | "mention" | "location"
  content: string
  position: Position
  size: Size
  rotation: number
  onUpdate: (id: string, updates: Partial<DraggableItemProps>) => void
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
}

export interface InstagramStoryFormat {
  width: number
  height: number
  aspectRatio: string
}

export interface InstagramPostFormat {
  width: number
  height: number
  aspectRatio: string
}

export interface TextStyle {
  fontSize: number
  fontFamily: string
  color: string
  fontWeight: "normal" | "bold"
  fontStyle: "normal" | "italic"
  textAlign: "left" | "center" | "right"
}

export interface StickerItem {
  id: string
  type: "sticker"
  emoji: string
  position: Position
  size: Size
  rotation: number
}

export interface TextItem {
  id: string
  type: "text"
  content: string
  position: Position
  size: Size
  rotation: number
  style: TextStyle
}

export interface MentionItem {
  id: string
  type: "mention"
  username: string
  position: Position
  size: Size
  rotation: number
}

export interface LocationItem {
  id: string
  type: "location"
  name: string
  position: Position
  size: Size
  rotation: number
}

export type StoryItem = StickerItem | TextItem | MentionItem | LocationItem
