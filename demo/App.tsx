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
            onClick={() =>
              addSticker(`<svg width="50" height="56" viewBox="0 0 50 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_63_9559)">
<path d="M20.6947 40.375C20.3047 39.825 19.6947 39.485 19.0647 39.485L3.90474 39.345C0.304736 39.315 -1.41526 34.325 1.39474 32.075L11.7647 23.795C13.1847 22.665 13.9747 20.825 13.8847 18.855L13.2147 4.525C13.0347 0.645 17.5647 -0.925 19.8147 2.245L29.3047 15.615C29.6947 16.165 30.3047 16.505 30.9347 16.505L46.0947 16.645C49.6947 16.675 51.4147 21.665 48.6047 23.915L36.7547 33.375C36.2647 33.765 35.9947 34.405 36.0247 35.085L36.7947 51.455C36.9747 55.335 32.4447 56.905 30.1947 53.735L20.7047 40.365L20.6947 40.375Z" fill="url(#paint0_linear_63_9559)" style=""/>
<g style="mix-blend-mode:hard-light">
<path d="M20.285 14.325L24.135 19.755C25.855 22.185 28.515 23.635 31.265 23.665L37.415 23.725L32.605 27.565C30.455 29.285 29.265 32.065 29.405 35.035L29.715 41.685L25.865 36.255C24.145 33.825 21.485 32.375 18.735 32.345L12.585 32.285L17.395 28.445C19.545 26.725 20.735 23.945 20.595 20.975L20.285 14.325Z" fill="#E5AD00" style="fill:#E5AD00;fill:color(display-p3 0.8980 0.6784 0.0000);fill-opacity:1;"/>
<path d="M20.285 14.325L24.135 19.755C25.855 22.185 28.515 23.635 31.265 23.665L37.415 23.725L32.605 27.565C30.455 29.285 29.265 32.065 29.405 35.035L29.715 41.685L25.865 36.255C24.145 33.825 21.485 32.375 18.735 32.345L12.585 32.285L17.395 28.445C19.545 26.725 20.735 23.945 20.595 20.975L20.285 14.325Z" stroke="black" style="stroke:black;stroke-opacity:1;" stroke-width="2.06" stroke-miterlimit="10"/>
</g>
</g>
<defs>
<linearGradient id="paint0_linear_63_9559" x1="42.6668" y1="44.3677" x2="3.66715" y2="13.3297" gradientUnits="userSpaceOnUse">
<stop stop-color="#F2BD9B" style="stop-color:#F2BD9B;stop-color:color(display-p3 0.9490 0.7412 0.6078);stop-opacity:1;"/>
<stop offset="0.22" stop-color="#C0F8AA" style="stop-color:#C0F8AA;stop-color:color(display-p3 0.7529 0.9725 0.6667);stop-opacity:1;"/>
<stop offset="0.4" stop-color="#93EBDD" style="stop-color:#93EBDD;stop-color:color(display-p3 0.5765 0.9216 0.8667);stop-opacity:1;"/>
<stop offset="0.58" stop-color="#87C3F9" style="stop-color:#87C3F9;stop-color:color(display-p3 0.5294 0.7647 0.9765);stop-opacity:1;"/>
<stop offset="0.77" stop-color="#A87EE7" style="stop-color:#A87EE7;stop-color:color(display-p3 0.6588 0.4941 0.9059);stop-opacity:1;"/>
<stop offset="0.99" stop-color="#DC7DB9" style="stop-color:#DC7DB9;stop-color:color(display-p3 0.8627 0.4902 0.7255);stop-opacity:1;"/>
</linearGradient>
<clipPath id="clip0_63_9559">
<rect width="49.99" height="54.87" fill="white" style="fill:white;fill-opacity:1;" transform="translate(0.00488281 0.565002)"/>
</clipPath>
</defs>
</svg>`)
            }
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
