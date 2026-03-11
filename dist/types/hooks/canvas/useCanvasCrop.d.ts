import { StickerInput } from "../../components/canvas/Canvas";
export type UseCanvasCropProps = {
    canvasId: string;
};
export declare function useCanvasCrop({ canvasId }: UseCanvasCropProps): {
    canvasRef: import("react").RefObject<HTMLCanvasElement | null>;
    clamp: (value: number, min: number, max: number) => number;
    setCurrentZoom: (currentZoom: number) => void;
    currentZoom: number;
    setPosition: (pos: {
        x: number;
        y: number;
    }) => void;
    position: {
        x: number;
        y: number;
    };
    drawCanvas: () => {
        dataUrl: string;
        metaData: {
            stickers: StickerInput[] | undefined;
        };
    } | undefined;
};
