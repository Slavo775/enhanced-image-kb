import { StickerInput } from "../components/canvas/Canvas";
export type FinalImageResult = {
    dataUrl: string;
    metaData: {
        stickers: StickerInput[];
    };
};
type FinalImageStore = {
    finalImageRef: {
        current: FinalImageResult | null;
    };
    setFinalImage: (image: FinalImageResult) => void;
    getFinalImage: () => FinalImageResult | null;
};
export declare const useFinalImageStore: import("zustand").UseBoundStore<import("zustand").StoreApi<FinalImageStore>>;
export {};
