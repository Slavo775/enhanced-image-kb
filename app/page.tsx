"use client"

import { useState, useRef, useCallback } from "react"
import { InstagramEditor } from "../components/InstagramEditor"
import { BackgroundControls } from "../components/BackgroundControls"
import { ImageUpload } from "../components/ImageUpload"
import { useInstagramExport } from "../hooks/useInstagramExport"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { InteractiveImageViewer } from "@/components/InteractiveImageViewer"
import { DimensionControls } from "@/components/DimensionControls"
import type { ImageEditorData, Sticker, Mention, LocationTag } from "../types"
import type { InstagramEditorState } from "../hooks/useInstagramEditor"
import { Download, Terminal } from "lucide-react"

const SAMPLE_EMOJIS = ["😀", "😍", "🔥", "💯", "👍", "❤️", "😂", "🎉", "✨", "🌟"]

const CUSTOM_SVG_STICKERS = [
  {
    name: "Dúha",
    svg: `<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 40 Q50 10 90 40" stroke="#ff0000" strokeWidth="3" fill="none"/>
      <path d="M10 37 Q50 13 90 37" stroke="#ff8800" strokeWidth="3" fill="none"/>
      <path d="M10 34 Q50 16 90 34" stroke="#ffff00" strokeWidth="3" fill="none"/>
      <path d="M10 31 Q50 19 90 31" stroke="#00ff00" strokeWidth="3" fill="none"/>
      <path d="M10 28 Q50 22 90 28" stroke="#0088ff" strokeWidth="3" fill="none"/>
      <path d="M10 25 Q50 25 90 25" stroke="#4400ff" strokeWidth="3" fill="none"/>
      <path d="M10 22 Q50 28 90 22" stroke="#8800ff" strokeWidth="3" fill="none"/>
    </svg>`,
  },
  {
    name: "Srdce",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 85 C20 60, 5 35, 25 20 C35 10, 50 20, 50 20 C50 20, 65 10, 75 20 C95 35, 80 60, 50 85 Z" 
            fill="#ff4757" stroke="#ff3742" strokeWidth="2"/>
      <ellipse cx="35" cy="30" rx="8" ry="6" fill="#ff6b7a" opacity="0.7"/>
    </svg>`,
  },
]

const SAMPLE_USERS = [
  { username: "johndoe", displayName: "John Doe" },
  { username: "janedoe", displayName: "Jane Smith" },
]

const SAMPLE_LOCATIONS = [
  { name: "New York", address: "New York, NY, USA", coordinates: { lat: 40.7128, lng: -74.006 } },
  { name: "Paris", address: "Paris, France", coordinates: { lat: 48.8566, lng: 2.3522 } },
]

export default function HomePage() {
  const editorRef = useRef<{
    loadImage: (src: string) => void
    addSticker: (sticker: any) => string
    addMention: (mention: any) => string
    addLocation: (location: any) => string
    getData: () => ImageEditorData
    setData: (data: ImageEditorData) => void
    getEditorState: () => InstagramEditorState
    updateBackground: (updates: any) => void
    resetToFit: () => void
    fillCanvas: () => void
  }>(null)

  const { downloadImage } = useInstagramExport()

  const [editorData, setEditorData] = useState<ImageEditorData>({
    stickers: [],
    mentions: [],
    locations: [],
  })

  const [customText, setCustomText] = useState("")
  const [currentImageSrc, setCurrentImageSrc] = useState("/placeholder.svg?height=400&width=600")
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 })
  const [backgroundState, setBackgroundState] = useState({
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    opacity: 1,
  })

  const createSticker = (
    type: "emoji" | "image" | "text" | "svg",
    content: string,
    position: { x: number; y: number } = { x: 50, y: 50 },
    size: { width: number; height: number } = { width: 60, height: 60 },
  ) => ({
    type,
    content,
    position, // Pozície relatívne k canvasu (0-500, 0-500)
    size,
    rotation: 0,
    zIndex: 1,
  })

  const createMention = (
    username: string,
    displayName: string,
    position: { x: number; y: number } = { x: 50, y: 50 },
  ) => ({
    username,
    displayName,
    position, // Pozície relatívne k canvasu
    size: { width: 120, height: 32 },
  })

  const createLocation = (
    name: string,
    address?: string,
    coordinates?: { lat: number; lng: number },
    position: { x: number; y: number } = { x: 50, y: 50 },
  ) => ({
    name,
    address,
    coordinates,
    position, // Pozície relatívne k canvasu
    size: { width: 150, height: 32 },
  })

  const handleImageSelect = useCallback(
    (imageData: {
      src: string
      width: number
      height: number
      file?: File
    }) => {
      setCurrentImageSrc(imageData.src)
      if (editorRef.current) {
        editorRef.current.loadImage(imageData.src)
      }
      setEditorData({ stickers: [], mentions: [], locations: [] })
    },
    [],
  )

  const handleAddEmoji = (emoji: string) => {
    if (editorRef.current) {
      const randomX = Math.random() * (dimensions.width - 60)
      const randomY = Math.random() * (dimensions.height - 60)
      editorRef.current.addSticker(createSticker("emoji", emoji, { x: randomX, y: randomY }))
    }
  }

  const handleAddCustomText = () => {
    if (editorRef.current && customText.trim()) {
      const randomX = Math.random() * (dimensions.width - 120)
      const randomY = Math.random() * (dimensions.height - 40)
      editorRef.current.addSticker(
        createSticker("text", customText, { x: randomX, y: randomY }, { width: 120, height: 40 }),
      )
      setCustomText("")
    }
  }

  const handleAddMention = (user: { username: string; displayName: string }) => {
    if (editorRef.current) {
      const randomX = Math.random() * (dimensions.width - 120)
      const randomY = Math.random() * (dimensions.height - 32)
      editorRef.current.addMention(createMention(user.username, user.displayName, { x: randomX, y: randomY }))
    }
  }

  const handleAddLocation = (location: any) => {
    if (editorRef.current) {
      const randomX = Math.random() * (dimensions.width - 150)
      const randomY = Math.random() * (dimensions.height - 32)
      editorRef.current.addLocation(
        createLocation(location.name, location.address, location.coordinates, { x: randomX, y: randomY }),
      )
    }
  }

  const handleAddCustomSticker = (customSticker: { name: string; svg: string }) => {
    if (editorRef.current) {
      const randomX = Math.random() * (dimensions.width - 80)
      const randomY = Math.random() * (dimensions.height - 80)
      const svgDataUrl = `data:image/svg+xml;base64,${btoa(customSticker.svg)}`
      editorRef.current.addSticker(
        createSticker("svg", svgDataUrl, { x: randomX, y: randomY }, { width: 80, height: 80 }),
      )
    }
  }

  const handleClearAll = () => {
    if (editorRef.current) {
      editorRef.current.setData({ stickers: [], mentions: [], locations: [] })
    }
  }

  const handleDownload = async () => {
    if (editorRef.current && currentImageSrc) {
      const editorState = editorRef.current.getEditorState()
      await downloadImage(currentImageSrc, editorState, "instagram-story.png", {
        format: "png",
        quality: 0.95,
        pixelRatio: 2, // Retina quality
      })
    }
  }

  const handleExportToConsole = async () => {
    if (editorRef.current && currentImageSrc) {
      const editorState = editorRef.current.getEditorState()
      console.group("📱 Instagram Editor Export")
      console.log("🖼️ Image Source:", currentImageSrc)
      console.log("📐 Canvas:", `${dimensions.width}×${dimensions.height}px`)
      console.log("🎯 Background State:", editorState.backgroundImage)
      console.log("🎭 Stickers:", editorState.stickers)
      console.groupEnd()
    }
  }

  const handleStickerClick = (sticker: Sticker) => {
    console.log("Sticker clicked:", sticker)
  }

  const handleMentionClick = (mention: Mention) => {
    console.log("Mention clicked:", mention)
  }

  const handleLocationClick = (location: LocationTag) => {
    console.log("Location clicked:", location)
  }

  const handleDimensionChange = (width: number, height: number) => {
    setDimensions({ width, height })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📱 Mobile-Friendly Image Editor</h1>
          <p className="text-lg text-gray-600">Touch & drag support for mobile devices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Image Upload & Background Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="samples">Samples</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <ImageUpload onImageSelect={handleImageSelect} />
              </TabsContent>

              <TabsContent value="samples" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">🖼️ Sample Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() =>
                        handleImageSelect({
                          src: "https://via.placeholder.com/800x600/e2e8f0/64748b?text=Landscape+800x600",
                          width: 800,
                          height: 600,
                        })
                      }
                    >
                      Landscape (800×600)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() =>
                        handleImageSelect({
                          src: "https://via.placeholder.com/1080x1920/e2e8f0/64748b?text=Portrait+1080x1920",
                          width: 1080,
                          height: 1920,
                        })
                      }
                    >
                      Portrait (1080×1920)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() =>
                        handleImageSelect({
                          src: "https://via.placeholder.com/1000x1000/e2e8f0/64748b?text=Square+1000x1000",
                          width: 1000,
                          height: 1000,
                        })
                      }
                    >
                      Square (1000×1000)
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <BackgroundControls
              backgroundState={backgroundState}
              onUpdate={(updates) => {
                setBackgroundState((prev) => ({ ...prev, ...updates }))
                if (editorRef.current) {
                  editorRef.current.updateBackground(updates)
                }
              }}
              onResetToFit={() => editorRef.current?.resetToFit()}
              onFillCanvas={() => editorRef.current?.fillCanvas()}
            />
          </div>

          {/* Instagram Editor */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>📱 Mobile Image Editor</CardTitle>
                <div className="text-sm text-gray-600">
                  Canvas: {dimensions.width} × {dimensions.height}px (Touch & Drag Enabled)
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <InstagramEditor
                  ref={editorRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  onDataChange={setEditorData}
                  onStickerClick={handleStickerClick}
                  onMentionClick={handleMentionClick}
                  onLocationClick={handleLocationClick}
                  editable={true}
                  className="border-2 border-gray-200 rounded-lg shadow-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Stickers Controls */}
          <div className="space-y-4">
            {/* Emoji Stickers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">🎭 Emoji</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1">
                  {SAMPLE_EMOJIS.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-lg p-1 h-8 bg-transparent"
                      onClick={() => handleAddEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom SVG Stickers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">🎨 Custom</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-1">
                  {CUSTOM_SVG_STICKERS.map((sticker, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="p-1 h-12 bg-transparent flex flex-col items-center gap-1"
                      onClick={() => handleAddCustomSticker(sticker)}
                    >
                      <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: sticker.svg }} />
                      <span className="text-xs">{sticker.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Text */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">✏️ Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Text..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddCustomText()}
                />
                <Button onClick={handleAddCustomText} disabled={!customText.trim()} size="sm" className="w-full">
                  Add Text
                </Button>
              </CardContent>
            </Card>

            {/* Mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">👥 Mentions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {SAMPLE_USERS.map((user, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent text-xs"
                    onClick={() => handleAddMention(user)}
                  >
                    @{user.username}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📍 Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {SAMPLE_LOCATIONS.map((location, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent text-xs"
                    onClick={() => handleAddLocation(location)}
                  >
                    📍 {location.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">🛠️ Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={handleClearAll} variant="destructive" size="sm" className="w-full">
                  Clear All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Export Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <div>
                    <strong>Canvas:</strong> {dimensions.width}×{dimensions.height}px
                  </div>
                  <div>
                    <strong>Format:</strong> PNG (retina 2x)
                  </div>
                  <div>
                    <strong>Mobile:</strong> Touch & Drag Enabled
                  </div>
                </div>

                <Button onClick={handleDownload} className="w-full" disabled={!currentImageSrc}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>

                <Button
                  onClick={handleExportToConsole}
                  variant="outline"
                  className="w-full bg-transparent"
                  disabled={!currentImageSrc}
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Export to Console
                </Button>

                <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  📱 <strong>Mobile Support:</strong>
                  <br />• Touch to drag stickers
                  <br />• Pinch to zoom background
                  <br />• Tap to add elements
                  <br />• Full responsive design
                  <br />• Toggle lock/unlock to edit
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Image Viewer */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveImageViewer
                  imageSrc={currentImageSrc}
                  width={dimensions.width}
                  height={dimensions.height}
                />
              </CardContent>
            </Card>
          </div>

          {/* Dimension Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <DimensionControls
                  width={dimensions.width}
                  height={dimensions.height}
                  onDimensionChange={handleDimensionChange}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
