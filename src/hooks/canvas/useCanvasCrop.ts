// useCanvasCrop.ts
import { useRef, useEffect, useState } from "react";
import { StickerInput } from "../../components/canvas/Canvas";
import { useCanvasStickerInteraction } from "../stickers/useCanvasStickerInteraction";
import { useStickers } from "../stickers/useStickers";
import { useCanvas } from "./useCanvas";
import { useCanvasRefStore } from "../../stores/canvasRef";
import { useFinalImageStore } from "../../stores/finalImageStore";

export type UseCanvasCropProps = {
  canvasId: string;
};

export function useCanvasCrop({ canvasId }: UseCanvasCropProps) {
  const { canvasRefs } = useCanvasRefStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPositionState] = useState({ x: 0, y: 0 });
  const [isDraggingSticker, setIsDraggingSticker] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const { stickers, selectedSticker: selectedStickerId } =
    useStickers(canvasId);
  const {
    canvas: { image, cropHeight, cropWidth, rotation, zoom: currentZoom },
    setZoom: setCurrentZoom,
  } = useCanvas(canvasId);

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const setPosition = (pos: { x: number; y: number }) => {
    if (!imgRef.current || isDraggingSticker) return;
    const scale = currentZoom / 100;
    const scaledWidth = imgRef.current.width * scale;
    const scaledHeight = imgRef.current.height * scale;

    const maxX = Math.max(0, (scaledWidth - cropWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - cropHeight) / 2);

    const clampedX = clamp(pos.x, -maxX, maxX);
    const clampedY = clamp(pos.y, -maxY, maxY);

    setPositionState({ x: clampedX, y: clampedY });
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawCanvas();
    };
    img.src = image;
  }, [image, currentZoom, position, rotation, stickers, selectedStickerId]);

  const drawResizeHandle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    const size = 10;
    ctx.save();
    ctx.fillStyle = "#007bff";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x - size / 2, y - size / 2, size, size);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  const imgCache = useRef<Record<string, HTMLImageElement>>({});

  const createCanvas = () => {
    const canvas = canvasRef.current ?? canvasRefs[canvasId].current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imgRef.current) return;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.clearRect(0, 0, cropWidth, cropHeight);
    ctx.save();

    const scale = currentZoom / 100;
    ctx.translate(position.x + cropWidth / 2, position.y + cropHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(
      imgRef.current,
      -imgRef.current.width / 2,
      -imgRef.current.height / 2
    );
    ctx.restore();

    return ctx;
  };

  const drawImageSticker = (
    ctx: CanvasRenderingContext2D,
    sticker: StickerInput
  ) => {
    let stickerImg = imgCache.current[sticker.src];
    if (!stickerImg) {
      stickerImg = new Image();
      stickerImg.src = sticker.src;
      imgCache.current[sticker.src] = stickerImg;
      // Po načítaní obrázka prekresli canvas
      stickerImg.onload = () => drawCanvas();
      return; // preruš vykresľovanie teraz, vykreslí sa po načítaní
    }
    if (stickerImg.complete) {
      ctx.drawImage(
        stickerImg,
        sticker.x,
        sticker.y,
        sticker.width,
        sticker.height
      );
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D, sticker: StickerInput) => {
    ctx.font = `${sticker.height}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(sticker.src, sticker.x, sticker.y);
  };

  const drawResizableBorder = (
    ctx: CanvasRenderingContext2D,
    sticker: StickerInput
  ) => {
    ctx.strokeStyle = "#007bff";
    ctx.lineWidth = 2;
    ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);

    drawResizeHandle(ctx, sticker.x, sticker.y);
    drawResizeHandle(ctx, sticker.x + sticker.width, sticker.y);
    drawResizeHandle(ctx, sticker.x, sticker.y + sticker.height);
    drawResizeHandle(
      ctx,
      sticker.x + sticker.width,
      sticker.y + sticker.height
    );
  };

  const exportImage = (canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL();
    useFinalImageStore
      .getState()
      .setFinalImage({ dataUrl, metaData: { stickers: stickers ?? [] } });
    return { dataUrl, metaData: { stickers } };
  };

  const drawCanvas = () => {
    const canvas = canvasRef ?? canvasRefs[canvasId];
    const ctx = createCanvas();
    if (!ctx || !canvas.current) return;

    // Draw stickers
    stickers?.forEach((sticker) => {
      if (
        sticker.src.startsWith("data:image") ||
        sticker.src.startsWith("http")
      ) {
        drawImageSticker(ctx, sticker);
      } else {
        // Render emoji or text as sticker
        drawText(ctx, sticker);
      }

      // Draw selection border & resize handles
      if (sticker.id === selectedStickerId) {
        drawResizableBorder(ctx, sticker);
      }
    });

    return exportImage(canvas.current);
  };

  useCanvasStickerInteraction(
    canvasRef ?? canvasRefs[canvasId],
    canvasId,
    setIsDraggingSticker
  );

  return {
    canvasRef,
    clamp,
    setCurrentZoom,
    currentZoom,
    setPosition,
    position,
    drawCanvas,
  };
}
