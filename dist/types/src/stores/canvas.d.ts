export type CanvasProps = {
    image: string;
    cropWidth: number;
    cropHeight: number;
    rotation: number;
    zoom: number;
};
type CanvasStore = {
    canvases: Record<string, CanvasProps>;
    addCanvas: (canvas: CanvasProps, canvasId: string) => void;
    updateCanvas: (canvas: CanvasProps, canvasId: string) => void;
};
declare const useCanvasStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CanvasStore>>;
export default useCanvasStore;
