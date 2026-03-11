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
export declare const useStickerStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<StickersStore>, "temporal"> & {
    temporal: import("zustand").StoreApi<import("zundo").TemporalState<{
        stickers: Record<string, {
            stickers: StickerInput[];
        }> | undefined;
    }>>;
}>;
type TemporalState = ReturnType<typeof useStickerStore.temporal.getState>;
export declare const useTemporalStickerStore: <T>(selector: (state: TemporalState) => T) => T;
export {};
