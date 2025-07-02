"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Slider } from "./components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import {
  Upload,
  Download,
  Crop,
  Smile,
  AtSign,
  MapPin,
  ImageIcon,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Square,
  Smartphone,
  Monitor,
  X,
} from "lucide-react";
import "../styles/globals.css";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StickerItem {
  id: string;
  type: "sticker" | "mention" | "location" | "custom-image";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  emoji?: string;
  username?: string;
  locationName?: string;
  imageSrc?: string;
}

interface CanvasPreset {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ size?: string | number }>;
  platform: string;
}

const CANVAS_PRESETS: CanvasPreset[] = [
  {
    name: "Instagram Post",
    width: 1080,
    height: 1080,
    icon: Instagram,
    platform: "Instagram",
  },
  {
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    icon: Smartphone,
    platform: "Instagram",
  },
  {
    name: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    icon: Youtube,
    platform: "YouTube",
  },
  {
    name: "Twitter Post",
    width: 1200,
    height: 675,
    icon: Twitter,
    platform: "Twitter",
  },
  {
    name: "Facebook Post",
    width: 1200,
    height: 630,
    icon: Facebook,
    platform: "Facebook",
  },
  { name: "Square", width: 800, height: 800, icon: Square, platform: "Custom" },
  {
    name: "Landscape",
    width: 1200,
    height: 800,
    icon: Monitor,
    platform: "Custom",
  },
  {
    name: "Portrait",
    width: 800,
    height: 1200,
    icon: Smartphone,
    platform: "Custom",
  },
];

const STICKER_EMOJIS = [
  "😀",
  "😂",
  "❤️",
  "👍",
  "🔥",
  "✨",
  "🎉",
  "💯",
  "🚀",
  "⭐",
  "🌟",
  "💫",
  "🎯",
  "💪",
  "👏",
  "🙌",
];

