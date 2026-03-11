import { useEffect, useRef, useCallback } from "react";
import { ZOOM_STEP, ZOOM_MIN, ZOOM_MAX } from "../../constants";
import { useCanvasCrop } from "../../hooks/canvas/useCanvasCrop";
import { useCanvasCropMouse } from "../../hooks/canvas/useCanvasCropMouse";
import { useCanvasTouch } from "../../hooks/canvas/useCanvasTouch";
import { useCanvasRefStore } from "../../stores/canvasRef";
import { useKeyboardShortcuts } from "../../hooks/canvas/useKeyboardShortcuts";

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
  payload?: Record<string, unknown>;
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

  const currentZoomRef = useRef(currentZoom);
  currentZoomRef.current = currentZoom;
  const wheelRafRef = useRef<number | null>(null);
  const accumulatedDelta = useRef(0);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    accumulatedDelta.current += -e.deltaY * ZOOM_STEP;
    if (wheelRafRef.current !== null) return;
    wheelRafRef.current = requestAnimationFrame(() => {
      wheelRafRef.current = null;
      const next = currentZoomRef.current + accumulatedDelta.current;
      setCurrentZoom(Math.min(Math.max(next, ZOOM_MIN), ZOOM_MAX));
      accumulatedDelta.current = 0;
    });
  }, [setCurrentZoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      if (wheelRafRef.current !== null) cancelAnimationFrame(wheelRafRef.current);
    };
  }, [canvasRef, handleWheel]);

  useEffect(() => {
    useCanvasRefStore.getState().setCanvasRef(id, canvasRef);
  }, [id]);

  useKeyboardShortcuts(id);

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
