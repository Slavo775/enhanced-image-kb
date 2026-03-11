import { create, useStore } from "zustand";
import { temporal } from "zundo";
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

export const useStickerStore = create<StickersStore>()(
  temporal(
    (set) => ({
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
    }),
    {
      // Track only stickers — selection changes don't pollute undo history
      partialize: (state) => ({ stickers: state.stickers }),
      limit: 50,
    }
  )
);

// Reactive temporal state hook — use in React components for canUndo/canRedo
type TemporalState = ReturnType<typeof useStickerStore.temporal.getState>;
export const useTemporalStickerStore = <T>(selector: (state: TemporalState) => T) =>
  useStore(useStickerStore.temporal, selector);
