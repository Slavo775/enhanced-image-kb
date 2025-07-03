import { useRef, useEffect, useState } from "react";
import { StickerInput } from "../../components/canvas/Canvas";

type ResizeCorner = "tl" | "tr" | "bl" | "br";

export function useCanvasStickerInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  stickers: StickerInput[],
  selectedStickerId?: string,
  onStickersChange?: (updated: StickerInput[]) => void,
  setIsDraggingSticker?: (isDragging: boolean) => void,
  setSelectedStickerId?: (id?: string) => void
) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeCorner, setResizeCorner] = useState<ResizeCorner | null>(null);

  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const getStickerAtPosition = (
    x: number,
    y: number
  ): StickerInput | undefined => {
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) {
        return s;
      }
    }
    return undefined;
  };

  const getResizeCornerAtPosition = (
    sticker: StickerInput,
    x: number,
    y: number,
    handleSize = 10
  ): ResizeCorner | null => {
    const corners = {
      tl: { x: sticker.x, y: sticker.y },
      tr: { x: sticker.x + sticker.width, y: sticker.y },
      bl: { x: sticker.x, y: sticker.y + sticker.height },
      br: { x: sticker.x + sticker.width, y: sticker.y + sticker.height },
    };

    for (const corner in corners) {
      if (!corner) continue;
      const cx = corners[corner as ResizeCorner].x;
      const cy = corners[corner as ResizeCorner].y;
      if (Math.abs(x - cx) <= handleSize && Math.abs(y - cy) <= handleSize) {
        return corner as ResizeCorner;
      }
    }
    return null;
  };

  const handlePointerDown = (x: number, y: number) => {
    // Najskôr check resize handles (iba pre vybrané sticker)
    if (setSelectedStickerId) {
      const selected = stickers.find((s) => s.id === selectedStickerId);
      if (selected) {
        const corner = getResizeCornerAtPosition(selected, x, y);
        if (corner) {
          setResizingId(selected.id);
          setResizeCorner(corner);
          startPosRef.current = { x, y };
          startSizeRef.current = {
            width: selected.width,
            height: selected.height,
          };
          setIsDraggingSticker?.(true);
          return;
        }
      }
    }

    // Inak klasický drag select
    const sticker = getStickerAtPosition(x, y);
    if (sticker) {
      setDraggingId(sticker.id);
      offsetRef.current = { x: x - sticker.x, y: y - sticker.y };
      setIsDraggingSticker?.(true);
      setSelectedStickerId?.(sticker.id);
    } else {
      setSelectedStickerId?.(undefined);
    }
  };

  const handlePointerMove = (x: number, y: number) => {
    if (resizingId && resizeCorner) {
      // Resize logika
      const dx = x - startPosRef.current.x;
      const dy = y - startPosRef.current.y;

      const updated = stickers.map((s) => {
        if (s.id !== resizingId) return s;
        let newWidth = startSizeRef.current.width;
        let newHeight = startSizeRef.current.height;
        let newX = s.x;
        let newY = s.y;

        switch (resizeCorner) {
          case "tl": {
            const newW = startSizeRef.current.width - dx;
            const newH = startSizeRef.current.height - dy;

            newWidth = Math.max(newW, 10);
            newHeight = Math.max(newH, 10);

            break;
          }
          case "tr": {
            const newW = startSizeRef.current.width + dx;
            const newH = startSizeRef.current.height - dy;

            newWidth = Math.max(newW, 10);
            newHeight = Math.max(newH, 10);

            break;
          }
          case "bl": {
            const newW = startSizeRef.current.width - dx;
            const newH = startSizeRef.current.height + dy;

            newWidth = Math.max(newW, 10);
            newHeight = Math.max(newH, 10);

            break;
          }
          case "br": {
            const newW = startSizeRef.current.width + dx;
            const newH = startSizeRef.current.height + dy;

            newWidth = Math.max(newW, 10);
            newHeight = Math.max(newH, 10);
            break;
          }
        }

        // Prevent negative sizes
        newWidth = Math.max(10, newWidth);
        newHeight = Math.max(10, newHeight);

        return {
          ...s,
          width: newWidth,
          height: newHeight,
        };
      });
      onStickersChange?.(updated);
      return;
    }

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

  const stopInteraction = () => {
    setDraggingId(null);
    setResizingId(null);
    setResizeCorner(null);
    setIsDraggingSticker?.(false);
  };

  // Zmena kurzora podľa pozície myši (hover nad rohmi)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMoveCursor = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (setSelectedStickerId) {
        const selected = stickers.find((s) => s.id === selectedStickerId);
        if (selected) {
          const corner = getResizeCornerAtPosition(selected, x, y);
          if (corner) {
            // kurzory pre jednotlivé rohy
            const cursors: Record<ResizeCorner, string> = {
              tl: "nwse-resize",
              br: "nwse-resize",
              tr: "nesw-resize",
              bl: "nesw-resize",
            };
            canvas.style.cursor = cursors[corner];
            return;
          }
        }
      }
      // Default cursor
      canvas.style.cursor = draggingId || resizingId ? "grabbing" : "default";
    };

    canvas.addEventListener("mousemove", handleMouseMoveCursor);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMoveCursor);
      canvas.style.cursor = "default";
    };
  }, [canvasRef, stickers, setSelectedStickerId, draggingId, resizingId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      handlePointerDown(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId && !resizingId) return;
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
      if (e.touches.length !== 1 || (!draggingId && !resizingId)) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      handlePointerMove(t.clientX - rect.left, t.clientY - rect.top);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopInteraction);

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopInteraction);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopInteraction);

      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopInteraction);
    };
  }, [
    canvasRef,
    draggingId,
    resizingId,
    resizeCorner,
    stickers,
    onStickersChange,
    setIsDraggingSticker,
    setSelectedStickerId,
  ]);
}
