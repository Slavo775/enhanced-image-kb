import { useMemo, useRef } from "react";
import { useStickerStore, useTemporalStickerStore } from "../../stores/stickers";
import { StickerInput } from "../../components/canvas/Canvas";

// Module-level clipboard — persists within the tab session
let stickerClipboard: StickerInput | null = null;

export const useStickers = (canvasId: string) => {
  const {
    stickers,
    selectedSticker,
    addSticker,
    removeSticker,
    setSelectedSticker,
    updateSticker,
    updateAll,
  } = useStickerStore();

  const canUndo = useTemporalStickerStore((s) => s.pastStates.length > 0);
  const canRedo = useTemporalStickerStore((s) => s.futureStates.length > 0);
  const undo = () => useStickerStore.temporal.getState().undo();
  const redo = () => useStickerStore.temporal.getState().redo();
  const pauseHistory = () => useStickerStore.temporal.getState().pause();
  const resumeHistory = () => useStickerStore.temporal.getState().resume();

  // Ref so keyboard shortcuts can access the latest selected sticker id without stale closure
  const selectedStickerRef = useRef<string | undefined>(undefined);

  const currentStickers = useMemo(() => {
    return stickers?.[canvasId]?.stickers;
  }, [stickers]);

  const currentSelectedStickers = useMemo(
    () => selectedSticker?.[canvasId],
    [selectedSticker]
  );
  selectedStickerRef.current = currentSelectedStickers;

  function encodeSvgToDataUrl(svg: string): string {
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${base64}`;
  }

  const addStickerLocal = async (input: string) => {
    let src: string = "";
    let width = 100;
    let height = 100;

    if (typeof input === "string") {
      // ✅ Predpokladáme data URL (napr. PNG)
      src = input;

      if (src.startsWith("data:image/svg+xml")) {
        try {
          const svgText = atob(src.split(",")[1]);
          const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
          const svg = doc.querySelector("svg");
          const w = svg?.getAttribute("width");
          const h = svg?.getAttribute("height");
          const viewBox = svg?.getAttribute("viewBox");
          if (w && h) {
            width = parseFloat(w);
            height = parseFloat(h);
          } else if (viewBox) {
            const [, , vw, vh] = viewBox.split(" ").map(Number);
            width = vw;
            height = vh;
          }
        } catch (err) {
          console.error("[useStickers] Failed to parse base64 SVG:", err);
        }
      } else if (input.includes("<svg")) {
        // SVG string → encode to data URL
        try {
          src = encodeSvgToDataUrl(input);
          const doc = new DOMParser().parseFromString(input, "image/svg+xml");
          const svg = doc.querySelector("svg");
          const w = svg?.getAttribute("width");
          const h = svg?.getAttribute("height");
          const viewBox = svg?.getAttribute("viewBox");
          if (w && h) {
            width = parseFloat(w);
            height = parseFloat(h);
          } else if (viewBox) {
            const [, , vw, vh] = viewBox.split(" ").map(Number);
            width = vw;
            height = vh;
          }
        } catch (err) {
          console.error("[useStickers] Failed to parse SVG string:", err);
        }
      } else {
        const size = await getImageSizeFromDataUrl(src);
        width = size.width;
        height = size.height;
      }
    }

    const newSticker: StickerInput = {
      id: new Date().toISOString(),
      type: "sticker",
      src,
      x: Math.random() * 200,
      y: Math.random() * 200,
      width,
      height,
    };

    addSticker(newSticker, canvasId);
  };

  const addMentionSticker = (username: string) => {
    if (!username.trim()) return;
    const text = `@${username.trim()}`;
    const fontSize = 20;
    const height = fontSize + 18;
    const width = text.length * fontSize * 0.58 + 28;
    addSticker(
      {
        id: new Date().toISOString(),
        type: "mention",
        src: username.trim(),
        x: Math.random() * 200,
        y: Math.random() * 200,
        width,
        height,
      },
      canvasId
    );
  };

  const addLocationSticker = (locationName: string) => {
    if (!locationName.trim()) return;
    const fontSize = 18;
    const height = fontSize + 18;
    const dotR = height * 0.18;
    const radius = height / 2;
    const width =
      locationName.trim().length * fontSize * 0.55 + radius * 2 + dotR * 4 + 8;
    addSticker(
      {
        id: new Date().toISOString(),
        type: "location",
        src: locationName.trim(),
        x: Math.random() * 200,
        y: Math.random() * 200,
        width,
        height,
      },
      canvasId
    );
  };

  const copySelectedSticker = () => {
    const id = selectedStickerRef.current;
    if (!id) return;
    const sticker = currentStickers?.find((s) => s.id === id);
    if (sticker) stickerClipboard = sticker;
  };

  const pasteSticker = () => {
    if (!stickerClipboard) return;
    addSticker(
      {
        ...stickerClipboard,
        id: new Date().toISOString(),
        x: stickerClipboard.x + 15,
        y: stickerClipboard.y + 15,
      },
      canvasId
    );
  };

  const duplicateSelectedSticker = () => {
    const id = selectedStickerRef.current;
    if (!id) return;
    const sticker = currentStickers?.find((s) => s.id === id);
    if (!sticker) return;
    addSticker(
      { ...sticker, id: new Date().toISOString(), x: sticker.x + 15, y: sticker.y + 15 },
      canvasId
    );
  };

  return {
    stickers: currentStickers,
    selectedSticker: currentSelectedStickers,
    selectedStickerRef,
    addSticker: addStickerLocal,
    addMentionSticker,
    addLocationSticker,
    removeSticker: (stickerId: string) => removeSticker(stickerId, canvasId),
    setSelectedSticker: (stickerId?: string) =>
      setSelectedSticker(canvasId, stickerId),
    updateSticker: (sticker: StickerInput) => updateSticker(sticker, canvasId),
    updateAllStickers: (stickers: StickerInput[]) =>
      updateAll(stickers, canvasId),
    undo,
    redo,
    canUndo,
    canRedo,
    pauseHistory,
    resumeHistory,
    copySelectedSticker,
    pasteSticker,
    duplicateSelectedSticker,
  };
};

function getImageSizeFromDataUrl(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}
