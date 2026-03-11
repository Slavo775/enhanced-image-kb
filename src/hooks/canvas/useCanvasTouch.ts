import { useRef } from "react";
import { TOUCH_ZOOM_STEP, ZOOM_MIN, ZOOM_MAX } from "../../constants";

export function useCanvasTouch(
  setPosition: (x: number, y: number) => void,
  position: { x: number; y: number },
  setZoom: (zoom: number) => void,
  zoom: number,
  clamp: (val: number, min: number, max: number) => number
) {
  const isDragging = useRef(false);
  const startDrag = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      isDragging.current = true;
      startDrag.current = {
        x: t.clientX - position.x,
        y: t.clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      lastTouchDistance.current = dist;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging.current) {
      const t = e.touches[0];
      setPosition(
        t.clientX - startDrag.current.x,
        t.clientY - startDrag.current.y
      );
    } else if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (lastTouchDistance.current != null) {
        const delta = dist - lastTouchDistance.current;
        const zoomChange = delta * TOUCH_ZOOM_STEP;
        setZoom(clamp(zoom + zoomChange, ZOOM_MIN, ZOOM_MAX));
      }
      lastTouchDistance.current = dist;
    }
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    lastTouchDistance.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
