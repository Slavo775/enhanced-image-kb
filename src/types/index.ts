export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BackgroundSettings {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface ImageState {
  src: string | null;
  scale: number;
  rotation: number;
  position: Position;
  opacity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface StickerItem {
  id: string;
  type: "emoji" | "text" | "mention" | "location";
  content: string;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  selected: boolean;
  zIndex: number;
}

export interface EditorState {
  image: ImageState | null;
  stickers: StickerItem[];
  cropArea: CropArea | null;
  canvasSize: Size;
}

export interface EditorData {
  image: ImageState | null;
  stickers: StickerItem[];
  cropArea: CropArea | null;
  backgroundSettings: BackgroundSettings;
}

export interface ImageEditorProps {
  width?: number;
  height?: number;
  onStateChange?: (state: EditorState) => void;
  onExport?: (canvas: HTMLCanvasElement) => void;
}
