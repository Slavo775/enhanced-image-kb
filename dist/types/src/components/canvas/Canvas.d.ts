export type StickerType = "sticker" | "mention" | "location" | "emoji";
export type StickerInput = {
    id: string;
    type: StickerType;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    action?: () => void;
    payload?: Record<string, any>;
};
export type Props = {
    image: string;
    cropWidth: number;
    cropHeight: number;
    zoom: number;
    rotation: number;
    setOutputImage?: (dataUrl: string, metadata?: StickerInput[]) => void;
    stickers: StickerInput[];
    onStickersChange?: (updated: StickerInput[]) => void;
};
export declare function ImageCanvas({ image, cropWidth, cropHeight, zoom, rotation, setOutputImage, stickers, onStickersChange, }: Props): import("react/jsx-runtime").JSX.Element;
