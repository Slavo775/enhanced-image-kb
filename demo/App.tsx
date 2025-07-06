import React, { useState } from "react";
import { useStickers } from "../src/hooks/stickers/useStickers";
import { EnhancedImage } from "../src";
import { useImageExporter } from "../src/hooks/canvas/useImageExporter";

const App = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [mention, setMention] = useState("");
  const [location, setLocation] = useState("");
  const { exportFinalImage } = useImageExporter("test-canvas");
  const { addSticker } = useStickers("test-canvas");

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
            onClick={() => addSticker("🎉")}
            style={{ marginRight: "10px" }}
          >
            Add Emoji 🎉
          </button>
          <button
            onClick={() =>
              addSticker(
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
          <EnhancedImage
            id="test-canvas"
            image={originalImage}
            cropWidth={600}
            cropHeight={600}
            zoom={50}
            rotation={0}
            // setOutputImage={setOutputImage}
          />
        )}
      </div>

      {/* 3. Output Image */}
      <div>
        <h2>3. Output Image</h2>
        <button
          onClick={async () => {
            console.log(await exportFinalImage());
            return setOutputImage((await exportFinalImage())?.dataUrl ?? "");
          }}
        >
          Export
        </button>
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
