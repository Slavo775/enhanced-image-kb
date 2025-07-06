import { create } from "zustand";
import { StickerInput } from "../components/canvas/Canvas";

export type FinalImageResult = {
  dataUrl: string;
  metaData: {
    stickers: StickerInput[];
  };
};

type FinalImageStore = {
  finalImageRef: { current: FinalImageResult | null };
  setFinalImage: (image: FinalImageResult) => void;
  getFinalImage: () => FinalImageResult | null;
};

export const useFinalImageStore = create<FinalImageStore>(() => {
  const ref = { current: null as FinalImageResult | null };

  return {
    finalImageRef: ref,
    setFinalImage: (image) => {
      ref.current = image;
    },
    getFinalImage: () => ref.current,
  };
});
