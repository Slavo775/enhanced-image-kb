import { useEffect } from "react";
import { useCanvasCrop } from "../../hooks/canvas/useCanvasCrop";
import { useCanvasCropMouse } from "../../hooks/canvas/useCanvasCropMouse";
import { useCanvasTouch } from "../../hooks/canvas/useCanvasTouch";
import { useCanvasRefStore } from "../../stores/canvasRef";

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

export function ImageCanvas({ id }: Props) {
  const {
    canvasRef,
    clamp,
    setCurrentZoom,
    currentZoom,
    setPosition,
    position,
  } = useCanvasCrop({
    canvasId: id,
  });

  const { onMouseDown, onMouseMove, onMouseUp } = useCanvasCropMouse(
    (x: number, y: number) => setPosition({ x, y }),
    position
  );

  const { onTouchStart, onTouchMove, onTouchEnd } = useCanvasTouch(
    (x: number, y: number) => setPosition({ x, y }),
    position,
    setCurrentZoom,
    currentZoom,
    clamp
  );

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomChange = delta * 0.1;
    setCurrentZoom(currentZoom + zoomChange);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [canvasRef, currentZoom]);

  useEffect(() => {
    useCanvasRefStore.getState().setCanvasRef(id, canvasRef);
  }, [id]);

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: "none", cursor: "grab" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}
