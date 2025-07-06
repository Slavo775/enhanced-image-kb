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
    id: string;
};
export declare function ImageCanvas({ id }: Props): import("react/jsx-runtime").JSX.Element;
