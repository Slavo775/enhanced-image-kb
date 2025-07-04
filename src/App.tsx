// "use client";

// import type React from "react";
// import { useState, useRef, useCallback } from "react";
// import { Button } from "./components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
// import { Slider } from "./components/ui/slider";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./components/ui/select";
// import { Input } from "./components/ui/input";
// import { Label } from "./components/ui/label";
// import { Separator } from "./components/ui/separator";
// import { Badge } from "./components/ui/badge";
// import {
//   Upload,
//   Download,
//   Crop,
//   Smile,
//   AtSign,
//   MapPin,
//   ImageIcon,
//   Instagram,
//   Youtube,
//   Twitter,
//   Facebook,
//   Square,
//   Smartphone,
//   Monitor,
// } from "lucide-react";
// import "./styles/globals.css";
// import ImageCanvas, { StickerInput } from "./components/canvas/Canvas";

// interface ImagePosition {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// interface CanvasPreset {
//   name: string;
//   width: number;
//   height: number;
//   icon: React.ComponentType<{ size?: string | number }>;
//   platform: string;
// }

// const CANVAS_PRESETS: CanvasPreset[] = [
//   {
//     name: "Instagram Post",
//     width: 1080,
//     height: 1080,
//     icon: Instagram,
//     platform: "Instagram",
//   },
//   {
//     name: "Instagram Story",
//     width: 1080,
//     height: 1920,
//     icon: Smartphone,
//     platform: "Instagram",
//   },
//   {
//     name: "YouTube Thumbnail",
//     width: 1280,
//     height: 720,
//     icon: Youtube,
//     platform: "YouTube",
//   },
//   {
//     name: "Twitter Post",
//     width: 1200,
//     height: 675,
//     icon: Twitter,
//     platform: "Twitter",
//   },
//   {
//     name: "Facebook Post",
//     width: 1200,
//     height: 630,
//     icon: Facebook,
//     platform: "Facebook",
//   },
//   { name: "Square", width: 800, height: 800, icon: Square, platform: "Custom" },
//   {
//     name: "Landscape",
//     width: 1200,
//     height: 800,
//     icon: Monitor,
//     platform: "Custom",
//   },
//   {
//     name: "Portrait",
//     width: 800,
//     height: 1200,
//     icon: Smartphone,
//     platform: "Custom",
//   },
// ];

// const STICKER_EMOJIS = [
//   "😀",
//   "😂",
//   "❤️",
//   "👍",
//   "🔥",
//   "✨",
//   "🎉",
//   "💯",
//   "🚀",
//   "⭐",
//   "🌟",
//   "💫",
//   "🎯",
//   "💪",
//   "👏",
//   "🙌",
// ];

// function App() {
//   // === SEKCIA 1: NAHRANIE OBRAZKA ===
//   const [originalImage, setOriginalImage] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imageDimensions, setImageDimensions] = useState({
//     width: 0,
//     height: 0,
//   });

//   // === SEKCIA 2: CROP A EDITACIA ===
//   const [imagePosition, setImagePosition] = useState<ImagePosition>({
//     x: 0,
//     y: 0,
//     width: 400,
//     height: 400,
//   });
//   const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
//   const [selectedPreset, setSelectedPreset] =
//     useState<string>("Instagram Post");
//   const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [stickers, setStickers] = useState<StickerInput[]>([]);

//   const handleAddSticker = (content: string) => {
//     const id = `${Date.now()}`;
//     const newSticker: StickerInput = {
//       id,
//       type: "sticker",
//       src: content,
//       x: Math.random() * 200,
//       y: Math.random() * 200,
//       width: 60,
//       height: 60,
//     };
//     setStickers((prev) => [...prev, newSticker]);
//   };

//   // === SEKCIA 1: NAHRANIE OBRAZKA ===
//   const handleImageUpload = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const file = event.target.files?.[0];
//       if (file && file.type.startsWith("image/")) {
//         setImageFile(file);
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const img = new Image();
//           img.onload = () => {
//             setOriginalImage(e.target?.result as string);
//             setImageDimensions({ width: img.width, height: img.height });

//             // Nastavenie defaultného crop area na stred obrazka
//             const defaultSize = Math.min(img.width, img.height, 400);
//             setImagePosition({
//               x: (img.width - defaultSize) / 2,
//               y: (img.height - defaultSize) / 2,
//               width: defaultSize,
//               height: defaultSize,
//             });
//           };
//           img.src = e.target?.result as string;
//         };
//         reader.readAsDataURL(file);
//       }
//     },
//     []
//   );

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//   }, []);

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       const files = Array.from(e.dataTransfer.files);
//       const imageFile = files.find((file) => file.type.startsWith("image/"));
//       if (imageFile) {
//         const fakeEvent = {
//           target: { files: [imageFile] },
//         } as unknown as React.ChangeEvent<HTMLInputElement>;
//         handleImageUpload(fakeEvent);
//       }
//     },
//     [handleImageUpload]
//   );

