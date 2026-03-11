export declare function useCanvasTouch(setPosition: (x: number, y: number) => void, position: {
    x: number;
    y: number;
}, setZoom: (zoom: number) => void, zoom: number, clamp: (val: number, min: number, max: number) => number): {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
};
