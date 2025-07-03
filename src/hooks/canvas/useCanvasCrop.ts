// useCanvasCrop.ts
import { useRef, useEffect, useState } from "react";
import { StickerInput } from "../../components/canvas/Canvas";
import { useCanvasStickerInteraction } from "../../hooks/canvas/useCanvasStickerInteraction";

export type UseCanvasCropProps = {
  image: string;
  cropWidth: number;
  cropHeight: number;
  rotation: number;
  initialZoom: number;
  setOutputImage?: (dataUrl: string, metadata?: StickerInput[]) => void;
  stickers: StickerInput[];
  onStickersChange?: (updated: StickerInput[]) => void;
};

export function useCanvasCrop({
  image,
  cropWidth,
  cropHeight,
  rotation,
  initialZoom,
  setOutputImage,
  stickers,
  onStickersChange,
}: UseCanvasCropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPositionState] = useState({ x: 0, y: 0 });
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [isDraggingSticker, setIsDraggingSticker] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState<
    string | undefined
  >(undefined);
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  const drawCanvas = () => {
    const canvas = canvasRef.current;
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

    // Draw stickers
    stickers.forEach((sticker) => {
      if (
        sticker.src.startsWith("data:image") ||
        sticker.src.startsWith("http")
      ) {
        const stickerImg = new Image();
        stickerImg.onload = () => {
          ctx.drawImage(
            stickerImg,
            sticker.x,
            sticker.y,
            sticker.width,
            sticker.height
          );

          // Draw selection border
          if (sticker.id === selectedStickerId) {
            ctx.strokeStyle = "#007bff";
            ctx.lineWidth = 2;
            ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);

            // Draw resize handles
            drawResizeHandle(ctx, sticker.x, sticker.y);
            drawResizeHandle(ctx, sticker.x + sticker.width, sticker.y);
            drawResizeHandle(ctx, sticker.x, sticker.y + sticker.height);
            drawResizeHandle(
              ctx,
              sticker.x + sticker.width,
              sticker.y + sticker.height
            );
          }
        };
        stickerImg.src = sticker.src;
      } else {
        // Render emoji or text as sticker
        ctx.font = `${sticker.height}px sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(sticker.src, sticker.x, sticker.y);

        // Draw selection border
        if (sticker.id === selectedStickerId) {
          ctx.strokeStyle = "#007bff";
          ctx.lineWidth = 2;
          ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);

          // Draw resize handles
          drawResizeHandle(ctx, sticker.x, sticker.y);
          drawResizeHandle(ctx, sticker.x + sticker.width, sticker.y);
          drawResizeHandle(ctx, sticker.x, sticker.y + sticker.height);
          drawResizeHandle(
            ctx,
            sticker.x + sticker.width,
            sticker.y + sticker.height
          );
        }
      }
    });

    if (setOutputImage) {
      const dataUrl = canvas.toDataURL();
      setOutputImage(dataUrl, stickers);
    }
  };

  useCanvasStickerInteraction(
    canvasRef,
    stickers,
    selectedStickerId,
    onStickersChange,
    setIsDraggingSticker,
    setSelectedStickerId
  );

  return {
    canvasRef,
    clamp,
    setCurrentZoom,
    currentZoom,
    setPosition,
    position,
  };
}
