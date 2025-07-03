import React, { useEffect } from "react";
import { useCanvasCrop } from "../../hooks/canvas/useCanvasCrop";
import { useCanvasCropMouse } from "../../hooks/canvas/useCanvasCropMouse";
import { useCanvasTouch } from "../../hooks/canvas/useCanvasTouch";

type Props = {
  image: string;
  cropWidth: number;
  cropHeight: number;
  zoom: number;
  rotation: number;
  setOutputImage?: (dataUrl: string) => void;
};

export default function ImageCanvas({
  image,
  cropWidth,
  cropHeight,
  zoom,
  rotation,
  setOutputImage,
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
  });

  const { onMouseDown, onMouseMove, onMouseUp } = useCanvasCropMouse(
    setPosition,
    position
  );
  const { onTouchStart, onTouchMove, onTouchEnd } = useCanvasTouch(
    setPosition,
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
