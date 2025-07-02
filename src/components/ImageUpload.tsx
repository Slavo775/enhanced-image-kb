"use client";

import type React from "react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { ImageData } from "../types";

interface ImageUploadProps {
  onImageSelect: (imageData: ImageData) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Prosím vyberte obrázok!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const imageData: ImageData = {
          src: e.target?.result as string,
          file,
          originalWidth: img.width,
          originalHeight: img.height,
          scale: 1,
          rotation: 0,
          opacity: 1,
          brightness: 1,
          x: 0,
          y: 0,
        };
        onImageSelect(imageData);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
      <div
        className="text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold mb-2">Upload obrázok</h3>
        <p className="text-gray-600 mb-4">
          Kliknite alebo pretiahnite obrázok sem
        </p>
        <Button>Vybrať obrázok</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </Card>
  );
}
