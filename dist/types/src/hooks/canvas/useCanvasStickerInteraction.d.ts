import { StickerInput } from "../../components/canvas/Canvas";
export declare function useCanvasStickerInteraction(canvasRef: React.RefObject<HTMLCanvasElement | null>, stickers: StickerInput[], selectedStickerId?: string, onStickersChange?: (updated: StickerInput[]) => void, setIsDraggingSticker?: (isDragging: boolean) => void, setSelectedStickerId?: (id?: string) => void): void;
