import { useEffect, useRef, useState } from "react";

export function useCanvasCrop({
  image,
  cropWidth,
  cropHeight,
  rotation,
  initialZoom = 100,
  setOutputImage,
}: {
  image: string;
  cropWidth: number;
  cropHeight: number;
  rotation: number;
  initialZoom?: number;
  setOutputImage?: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const shouldCover = img.width < cropWidth || img.height < cropHeight;
      const scale = shouldCover
        ? Math.max(cropWidth / img.width, cropHeight / img.height)
        : Math.min(cropWidth / img.width, cropHeight / img.height);

      setScaledSize({
        width: img.width * scale,
        height: img.height * scale,
      });

      setPosition({ x: 0, y: 0 });
      setImageObj(img);
    };
  }, [image, cropWidth, cropHeight]);

  const drawCanvas = () => {
    if (!canvasRef.current || !imageObj) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = cropWidth;
    canvasRef.current.height = cropHeight;
    ctx.clearRect(0, 0, cropWidth, cropHeight);

    const zoomFactor = currentZoom / 100;
    const drawWidth = scaledSize.width * zoomFactor;
    const drawHeight = scaledSize.height * zoomFactor;

    ctx.save();
    ctx.translate(cropWidth / 2 + position.x, cropHeight / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      imageObj,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  };

  const getBounds = () => {
    const zoomFactor = currentZoom / 100;
    const w = scaledSize.width * zoomFactor;
    const h = scaledSize.height * zoomFactor;
    return {
      minX: w < cropWidth ? -(cropWidth - w) / 2 : -(w - cropWidth) / 2,
      maxX: w < cropWidth ? +(cropWidth - w) / 2 : +(w - cropWidth) / 2,
      minY: h < cropHeight ? -(cropHeight - h) / 2 : -(h - cropHeight) / 2,
      maxY: h < cropHeight ? +(cropHeight - h) / 2 : +(h - cropHeight) / 2,
    };
  };

  const updateZoom = (newZoom: number) => {
    setCurrentZoom(clamp(newZoom, 10, 500));
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = setTimeout(() => {
      if (canvasRef.current && setOutputImage) {
        setOutputImage(canvasRef.current.toDataURL());
      }
    }, 200);
  };

  const updatePosition = (x: number, y: number) => {
    const { minX, maxX, minY, maxY } = getBounds();
    setPosition({
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY),
    });
  };

  useEffect(() => {
    if (imageObj) drawCanvas();
  }, [imageObj, scaledSize, position, currentZoom, rotation]);

  return {
    canvasRef,
    drawCanvas,
    getBounds,
    clamp,
    imageObj,
    scaledSize,
    position,
    setPosition: updatePosition,
    currentZoom,
    setCurrentZoom: updateZoom,
  };
}
