// useCanvasCrop.ts
import { useRef, useEffect, useState, useCallback } from "react";
import { RESIZE_HANDLE_SIZE } from "../../constants";
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
  const rafRef = useRef<number | null>(null);
  const drawCanvasFnRef = useRef<(() => void) | null>(null);

  const { stickers, selectedSticker: selectedStickerId } =
    useStickers(canvasId);
  const {
    canvas: { image, cropHeight, cropWidth, rotation, zoom: currentZoom, brightness, contrast },
    setZoom: setCurrentZoom,
  } = useCanvas(canvasId);

  const scheduleDraw = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      drawCanvasFnRef.current?.();
    });
  }, []);

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

  // Load image only when src changes — never recreate Image for zoom/position/sticker updates
  useEffect(() => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      scheduleDraw();
    };
    img.onerror = () => {
      console.error("[useCanvasCrop] Failed to load image:", image.slice(0, 80));
    };
    img.src = image;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [image]);

  // Batch all visual redraws through rAF — multiple rapid changes = 1 draw per frame
  useEffect(() => {
    scheduleDraw();
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [currentZoom, position, rotation, stickers, selectedStickerId, brightness, contrast]);

  const drawResizeHandle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    const size = RESIZE_HANDLE_SIZE;
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
    ctx.filter = `brightness(${(brightness ?? 100) / 100}) contrast(${(contrast ?? 100) / 100})`;
    ctx.drawImage(
      imgRef.current,
      -imgRef.current.width / 2,
      -imgRef.current.height / 2
    );
    ctx.filter = "none";
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
      stickerImg.onload = () => scheduleDraw();
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

  const roundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawMention = (ctx: CanvasRenderingContext2D, sticker: StickerInput) => {
    const text = `@${sticker.src}`;
    const fontSize = Math.round(sticker.height * 0.52);
    const radius = sticker.height / 2;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    roundedRect(ctx, sticker.x, sticker.y, sticker.width, sticker.height, radius);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
    ctx.restore();
  };

  const drawLocation = (ctx: CanvasRenderingContext2D, sticker: StickerInput) => {
    const fontSize = Math.round(sticker.height * 0.48);
    const radius = sticker.height / 2;
    const dotR = sticker.height * 0.18;
    const dotX = sticker.x + radius;
    const dotY = sticker.y + sticker.height / 2;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    roundedRect(ctx, sticker.x, sticker.y, sticker.width, sticker.height, radius);
    ctx.fill();
    ctx.fillStyle = "#ff4444";
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(sticker.src, dotX + dotR * 2, dotY);
    ctx.restore();
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
      switch (sticker.type) {
        case "mention":
          drawMention(ctx, sticker);
          break;
        case "location":
          drawLocation(ctx, sticker);
          break;
        case "emoji":
          drawText(ctx, sticker);
          break;
        default: // "sticker"
          drawImageSticker(ctx, sticker);
      }

      // Draw selection border & resize handles
      if (sticker.id === selectedStickerId) {
        drawResizableBorder(ctx, sticker);
      }
    });

    return exportImage(canvas.current);
  };

  // Keep ref pointing to latest drawCanvas so scheduleDraw never has stale closures
  drawCanvasFnRef.current = drawCanvas;

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
