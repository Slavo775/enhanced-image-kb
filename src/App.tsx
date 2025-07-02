"use client";

import { useState, useCallback } from "react";
import { ImageUpload } from "./components/ImageUpload";
import { BackgroundControls } from "./components/BackgroundControls";
import { ImageCropper } from "./components/ImageCropper";
import { ImageEditor } from "./components/ImageEditor";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Slider } from "./components/ui/slider";
import { Monitor, Smartphone, Square } from "lucide-react";
import type { BackgroundSettings, CropArea, EditorData } from "./types";

const CANVAS_PRESETS = [
  { name: "Instagram Square", icon: Square, width: 400, height: 400 },
  { name: "Instagram Story", icon: Smartphone, width: 300, height: 533 },
  { name: "Twitter Post", icon: Monitor, width: 400, height: 225 },
  { name: "Facebook Post", icon: Monitor, width: 400, height: 210 },
];

function App() {
  // Image state
  const [originalImage, setOriginalImage] = useState<{
    src: string;
    width: number;
    height: number;
    file?: File;
  } | null>(null);

  const [croppedImage, setCroppedImage] = useState<{
    src: string;
    cropData: CropArea;
  } | null>(null);

  // Canvas settings
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  // Background settings
  const [backgroundSettings, setBackgroundSettings] =
    useState<BackgroundSettings>({
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      blur: 0,
    });

  // Editor data
  const [editorData, setEditorData] = useState<EditorData>({
    image: null,
    stickers: [],
    cropArea: null,
    backgroundSettings: {
      scale: 0,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      opacity: 0,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
    },
  });

  // Handlers
  const handleImageSelect = useCallback(
    (imageData: {
      src: string;
      width: number;
      height: number;
      file?: File;
    }) => {
      setOriginalImage(imageData);
      setCroppedImage(null);
      setEditorData({
        image: null,
        stickers: [],
        cropArea: null,
        backgroundSettings: {
          scale: 0,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          opacity: 0,
          brightness: 0,
          contrast: 0,
          saturation: 0,
          blur: 0,
        },
      });
    },
    []
  );

  const handleCropComplete = useCallback(
    (croppedImageSrc: string, cropData: CropArea) => {
      setCroppedImage({
        src: croppedImageSrc,
        cropData,
      });
    },
    []
  );

  const handleCanvasPreset = useCallback(
    (preset: { width: number; height: number }) => {
      setCanvasSize(preset);
    },
    []
  );

  const currentImageSrc = croppedImage?.src || originalImage?.src;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            📱 React Image Editor
          </h1>
          <p style={{ fontSize: "18px", color: "#6c757d" }}>
            Nahrajte obrázok, upravte ho a pridajte stickers, text, mentions a
            lokácie
          </p>
        </div>

        {/* Main Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "24px",
          }}
        >
          {/* Left Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Section 1: Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: "18px" }}>
                  📁 1. Nahrať obrázok
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onImageSelect={handleImageSelect} />
                {originalImage && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "14px",
                      color: "#6c757d",
                      textAlign: "center",
                    }}
                  >
                    Originál: {originalImage.width} × {originalImage.height}px
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2: Background Controls */}
            {originalImage && (
              <BackgroundControls
                settings={backgroundSettings}
                onSettingsChange={setBackgroundSettings}
              />
            )}

            {/* Canvas Size Controls */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontSize: "18px" }}>
                  📐 Veľkosť plátna
                </CardTitle>
              </CardHeader>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Presets */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Prednastavenia:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {CANVAS_PRESETS.map((preset, index) => {
                      const Icon = preset.icon;
                      return (
                        <Button
                          key={index}
                          variant={
                            canvasSize.width === preset.width &&
                            canvasSize.height === preset.height
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          style={{ justifyContent: "flex-start" }}
                          onClick={() => handleCanvasPreset(preset)}
                        >
                          <Icon size={16} style={{ marginRight: "8px" }} />
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: "12px" }}>
                              {preset.name}
                            </div>
                            <div style={{ fontSize: "10px", opacity: 0.7 }}>
                              {preset.width} × {preset.height}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Size */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Šírka: {canvasSize.width}px
                  </label>
                  <Slider
                    value={[canvasSize.width]}
                    onValueChange={(value) =>
                      setCanvasSize((prev) => ({ ...prev, width: value[0] }))
                    }
                    min={200}
                    max={800}
                    step={10}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Výška: {canvasSize.height}px
                  </label>
                  <Slider
                    value={[canvasSize.height]}
                    onValueChange={(value) =>
                      setCanvasSize((prev) => ({ ...prev, height: value[0] }))
                    }
                    min={200}
                    max={800}
                    step={10}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Section 3: Crop & Editor */}
            {originalImage && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {/* Crop */}
                <ImageCropper
                  imageSrc={originalImage.src}
                  imageWidth={originalImage.width}
                  imageHeight={originalImage.height}
                  onCropComplete={handleCropComplete}
                />

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle style={{ fontSize: "18px" }}>
                      👁️ Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "250px",
                    }}
                  >
                    {currentImageSrc ? (
                      <img
                        src={currentImageSrc || "/placeholder.svg"}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "250px",
                          objectFit: "contain",
                          border: "1px solid #e9ecef",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: "center", color: "#6c757d" }}>
                        <p>Nahrajte obrázok pre preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Image Editor */}
            {currentImageSrc && (
              <ImageEditor
                backgroundSettings={backgroundSettings}
                canvasSize={canvasSize}
                onStateChange={setEditorData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
