import { CanvasProps } from "../../stores/canvas";
export declare const useCanvas: (canvasId: string) => {
    canvas: CanvasProps;
    setZoom: (currentZoom: number) => void;
    setRotation: (rotation: number) => void;
    setBrightness: (brightness: number) => void;
    setContrast: (contrast: number) => void;
    initCanvas: (data: CanvasProps) => void;
};
