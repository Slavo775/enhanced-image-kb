import { create } from "zustand";
import { StickerInput } from "../components/canvas/Canvas";

type StickersStore = {
  stickers?: Record<string, { stickers: StickerInput[] }>;
  selectedSticker?: Record<string, string | undefined>;
  setSelectedSticker: (canvasId: string, id?: string) => void;
  addSticker: (sticker: StickerInput, canvasId: string) => void;
  updateSticker: (sticker: StickerInput, canvasId: string) => void;
  updateAll: (sticker: StickerInput[], canvasId: string) => void;
  removeSticker: (stickerId: string, canvasId: string) => void;
};

export const useStickerStore = create<StickersStore>((set) => ({
  stickers: undefined,
  selectedSticker: undefined,

  addSticker: (sticker, canvasId) =>
    set((state) => {
      const currentStickers = state.stickers?.[canvasId]?.stickers || [];
      return {
        stickers: {
          ...state.stickers,
          [canvasId]: {
            stickers: [...currentStickers, sticker],
          },
        },
      };
    }),

  updateSticker: (updatedSticker, canvasId) =>
    set((state) => {
      const currentStickers = state.stickers?.[canvasId]?.stickers || [];
      const newStickers = currentStickers.map((sticker) =>
        sticker.id === updatedSticker.id ? updatedSticker : sticker
      );
      return {
        stickers: {
          ...state.stickers,
          [canvasId]: {
            stickers: newStickers,
          },
        },
      };
    }),

  updateAll: (updatedStickers, canvasId) =>
    set((state) => ({
      stickers: {
        ...state.stickers,
        [canvasId]: {
          stickers: updatedStickers,
        },
      },
    })),

  removeSticker: (stickerId, canvasId) =>
    set((state) => {
      const currentStickers = state.stickers?.[canvasId]?.stickers || [];
      const filteredStickers = currentStickers.filter(
        (sticker) => sticker.id !== stickerId
      );

      // Ak odstraňujeme práve vybraný sticker, zruš aj výber
      const newSelected = { ...state.selectedSticker };
      if (newSelected?.[canvasId] === stickerId) {
        newSelected[canvasId] = undefined;
      }

      return {
        stickers: {
          ...state.stickers,
          [canvasId]: {
            stickers: filteredStickers,
          },
        },
        selectedSticker: newSelected,
      };
    }),

  setSelectedSticker: (canvasId, stickerId) =>
    set((state) => ({
      selectedSticker: {
        ...state.selectedSticker,
        [canvasId]: stickerId,
      },
    })),
}));
