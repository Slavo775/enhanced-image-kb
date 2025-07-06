import { useMemo } from "react";
import useCanvasStore, { CanvasProps } from "../../stores/canvas";

// type CanvasProps = {
//   image: string;
//   cropWidth: number;
//   cropHeight: number;
//   rotation: number;
//   zoom: number;
// };

export const useCanvas = (canvasId: string) => {
  const { canvases, updateCanvas, addCanvas } = useCanvasStore();
  const canvas = useMemo(() => canvases[canvasId], [canvases]);

  const initCanvas = (data: CanvasProps) => {
    addCanvas(data, canvasId);
  };

  const setZoom = (currentZoom: number) => {
    if (!canvas) return;
    updateCanvas({ ...canvas, zoom: currentZoom }, canvasId);
  };

  const setRotation = (rotation: number) => {
    if (!canvas) return;
    updateCanvas({ ...canvas, rotation }, canvasId);
  };

  return { canvas: canvas, setZoom, setRotation, initCanvas };
};
