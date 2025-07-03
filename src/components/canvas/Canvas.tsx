import React, { useEffect } from "react";
import { useCanvasCrop } from "../../hooks/canvas/useCanvasCrop";
import { useCanvasCropMouse } from "../../hooks/canvas/useCanvasCropMouse";
import { useCanvasTouch } from "../../hooks/canvas/useCanvasTouch";
import { useCanvasStickerInteraction } from "../../hooks/canvas/useCanvasStickerInteraction";

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

type Props = {
  image: string;
  cropWidth: number;
  cropHeight: number;
  zoom: number;
  rotation: number;
  setOutputImage?: (dataUrl: string, metadata?: StickerInput[]) => void;
  stickers: StickerInput[];
  onStickersChange?: (updated: StickerInput[]) => void;
};

export default function ImageCanvas({
  image,
  cropWidth,
  cropHeight,
  zoom,
  rotation,
  setOutputImage,
  stickers,
  onStickersChange,
}: Props) {
  const {
    canvasRef,
    clamp,
    setCurrentZoom,
    currentZoom,
    setPosition,
    position,
  } = useCanvasCrop({
    image,
    cropWidth,
    cropHeight,
    rotation,
    initialZoom: zoom,
    setOutputImage,
    stickers,
    onStickersChange,
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
