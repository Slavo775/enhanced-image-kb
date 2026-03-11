export declare function useCanvasCropMouse(setPosition: (x: number, y: number) => void, position: {
    x: number;
    y: number;
}): {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
};
