import React, { FunctionComponent, useState } from "react";
import ImageCanvas, { StickerInput } from "./Canvas";

type TestCanvasContainer = {
  image?: string;
  setOutputImage: (image: string) => void;
};

const TestCanvasContainer: FunctionComponent<TestCanvasContainer> = ({
  image,
  setOutputImage,
}) => {
  const [stickers, setStickers] = useState<StickerInput[]>([]);

  const handleAddSticker = () => {
    const id = `${Date.now()}`;
    const newSticker: StickerInput = {
      id,
      type: "sticker",
      src: "❤️", // môžeš nahradiť SVG/base64
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: 60,
      height: 60,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const handleOutput = (dataUrl: string, metadata?: StickerInput[]) => {
    console.log("Output image:", dataUrl);
    console.log("Stickers metadata:", metadata);
    setOutputImage(dataUrl);
  };

  return (
    <div>
      <button onClick={handleAddSticker}>Pridať sticker</button>

      {image && (
        <ImageCanvas
          image={image}
          cropWidth={600}
          cropHeight={600}
          zoom={100}
          rotation={0}
          stickers={stickers}
          onStickersChange={setStickers}
          setOutputImage={handleOutput}
        />
      )}
    </div>
  );
};

export default TestCanvasContainer;
