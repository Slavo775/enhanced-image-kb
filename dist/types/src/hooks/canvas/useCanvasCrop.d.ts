import { StickerInput } from "../../components/canvas/Canvas";
export type UseCanvasCropProps = {
    image: string;
    cropWidth: number;
    cropHeight: number;
    rotation: number;
    initialZoom: number;
    setOutputImage?: (dataUrl: string, metadata?: StickerInput[]) => void;
    stickers: StickerInput[];
    onStickersChange?: (updated: StickerInput[]) => void;
};
export declare function useCanvasCrop({ image, cropWidth, cropHeight, rotation, initialZoom, stickers, setOutputImage, onStickersChange, }: UseCanvasCropProps): {
    canvasRef: import("react").RefObject<HTMLCanvasElement | null>;
    clamp: (value: number, min: number, max: number) => number;
    setCurrentZoom: import("react").Dispatch<import("react").SetStateAction<number>>;
    currentZoom: number;
    setPosition: (pos: {
        x: number;
        y: number;
    }) => void;
    position: {
        x: number;
        y: number;
    };
};
