import { useEffect } from "react";
import { useStickers } from "../stickers/useStickers";

export function useKeyboardShortcuts(canvasId: string) {
  const {
    selectedStickerRef,
    removeSticker,
    setSelectedSticker,
    undo,
    redo,
    copySelectedSticker,
    pasteSticker,
    duplicateSelectedSticker,
  } = useStickers(canvasId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      const tag = (e.target as HTMLElement).tagName;

      // Skip if user is typing in an input/textarea
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (isMeta && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      if ((isMeta && e.key === "z" && e.shiftKey) || (isMeta && e.key === "y")) {
        e.preventDefault();
        redo();
        return;
      }

      if (isMeta && e.key === "c") {
        copySelectedSticker();
        return;
      }

      if (isMeta && e.key === "v") {
        pasteSticker();
        return;
      }

      if (isMeta && e.key === "d") {
        e.preventDefault();
        duplicateSelectedSticker();
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const id = selectedStickerRef.current;
        if (id) {
          e.preventDefault();
          removeSticker(id);
        }
        return;
      }

      if (e.key === "Escape") {
        setSelectedSticker(undefined);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    removeSticker,
    setSelectedSticker,
    copySelectedSticker,
    pasteSticker,
    duplicateSelectedSticker,
    selectedStickerRef,
  ]);
}