//   // === SEKCIA 2: CROP A EDITACIA ===
//   const handlePresetChange = useCallback((presetName: string) => {
//     const preset = CANVAS_PRESETS.find((p) => p.name === presetName);
//     if (preset) {
//       setSelectedPreset(presetName);
//       setCanvasSize({ width: preset.width, height: preset.height });
//     }
//   }, []);

//   const handleImagePositionChange = useCallback(
//     (property: keyof ImagePosition, value: number) => {
//       setImagePosition((prev) => ({
//         ...prev,
//         [property]: Math.max(0, value),
//       }));
//     },
//     []
//   );

//   const [outputImage, setOutputImage] = useState<string | null>(null);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             🎨 Enhanced Image Editor
//           </h1>
//           <p className="text-lg text-gray-600">
//             Nahrajte obrázok, upravte ho a pridajte stickers, mentions a lokácie
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* === SEKCIA 1: NAHRANIE OBRAZKA === */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Upload className="w-5 h-5" />
//                   1. Nahranie obrázka
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div
//                   className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                   <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//                   <p className="text-lg font-medium mb-2">
//                     Kliknite alebo pretiahnite obrázok
//                   </p>
//                   <p className="text-sm text-gray-500">PNG, JPG, GIF do 10MB</p>
//                 </div>

