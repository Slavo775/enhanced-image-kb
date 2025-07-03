import React, { useEffect, useRef, useState } from "react";

interface ImageCanvasProps {
  image: string;
  cropWidth: number;
  cropHeight: number;
  zoom: number;
  rotation: number;
  setOutputImage?: (dataUrl: string) => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({
  image,
  cropWidth,
  cropHeight,
  zoom,
  rotation,
  setOutputImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );
  const [currentZoom, setCurrentZoom] = useState(zoom);
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

  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  const drawCanvas = () => {
    if (!canvasRef.current || !imageObj) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
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

  useEffect(() => {
    if (imageObj) drawCanvas();
  }, [imageObj, scaledSize, position, currentZoom, rotation]);

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

  const handleDragMove = (clientX: number, clientY: number) => {
    const dx = clientX - startDrag.x;
    const dy = clientY - startDrag.y;

    const { minX, maxX, minY, maxY } = getBounds();

    setPosition({
      x: clamp(dx, minX, maxX),
      y: clamp(dy, minY, maxY),
    });
  };

  const triggerZoomOutput = () => {
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = setTimeout(() => {
      if (canvasRef.current && setOutputImage) {
        setOutputImage(canvasRef.current.toDataURL());
      }
    }, 200);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      setOutputImage?.(canvasRef.current!.toDataURL());
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      setDragging(true);
      setStartDrag({ x: t.clientX - position.x, y: t.clientY - position.y });
    } else if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      setLastTouchDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      const t = e.touches[0];
      handleDragMove(t.clientX, t.clientY);
    } else if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      if (lastTouchDistance) {
        const delta = dist - lastTouchDistance;
        const zoomChange = delta * 0.3;
        setCurrentZoom((prev) => {
          const next = clamp(prev + zoomChange, 10, 500);
          triggerZoomOutput();
          return next;
        });
      }
      setLastTouchDistance(dist);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setDragging(false);
      setOutputImage?.(canvasRef.current!.toDataURL());
    }
    if (e.touches.length < 2) setLastTouchDistance(null);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelDom = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomChange = delta * 0.1;

      setCurrentZoom((prev) => {
        const next = clamp(prev + zoomChange, 10, 500);
        triggerZoomOutput();
        return next;
      });
    };

    container.addEventListener("wheel", handleWheelDom, { passive: false });
    return () => container.removeEventListener("wheel", handleWheelDom);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: cropWidth,
        height: cropHeight,
        overflow: "hidden",
        border: "2px solid #ccc",
        touchAction: "none",
        userSelect: "none",
        position: "relative",
        cursor: dragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ImageCanvas;
