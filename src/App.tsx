"use client"

import type React from "react"
import { useState } from "react"
import { ImageEditor } from "./components/ImageEditor"
import { InstagramEditor } from "./components/InstagramEditor"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import "./styles/globals.css"

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setActiveTab("editor")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "edited-image.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCancel = () => {
    setSelectedImage(null)
    setActiveTab("upload")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Enhanced Image Editor</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="editor" disabled={!selectedImage}>
              Basic Editor
            </TabsTrigger>
            <TabsTrigger value="instagram" disabled={!selectedImage}>
              Instagram Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="space-y-4">
                      <div className="text-4xl">📸</div>
                      <div>
                        <p className="text-lg font-medium">Click to upload an image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <Button>Choose File</Button>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor" className="mt-6">
            {selectedImage && (
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <ImageEditor imageSrc={selectedImage} onSave={handleSave} onCancel={handleCancel} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="instagram" className="mt-6">
            {selectedImage && (
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <InstagramEditor imageSrc={selectedImage} onSave={handleSave} onCancel={handleCancel} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