function App() {
  // === SEKCIA 1: NAHRANIE OBRAZKA ===
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // === SEKCIA 2: CROP A EDITACIA ===
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 400,
    height: 400,
  });
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [selectedPreset, setSelectedPreset] =
    useState<string>("Instagram Post");
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // === SEKCIA 3: PREVIEW A EXPORT ===
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === SEKCIA 1: NAHRANIE OBRAZKA ===
  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            setOriginalImage(e.target?.result as string);
            setImageDimensions({ width: img.width, height: img.height });

            // Nastavenie defaultného crop area na stred obrazka
            const defaultSize = Math.min(img.width, img.height, 400);
            setCropArea({
              x: (img.width - defaultSize) / 2,
              y: (img.height - defaultSize) / 2,
              width: defaultSize,
              height: defaultSize,
            });
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));
      if (imageFile) {
        const fakeEvent = {
          target: { files: [imageFile] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleImageUpload(fakeEvent);
      }
    },
    [handleImageUpload]
  );

  // === SEKCIA 2: CROP A EDITACIA ===
  const handlePresetChange = useCallback((presetName: string) => {
    const preset = CANVAS_PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setSelectedPreset(presetName);
      setCanvasSize({ width: preset.width, height: preset.height });
    }
  }, []);

  const handleCropChange = useCallback(
    (property: keyof CropArea, value: number) => {
      setCropArea((prev) => ({
        ...prev,
        [property]: Math.max(0, value),
      }));
    },
    []
  );

  const addSticker = useCallback(
    (type: StickerItem["type"], content: string, extra?: any) => {
      const newSticker: StickerItem = {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        content,
        x: canvasSize.width / 2 - 50,
        y: canvasSize.height / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0,
        ...extra,
      };
      setStickers((prev) => [...prev, newSticker]);
    },
    [canvasSize]
  );

  const updateSticker = useCallback(
    (id: string, updates: Partial<StickerItem>) => {
      setStickers((prev) =>
        prev.map((sticker) =>
          sticker.id === id ? { ...sticker, ...updates } : sticker
        )
      );
    },
    []
  );

  const removeSticker = useCallback((id: string) => {
    setStickers((prev) => prev.filter((sticker) => sticker.id !== id));
    setSelectedSticker(null);
    setShowTooltip(null);
  }, []);

  const handleStickerClick = useCallback(
    (sticker: StickerItem, event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedSticker(sticker.id);
      setShowTooltip({
        id: sticker.id,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );

  const handleStickerMouseDown = useCallback(
    (sticker: StickerItem, event: React.MouseEvent) => {
      event.preventDefault();
      setIsDragging(true);
      setSelectedSticker(sticker.id);
      const rect = event.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && selectedSticker) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left - dragOffset.x;
          const y = event.clientY - rect.top - dragOffset.y;
          updateSticker(selectedSticker, { x, y });
        }
      }
    },
    [isDragging, selectedSticker, dragOffset, updateSticker]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // === SEKCIA 3: PREVIEW A EXPORT ===
  const generatePreview = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Vyčistenie canvasu
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nakreslenie orezaného obrazka
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Nakreslenie stickerov
      stickers.forEach((sticker) => {
        ctx.save();
        ctx.translate(
          sticker.x + sticker.width / 2,
          sticker.y + sticker.height / 2
        );
        ctx.rotate((sticker.rotation * Math.PI) / 180);

        if (sticker.type === "sticker" && sticker.emoji) {
          ctx.font = `${sticker.height}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(sticker.emoji, 0, 0);
        } else if (sticker.type === "mention" && sticker.username) {
          ctx.fillStyle = "#1DA1F2";
          ctx.fillRect(
            -sticker.width / 2,
            -sticker.height / 2,
            sticker.width,
            sticker.height
          );
          ctx.fillStyle = "white";
          ctx.font = `${sticker.height / 3}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`@${sticker.username}`, 0, 0);
        } else if (sticker.type === "location" && sticker.locationName) {
          ctx.fillStyle = "#FF6B6B";
          ctx.fillRect(
            -sticker.width / 2,
            -sticker.height / 2,
            sticker.width,
            sticker.height
          );
          ctx.fillStyle = "white";
          ctx.font = `${sticker.height / 4}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`📍 ${sticker.locationName}`, 0, 0);
        }

        ctx.restore();
      });

      // Vytvorenie preview
      setPreviewImage(canvas.toDataURL("image/png"));
    };
    img.src = originalImage;
  }, [originalImage, canvasSize, cropArea, stickers]);

  const handleDownload = useCallback(async () => {
    if (!previewImage) return;

    setIsExporting(true);
    try {
      const link = document.createElement("a");
      link.download = `edited-image-${Date.now()}.png`;
      link.href = previewImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  }, [previewImage]);

  // Automatické generovanie preview pri zmene
  useEffect(() => {
    if (originalImage) {
      generatePreview();
    }
  }, [generatePreview, originalImage]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎨 Enhanced Image Editor
          </h1>
          <p className="text-lg text-gray-600">
            Nahrajte obrázok, upravte ho a pridajte stickers, mentions a lokácie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === SEKCIA 1: NAHRANIE OBRAZKA === */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  1. Nahranie obrázka
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    Kliknite alebo pretiahnite obrázok
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF do 10MB</p>
                </div>

                {originalImage && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✅ Obrázok nahraný: {imageDimensions.width} ×{" "}
                      {imageDimensions.height}px
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Crop Controls */}
            {originalImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crop className="w-5 h-5" />
                    Nastavenia crop
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Prednastavené veľkosti</Label>
                    <Select
                      value={selectedPreset}
                      onValueChange={handlePresetChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CANVAS_PRESETS.map((preset) => {
                          const Icon = preset.icon;
                          return (
                            <SelectItem key={preset.name} value={preset.name}>
                              <div className="flex items-center gap-2">
                                <Icon size={16} />
                                <span>{preset.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {preset.width}×{preset.height}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>X pozícia: {cropArea.x}</Label>
                      <Slider
                        value={[cropArea.x]}
                        onValueChange={([value]) =>
                          handleCropChange("x", value)
                        }
                        max={imageDimensions.width - cropArea.width}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label>Y pozícia: {cropArea.y}</Label>
                      <Slider
                        value={[cropArea.y]}
                        onValueChange={([value]) =>
                          handleCropChange("y", value)
                        }
                        max={imageDimensions.height - cropArea.height}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label>Šírka: {cropArea.width}</Label>
                      <Slider
                        value={[cropArea.width]}
                        onValueChange={([value]) =>
                          handleCropChange("width", value)
                        }
                        min={50}
                        max={imageDimensions.width}
                        step={1}
                      />
                    </div>
                    <div>
                      <Label>Výška: {cropArea.height}</Label>
                      <Slider
                        value={[cropArea.height]}
                        onValueChange={([value]) =>
                          handleCropChange("height", value)
                        }
                        min={50}
                        max={imageDimensions.height}
                        step={1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sticker Controls */}
            {originalImage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="w-5 h-5" />
                    Pridať prvky
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stickers */}
                  <div>
                    <Label className="mb-2 block">Stickers</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {STICKER_EMOJIS.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addSticker("sticker", emoji, { emoji })
                          }
                          className="text-lg"
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Mentions */}
                  <div>
                    <Label className="mb-2 block">Mention</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Používateľské meno"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const username = (
                              e.target as HTMLInputElement
                            ).value.trim();
                            if (username) {
                              addSticker("mention", username, { username });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="Používateľské meno"]'
                          ) as HTMLInputElement;
                          const username = input?.value.trim();
                          if (username) {
                            addSticker("mention", username, { username });
                            input.value = "";
                          }
                        }}
                      >
                        <AtSign className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Locations */}
                  <div>
                    <Label className="mb-2 block">Lokácia</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Názov lokácie"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const locationName = (
                              e.target as HTMLInputElement
                            ).value.trim();
                            if (locationName) {
                              addSticker("location", locationName, {
                                locationName,
                              });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="Názov lokácie"]'
                          ) as HTMLInputElement;
                          const locationName = input?.value.trim();
                          if (locationName) {
                            addSticker("location", locationName, {
                              locationName,
                            });
                            input.value = "";
                          }
                        }}
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* === SEKCIA 2: CROP A EDITACIA === */}
          <div className="lg:col-span-1">
            {originalImage ? (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    2. Editácia obrázka
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative border rounded-lg overflow-hidden bg-white"
                    style={{
                      aspectRatio: `${canvasSize.width}/${canvasSize.height}`,
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                  >
                    <canvas
                      ref={canvasRef}
                      width={canvasSize.width}
                      height={canvasSize.height}
                      className="w-full h-full object-contain"
                      style={{ maxHeight: "400px" }}
                    />

                    {/* Stickers Overlay */}
                    {stickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        className={`absolute cursor-move border-2 ${
                          selectedSticker === sticker.id
                            ? "border-blue-500"
                            : "border-transparent"
                        } hover:border-blue-300 transition-colors`}
                        style={{
                          left: `${(sticker.x / canvasSize.width) * 100}%`,
                          top: `${(sticker.y / canvasSize.height) * 100}%`,
                          width: `${(sticker.width / canvasSize.width) * 100}%`,
                          height: `${
                            (sticker.height / canvasSize.height) * 100
                          }%`,
                          transform: `rotate(${sticker.rotation}deg)`,
                        }}
                        onClick={(e) => handleStickerClick(sticker, e)}
                        onMouseDown={(e) => handleStickerMouseDown(sticker, e)}
                      >
                        {sticker.type === "sticker" && (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {sticker.emoji}
                          </div>
                        )}
                        {sticker.type === "mention" && (
                          <div className="w-full h-full bg-blue-500 text-white rounded px-2 py-1 text-xs flex items-center justify-center">
                            @{sticker.username}
                          </div>
                        )}
                        {sticker.type === "location" && (
                          <div className="w-full h-full bg-red-500 text-white rounded px-2 py-1 text-xs flex items-center justify-center">
                            📍 {sticker.locationName}
                          </div>
                        )}

                        {selectedSticker === sticker.id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSticker(sticker.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sticker Properties */}
                  {selectedSticker && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Vlastnosti prvku</h4>
                      {(() => {
                        const sticker = stickers.find(
                          (s) => s.id === selectedSticker
                        );
                        if (!sticker) return null;

                        return (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Šírka</Label>
                                <Slider
                                  value={[sticker.width]}
                                  onValueChange={([value]) =>
                                    updateSticker(sticker.id, { width: value })
                                  }
                                  min={20}
                                  max={200}
                                  step={1}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Výška</Label>
                                <Slider
                                  value={[sticker.height]}
                                  onValueChange={([value]) =>
                                    updateSticker(sticker.id, { height: value })
                                  }
                                  min={20}
                                  max={200}
                                  step={1}
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">
                                Rotácia: {sticker.rotation}°
                              </Label>
                              <Slider
                                value={[sticker.rotation]}
                                onValueChange={([value]) =>
                                  updateSticker(sticker.id, { rotation: value })
                                }
                                min={-180}
                                max={180}
                                step={1}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Nahrajte obrázok pre začatie editácie</p>
                </div>
              </Card>
            )}
          </div>

          {/* === SEKCIA 3: PREVIEW A EXPORT === */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  3. Preview a stiahnutie
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewImage ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleDownload}
                        disabled={isExporting}
                        className="w-full"
                      >
                        {isExporting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Exportuje sa...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Stiahnuť obrázok
                          </>
                        )}
                      </Button>

                      <div className="text-sm text-gray-500 text-center">
                        Veľkosť: {canvasSize.width} × {canvasSize.height}px
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center border rounded-lg bg-gray-50">
                    <div className="text-center text-gray-500">
                      <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Preview sa zobrazí po nahraní obrázka</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="fixed z-50 bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
            style={{
              left: showTooltip.x + 10,
              top: showTooltip.y - 40,
            }}
          >
            {(() => {
              const sticker = stickers.find((s) => s.id === showTooltip.id);
              if (!sticker) return "Neznámy prvok";

              switch (sticker.type) {
                case "sticker":
                  return `Sticker: ${sticker.emoji}`;
                case "mention":
                  return `Mention: @${sticker.username}`;
                case "location":
                  return `Lokácia: ${sticker.locationName}`;
                default:
                  return "Prvok";
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