//                 {originalImage && (
//                   <div className="mt-4 p-3 bg-green-50 rounded-lg">
//                     <p className="text-sm text-green-700">
//                       ✅ Obrázok nahraný: {imageDimensions.width} ×{" "}
//                       {imageDimensions.height}px
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Crop Controls */}
//             {originalImage && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Crop className="w-5 h-5" />
//                     Nastavenia crop
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label>Prednastavené veľkosti</Label>
//                     <Select
//                       value={selectedPreset}
//                       onValueChange={handlePresetChange}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {CANVAS_PRESETS.map((preset) => {
//                           const Icon = preset.icon;
//                           return (
//                             <SelectItem key={preset.name} value={preset.name}>
//                               <div className="flex items-center gap-2">
//                                 <Icon size={16} />
//                                 <span>{preset.name}</span>
//                                 <Badge variant="secondary" className="text-xs">
//                                   {preset.width}×{preset.height}
//                                 </Badge>
//                               </div>
//                             </SelectItem>
//                           );
//                         })}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <Separator />

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>X pozícia: {imagePosition.x}</Label>
//                       <Slider
//                         value={[imagePosition.x]}
//                         onValueChange={([value]) =>
//                           handleImagePositionChange("x", value)
//                         }
//                         max={imageDimensions.width - imagePosition.width}
//                         step={1}
//                       />
//                     </div>
//                     <div>
//                       <Label>Y pozícia: {imagePosition.y}</Label>
//                       <Slider
//                         value={[imagePosition.y]}
//                         onValueChange={([value]) =>
//                           handleImagePositionChange("y", value)
//                         }
//                         max={imageDimensions.height - imagePosition.height}
//                         step={1}
//                       />
//                     </div>
//                     <div>
//                       <Label>Šírka: {imagePosition.width}</Label>
//                       <Slider
//                         value={[imagePosition.width]}
//                         onValueChange={([value]) =>
//                           handleImagePositionChange("width", value)
//                         }
//                         min={50}
//                         max={imageDimensions.width}
//                         step={1}
//                       />
//                     </div>
//                     <div>
//                       <Label>Výška: {imagePosition.height}</Label>
//                       <Slider
//                         value={[imagePosition.height]}
//                         onValueChange={([value]) =>
//                           handleImagePositionChange("height", value)
//                         }
//                         min={50}
//                         max={imageDimensions.height}
//                         step={1}
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Sticker Controls */}
//             {originalImage && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Smile className="w-5 h-5" />
//                     Pridať prvky
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {/* Stickers */}
//                   <div>
//                     <Label className="mb-2 block">Stickers</Label>
//                     <div className="grid grid-cols-4 gap-2">
//                       {STICKER_EMOJIS.map((emoji) => (
//                         <Button
//                           key={emoji}
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleAddSticker(emoji)}
//                           className="text-lg"
//                         >
//                           {emoji}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Mentions */}
//                   <div>
//                     <Label className="mb-2 block">Mention</Label>
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Používateľské meno"
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             const username = (
//                               e.target as HTMLInputElement
//                             ).value.trim();
//                             if (username) {
//                               handleAddSticker(username);
//                               (e.target as HTMLInputElement).value = "";
//                             }
//                           }
//                         }}
//                       />
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           const input = document.querySelector(
//                             'input[placeholder="Používateľské meno"]'
//                           ) as HTMLInputElement;
//                           const username = input?.value.trim();
//                           if (username) {
//                             handleAddSticker(username);
//                             input.value = "";
//                           }
//                         }}
//                       >
//                         <AtSign className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   <Separator />

//                   {/* Locations */}
//                   <div>
//                     <Label className="mb-2 block">Lokácia</Label>
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Názov lokácie"
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             const locationName = (
//                               e.target as HTMLInputElement
//                             ).value.trim();
//                             if (locationName) {
//                               handleAddSticker(locationName);
//                               (e.target as HTMLInputElement).value = "";
//                             }
//                           }
//                         }}
//                       />
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           const input = document.querySelector(
//                             'input[placeholder="Názov lokácie"]'
//                           ) as HTMLInputElement;
//                           const locationName = input?.value.trim();
//                           if (locationName) {
//                             handleAddSticker(locationName);
//                             input.value = "";
//                           }
//                         }}
//                       >
//                         <MapPin className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* === SEKCIA 2: CROP A EDITACIA === */}
//           <div className="lg:col-span-1">
//             {originalImage ? (
//               <Card className="h-fit">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <ImageIcon className="w-5 h-5" />
//                     2. Editácia obrázka
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ImageCanvas
//                     image={originalImage}
//                     cropWidth={600}
//                     cropHeight={600}
//                     zoom={50}
//                     rotation={0}
//                     setOutputImage={setOutputImage}
//                     stickers={stickers}
//                     onStickersChange={setStickers}
//                   />
//                   {/*
//                   <TestCanvasContainer
//                     image={originalImage}
//                     setOutputImage={setOutputImage}
//                   /> */}

//                   {/* Sticker Properties */}
//                   {selectedSticker && (
//                     <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                       <h4 className="font-medium mb-3">Vlastnosti prvku</h4>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card className="h-96 flex items-center justify-center">
//                 <div className="text-center text-gray-500">
//                   <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                   <p>Nahrajte obrázok pre začatie editácie</p>
//                 </div>
//               </Card>
//             )}
//           </div>

//           {/* === SEKCIA 3: PREVIEW A EXPORT === */}
//           <div className="lg:col-span-1">
//             <Card className="h-fit">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Download className="w-5 h-5" />
//                   3. Preview a stiahnutie
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {outputImage ? (
//                   <img src={outputImage} />
//                 ) : (
//                   <div className="h-96 flex items-center justify-center border rounded-lg bg-gray-50">
//                     <div className="text-center text-gray-500">
//                       <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                       <p>Preview sa zobrazí po nahraní obrázka</p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import ImageCanvas, { StickerInput } from "./components/canvas/Canvas"; // uprav podľa reálnej cesty

const App = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [stickers, setStickers] = useState<StickerInput[]>([]);
  const [mention, setMention] = useState("");
  const [location, setLocation] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSticker = (content: string) => {
    const id = `${Date.now()}`;
    const newSticker: StickerInput = {
      id,
      type: "sticker",
      src: content,
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: 60,
      height: 60,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* 1. Upload Image */}
      <div style={{ marginBottom: "20px" }}>
        <h2>1. Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* 2. Canvas Editor */}
      <div style={{ marginBottom: "20px" }}>
        <h2>2. Edit Image</h2>

        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() => handleAddSticker("🎉")}
            style={{ marginRight: "10px" }}
          >
            Add Emoji 🎉
          </button>
          <button
            onClick={() =>
              handleAddSticker(
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
              )
            }
          >
            Add Base64 Sticker 🐱
          </button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Add mention (e.g. john)"
            value={mention}
            onChange={(e) => setMention(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={() => alert("WIP")}>Add Mention</button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Add location (e.g. Bratislava)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={() => alert("WIP")}>Add Location</button>
        </div>

        {originalImage && (
          <ImageCanvas
            image={originalImage}
            cropWidth={600}
            cropHeight={600}
            zoom={50}
            rotation={0}
            setOutputImage={setOutputImage}
            stickers={stickers}
            onStickersChange={setStickers}
          />
        )}
      </div>

      {/* 3. Output Image */}
      <div>
        <h2>3. Output Image</h2>
        {outputImage ? (
          <img
            src={outputImage}
            alt="Cropped result"
            style={{ maxWidth: "100%", border: "1px solid #ccc" }}
          />
        ) : (
          <p>No output image yet</p>
        )}
      </div>
    </div>
  );
};

export default App;
