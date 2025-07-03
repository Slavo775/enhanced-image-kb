import { useEffect, useRef, useState } from "react";
import { StickerInput } from "../../components/canvas/Canvas";

export function useCanvasStickerInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  stickers: StickerInput[],
  onStickersChange?: (updated: StickerInput[]) => void,
  setIsDraggingSticker?: (isDragging: boolean) => void
) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const getStickerAtPosition = (x: number, y: number) => {
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) {
        return s;
      }
    }
    return undefined;
  };

  const handlePointerDown = (x: number, y: number) => {
    const sticker = getStickerAtPosition(x, y);
    if (sticker) {
      setDraggingId(sticker.id);
      offsetRef.current = { x: x - sticker.x, y: y - sticker.y };
      setIsDraggingSticker?.(true);
    }
  };

  const handlePointerMove = (x: number, y: number) => {
    if (!draggingId) return;
    const updated = stickers.map((s) =>
      s.id === draggingId
        ? {
            ...s,
            x: x - offsetRef.current.x,
            y: y - offsetRef.current.y,
          }
        : s
    );
    onStickersChange?.(updated);
  };

  const stopDragging = () => {
    setDraggingId(null);
    setIsDraggingSticker?.(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      handlePointerDown(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId) return;
      const rect = canvas.getBoundingClientRect();
      handlePointerMove(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      handlePointerDown(t.clientX - rect.left, t.clientY - rect.top);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !draggingId) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      handlePointerMove(t.clientX - rect.left, t.clientY - rect.top);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDragging);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);

      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [canvasRef, draggingId, stickers, onStickersChange, setIsDraggingSticker]);
}
