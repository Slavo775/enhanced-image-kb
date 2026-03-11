import { create } from "zustand";

type CanvasRefStore = {
  canvasRefs: Record<string, React.RefObject<HTMLCanvasElement | null>>;
  setCanvasRef: (
    canvasId: string,
    ref: React.RefObject<HTMLCanvasElement | null>
  ) => void;
};

export const useCanvasRefStore = create<CanvasRefStore>((set) => ({
  canvasRefs: {},
  setCanvasRef: (canvasId, ref) =>
    set((state) => ({
      canvasRefs: { ...state.canvasRefs, [canvasId]: ref },
    })),
}));
