import { useRef } from "react";

export function useCanvasCropMouse(
  setPosition: (x: number, y: number) => void,
  position: { x: number; y: number }
) {
  const isDragging = useRef(false);
  const startDrag = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startDrag.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition(
      e.clientX - startDrag.current.x,
      e.clientY - startDrag.current.y
    );
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
