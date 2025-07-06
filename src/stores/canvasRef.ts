import { create } from "zustand";

type CanvasRefStore = {
  canvasRefs: Record<string, React.RefObject<HTMLCanvasElement | null>>;
  setCanvasRef: (
    canvasId: string,
    ref: React.RefObject<HTMLCanvasElement | null>
  ) => void;
};

export const useCanvasRefStore = create<CanvasRefStore>(() => ({
  canvasRefs: {},
  setCanvasRef: (canvasId, ref) => {
    // priamo mutuj referenciu (je to bezpečné, keďže je to ako `ref`)
    useCanvasRefStore.getState().canvasRefs[canvasId] = ref;
  },
}));
