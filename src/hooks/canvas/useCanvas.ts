import { useMemo } from "react";
import useCanvasStore, { CanvasProps } from "../../stores/canvas";

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

  const setBrightness = (brightness: number) => {
    if (!canvas) return;
    updateCanvas({ ...canvas, brightness }, canvasId);
  };

  const setContrast = (contrast: number) => {
    if (!canvas) return;
    updateCanvas({ ...canvas, contrast }, canvasId);
  };

  return { canvas: canvas, setZoom, setRotation, setBrightness, setContrast, initCanvas };
};
