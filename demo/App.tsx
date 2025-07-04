import React, { useState } from "react";
import ImageCanvas, { StickerInput } from "../src/components/canvas/Canvas"; // uprav podľa reálnej cesty

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
