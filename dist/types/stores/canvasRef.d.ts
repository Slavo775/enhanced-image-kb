type CanvasRefStore = {
    canvasRefs: Record<string, React.RefObject<HTMLCanvasElement | null>>;
    setCanvasRef: (canvasId: string, ref: React.RefObject<HTMLCanvasElement | null>) => void;
};
export declare const useCanvasRefStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CanvasRefStore>>;
export {};
