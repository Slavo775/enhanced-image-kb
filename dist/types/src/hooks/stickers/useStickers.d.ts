import { StickerInput } from "../../components/canvas/Canvas";
export declare const useStickers: (canvasId: string) => {
    stickers: StickerInput[] | undefined;
    selectedSticker: string | undefined;
    addSticker: (input: string) => Promise<void>;
    removeSticker: (stickerId: string) => void;
    setSelectedSticker: (stickerId?: string) => void;
    updateSticker: (sticker: StickerInput) => void;
    updateAllStickers: (stickers: StickerInput[]) => void;
};
