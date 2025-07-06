import { create } from "zustand";

export type CanvasProps = {
  image: string;
  cropWidth: number;
  cropHeight: number;
  rotation: number;
  zoom: number;
};

type CanvasStore = {
  canvases: Record<string, CanvasProps>;
  addCanvas: (canvas: CanvasProps, canvasId: string) => void;
  updateCanvas: (canvas: CanvasProps, canvasId: string) => void;
};

const useCanvasStore = create<CanvasStore>((set) => ({
  canvases: {},

  addCanvas: (canvas, canvasId) =>
    set((state) => {
      if (state.canvases[canvasId]) return state; // neprepíš existujúci
      return {
        canvases: {
          ...state.canvases,
          [canvasId]: canvas,
        },
      };
    }),

  updateCanvas: (canvas, canvasId) =>
    set((state) => ({
      canvases: {
        ...state.canvases,
        [canvasId]: canvas,
      },
    })),
}));

export default useCanvasStore;
