import { StickerInput } from "../components/canvas/Canvas";
type StickersStore = {
    stickers?: Record<string, {
        stickers: StickerInput[];
    }>;
    selectedSticker?: Record<string, string | undefined>;
    setSelectedSticker: (canvasId: string, id?: string) => void;
    addSticker: (sticker: StickerInput, canvasId: string) => void;
    updateSticker: (sticker: StickerInput, canvasId: string) => void;
    updateAll: (sticker: StickerInput[], canvasId: string) => void;
    removeSticker: (stickerId: string, canvasId: string) => void;
};
export declare const useStickerStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StickersStore>>;
export {};
