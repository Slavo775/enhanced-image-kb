"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "./ImageUpload";
import { CanvasEditor } from "./CanvasEditor";
import { ControlPanel } from "./ControlPanel";
import { ImagePreview } from "./ImagePreview";
import type {
  EditorData,
  ImageData,
  CropPreset,
  StickerItem,
  MentionItem,
  LocationItem,
  ImageEditorProps,
} from "../types";

export function ImageEditor({
  width = 800,
  height = 600,
  onStateChange,
  onExport,
}: ImageEditorProps) {
  const [state, setState] = useState<EditorData>({
    image: null,
    cropArea: null,
    stickers: [],
  });
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  const updateState = useCallback(
    (updates: Partial<EditorData>) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  const handleImageSelect = (imageData: ImageData) => {
    updateState({ image: imageData });
  };

  const handleCropPresetChange = (preset: CropPreset) => {
    updateState({ cropPreset: preset });
  };

  const handleImageUpdate = (imageData: ImageData) => {
    updateState({ image: imageData });
  };

  const handleAddSticker = (sticker: StickerItem) => {
    updateState({ stickers: [...state.stickers, sticker] });
  };

  const handleAddMention = (mention: MentionItem) => {
    updateState({ mentions: [...state.mentions, mention] });
  };

  const handleAddLocation = (location: LocationItem) => {
    updateState({ locations: [...state.locations, location] });
  };

  const handlePreviewUpdate = (canvas: HTMLCanvasElement) => {
    setPreviewCanvas(canvas);
  };

  const handleExport = () => {
    if (previewCanvas) {
      // Create final export canvas
      const exportCanvas = document.createElement("canvas");
      const exportCtx = exportCanvas.getContext("2d");

      if (state.cropPreset && exportCtx) {
        exportCanvas.width = state.cropPreset.width;
        exportCanvas.height = state.cropPreset.height;

        const cropX = (width - state.cropPreset.width) / 2;
        const cropY = (height - state.cropPreset.height) / 2;

        exportCtx.drawImage(
          previewCanvas,
          cropX,
          cropY,
          state.cropPreset.width,
          state.cropPreset.height,
          0,
          0,
          state.cropPreset.width,
          state.cropPreset.height
        );
      } else {
        exportCanvas.width = width;
        exportCanvas.height = height;
        exportCtx?.drawImage(previewCanvas, 0, 0);
      }

      onExport?.(exportCanvas);

      // Download image
      const link = document.createElement("a");
      link.download = `edited-image-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL();
      link.click();
    }
  };

  if (!state.image) {
    return (
      <div className="max-w-md mx-auto">
        <ImageUpload onImageSelect={handleImageSelect} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Canvas */}
      <div className="lg:col-span-2 space-y-4">
        <CanvasEditor
          width={width}
          height={height}
          imageData={state.image}
          cropPreset={state.cropPreset}
          stickers={state.stickers}
          mentions={state.mentions}
          locations={state.locations}
          selectedItem={state.selectedItem}
          onStateChange={updateState}
          onPreviewUpdate={handlePreviewUpdate}
        />

        {/* Preview */}
        <ImagePreview sourceCanvas={previewCanvas} editorState={state} />
      </div>

      {/* Control Panel */}
      <div>
        <ControlPanel
          imageData={state.image}
          cropPreset={state.cropPreset}
          onCropPresetChange={handleCropPresetChange}
          onImageUpdate={handleImageUpdate}
          onAddSticker={handleAddSticker}
          onAddMention={handleAddMention}
          onAddLocation={handleAddLocation}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
