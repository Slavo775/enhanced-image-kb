"use client"

import { useState, useRef, useCallback } from "react"
import { InstagramEditor } from "../src/components/InstagramEditor"
import { useInstagramExport } from "../hooks/useInstagramExport"
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/ui/tabs"
import { ImageEditor } from "../src/components/ImageEditor"
import type { ImageEditorData, Sticker, Mention, LocationTag } from "../src/types"
import type { InstagramEditorState } from "../hooks/useInstagramEditor"

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

export default function Home() {
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

  const [activeTab, setActiveTab] = useState("editor")

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Enhanced Image Editor</h1>
          <p className="text-muted-foreground text-lg">Professional image editing with Instagram-ready formats</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Image Editor</TabsTrigger>
            <TabsTrigger value="instagram">Instagram Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instagram" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Editor</CardTitle>
              </CardHeader>
              <CardContent>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
