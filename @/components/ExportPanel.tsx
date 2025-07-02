"use client"

import type React from "react"
import { useState } from "react"
import { useImageExport, type ExportOptions } from "@/hooks/useImageExport"
import type { ImageEditorData } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { InteractiveImageViewer } from "./InteractiveImageViewer"
import { Download, ImageIcon, Loader2, Terminal, Eye } from "lucide-react"

interface ExportPanelProps {
  imageSrc: string
  data: ImageEditorData
  originalWidth: number
  originalHeight: number
  cropData?: {
    x: number
    y: number
    width: number
    height: number
    scale: number
  }
  originalImageWidth?: number
  originalImageHeight?: number
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  imageSrc,
  data,
  originalWidth,
  originalHeight,
  cropData,
  originalImageWidth,
  originalImageHeight,
}) => {
  const { exportComplete, downloadImage } = useImageExport()

  const [qualitySettings, setQualitySettings] = useState({
    pixelRatio: 1, // ZMENA: Default na 1 namiesto window.devicePixelRatio
    antiAlias: true,
    textQuality: "high" as "low" | "medium" | "high",
  })

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "png",
    quality: 0.95,
    width: originalWidth,
    height: originalHeight,
    pixelRatio: 1, // ZMENA: Default na 1
    antiAlias: true,
    textQuality: "high",
  })

  const [filename, setFilename] = useState("edited-image")
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<string>("")
  const [exportedResult, setExportedResult] = useState<{
    dataUrl: string
    data: ImageEditorData
    width: number
    height: number
  } | null>(null)

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      const fullFilename = `${filename}.${exportOptions.format}`
      await downloadImage(
        imageSrc,
        data,
        originalWidth,
        originalHeight,
        fullFilename,
        exportOptions,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )
      setExportStatus("✅ Obrázok bol stiahnutý!")
    } catch (error) {
      console.error("Export failed:", error)
      setExportStatus("❌ Chyba pri exporte")
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportToConsole = async () => {
    setIsExporting(true)
    setExportStatus("🔄 Exportujem do konzoly...")

    try {
      const fullFilename = `${filename}.${exportOptions.format}`
      const result = await exportComplete(
        imageSrc,
        data,
        originalWidth,
        originalHeight,
        fullFilename,
        exportOptions,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )

      console.group("🎨 Image Editor Export")
      console.log("📄 Filename:", fullFilename)
      console.log(
        "📐 Target Dimensions:",
        `${exportOptions.width || originalWidth}x${exportOptions.height || originalHeight}`,
      )
      console.log("📐 Actual Canvas:", `${result.canvas.width}x${result.canvas.height}`)
      console.log("🎯 Format:", exportOptions.format.toUpperCase())
      console.log("⚖️ Quality:", exportOptions.format === "png" ? "100%" : `${Math.round(exportOptions.quality * 100)}%`)
      console.log("🔍 Pixel Ratio:", exportOptions.pixelRatio)
      console.log("📦 File Size:", `${(result.file.size / 1024).toFixed(1)} KB`)
      if (cropData) {
        console.log("✂️ Crop Data:", cropData)
      }
      console.log("🔗 Data URL Length:", result.dataUrl.length)
      console.log("🖼️ Image Data URL:", result.dataUrl)
      console.log("📊 Interactive Data:", result.interactiveData)
      console.groupEnd()

      const img = new Image()
      img.src = result.dataUrl
      img.onload = () => {
        console.log("🖼️ Final Image Preview:", img)
        console.log(
          "%c ",
          `
          font-size: 1px; 
          padding: ${img.height / 4}px ${img.width / 4}px; 
          background-image: url(${result.dataUrl}); 
          background-size: contain; 
          background-repeat: no-repeat;
        `,
        )
      }

      setExportStatus("✅ Obrázok bol exportovaný do konzoly! Otvorte Developer Tools.")
    } catch (error) {
      console.error("Export failed:", error)
      setExportStatus("❌ Chyba pri exporte")
    } finally {
      setIsExporting(false)
    }
  }

  const handleCreateInteractivePreview = async () => {
    setIsExporting(true)
    setExportStatus("🔄 Vytváram interaktívny náhľad...")

    try {
      const fullFilename = `${filename}.${exportOptions.format}`
      const result = await exportComplete(
        imageSrc,
        data,
        originalWidth,
        originalHeight,
        fullFilename,
        exportOptions,
        cropData,
        originalImageWidth,
        originalImageHeight,
      )

      setExportedResult({
        dataUrl: result.dataUrl,
        data: result.interactiveData,
        width: exportOptions.width || originalWidth,
        height: exportOptions.height || originalHeight,
      })

      setExportStatus("✅ Interaktívny náhľad je pripravený!")
    } catch (error) {
      console.error("Export failed:", error)
      setExportStatus("❌ Chyba pri exporte")
    } finally {
      setIsExporting(false)
    }
  }

  const estimatedFileSize = () => {
    const finalWidth = (exportOptions.width || originalWidth) * (exportOptions.pixelRatio || 1)
    const finalHeight = (exportOptions.height || originalHeight) * (exportOptions.pixelRatio || 1)
    const pixels = finalWidth * finalHeight
    let sizeKB = 0

    switch (exportOptions.format) {
      case "png":
        sizeKB = (pixels * 4) / 1024
        break
      case "jpeg":
        sizeKB = (pixels * exportOptions.quality) / 1024
        break
      case "webp":
        sizeKB = (pixels * exportOptions.quality * 0.8) / 1024
        break
    }

    return sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Export Image
            {cropData && <span className="text-sm text-blue-600">(Orezané)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filename */}
          <div>
            <Label htmlFor="filename">Názov súboru</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="edited-image"
            />
          </div>

          {/* Format */}
          <div>
            <Label>Formát</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value: "png" | "jpeg" | "webp") => setExportOptions({ ...exportOptions, format: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (bezstratový)</SelectItem>
                <SelectItem value="jpeg">JPEG (menší súbor)</SelectItem>
                <SelectItem value="webp">WebP (najmenší)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quality (for JPEG/WebP) */}
          {(exportOptions.format === "jpeg" || exportOptions.format === "webp") && (
            <div>
              <Label>Kvalita: {Math.round(exportOptions.quality * 100)}%</Label>
              <Slider
                value={[exportOptions.quality]}
                onValueChange={([value]) => setExportOptions({ ...exportOptions, quality: value })}
                min={0.1}
                max={1}
                step={0.1}
                className="mt-2"
              />
            </div>
          )}

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width">Šírka</Label>
              <Input
                id="width"
                type="number"
                value={exportOptions.width || originalWidth}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    width: Number.parseInt(e.target.value) || originalWidth,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="height">Výška</Label>
              <Input
                id="height"
                type="number"
                value={exportOptions.height || originalHeight}
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    height: Number.parseInt(e.target.value) || originalHeight,
                  })
                }
              />
            </div>
          </div>

          {/* OPRAVENÉ: Zobrazenie skutočných rozmerov */}
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <div>
              <strong>Výsledné rozmery:</strong> {exportOptions.width || originalWidth} ×{" "}
              {exportOptions.height || originalHeight}px
            </div>
            <div>
              <strong>Canvas rozmery:</strong>{" "}
              {(exportOptions.width || originalWidth) * (exportOptions.pixelRatio || 1)} ×{" "}
              {(exportOptions.height || originalHeight) * (exportOptions.pixelRatio || 1)}px
            </div>
            <div>
              <strong>Odhadovaná veľkosť:</strong> {estimatedFileSize()}
            </div>
            {cropData && (
              <div className="text-xs text-blue-600 mt-1">
                ✂️ Crop: {Math.round(cropData.width)} × {Math.round(cropData.height)}px
              </div>
            )}
          </div>

          {/* Quality Settings */}
          <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
            <Label className="text-sm font-semibold">🎯 Nastavenia Kvality</Label>

            <div>
              <Label>Pixel Ratio: {qualitySettings.pixelRatio}x</Label>
              <Slider
                value={[qualitySettings.pixelRatio]}
                onValueChange={([value]) => {
                  setQualitySettings({ ...qualitySettings, pixelRatio: value })
                  setExportOptions({ ...exportOptions, pixelRatio: value })
                }}
                min={1}
                max={4}
                step={0.5}
                className="mt-2"
              />
              <div className="text-xs text-gray-600 mt-1">
                1x = normálna kvalita | 2x = retina kvalita | 4x = ultra kvalita
                <br />
                <strong>Pozor:</strong> Vyššie hodnoty zväčšujú canvas, nie finálny obrázok!
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="antiAlias">Anti-aliasing</Label>
              <Switch
                id="antiAlias"
                checked={qualitySettings.antiAlias}
                onCheckedChange={(checked) => {
                  setQualitySettings({ ...qualitySettings, antiAlias: checked })
                  setExportOptions({ ...exportOptions, antiAlias: checked })
                }}
              />
            </div>

            <div>
              <Label>Kvalita textu</Label>
              <Select
                value={qualitySettings.textQuality}
                onValueChange={(value: "low" | "medium" | "high") => {
                  setQualitySettings({ ...qualitySettings, textQuality: value })
                  setExportOptions({ ...exportOptions, textQuality: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Nízka (rýchle)</SelectItem>
                  <SelectItem value="medium">Stredná</SelectItem>
                  <SelectItem value="high">Vysoká (pomalé)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleCreateInteractivePreview}
              className="w-full"
              disabled={isExporting}
              variant="default"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              Vytvoriť Interaktívny Náhľad
            </Button>

            <Button
              onClick={handleExportToConsole}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Terminal className="w-4 h-4 mr-2" />}
              Export do Konzoly
            </Button>

            <Button onClick={handleDownload} variant="secondary" className="w-full" disabled={isExporting}>
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
              Stiahnuť
            </Button>
          </div>

          {/* Status */}
          {exportStatus && <div className="text-sm p-2 bg-blue-50 rounded border">{exportStatus}</div>}

          {/* Instructions */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 <strong>Tip:</strong> {cropData ? "Obrázok bude exportovaný s orezaním. " : ""}
            Pixel Ratio ovplyvňuje len kvalitu renderingu, nie finálne rozmery!
          </div>
        </CardContent>
      </Card>

      {/* Interactive Preview */}
      {exportedResult && (
        <InteractiveImageViewer
          src={exportedResult.dataUrl}
          data={exportedResult.data}
          width={exportedResult.width}
          height={exportedResult.height}
        />
      )}
    </div>
  )
}
