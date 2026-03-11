# react-enhanced-image

React canvas image editor — pan, zoom, rotation, SVG/PNG stickers, mentions, locations and image export.

## Installation

```bash
npm install react-enhanced-image
# or
pnpm add react-enhanced-image
# or
yarn add react-enhanced-image
```

**Peer dependencies** — install alongside the package:
```bash
npm install react react-dom zustand
```

## Quick start

```tsx
import { EnhancedImage, useStickers, useImageExporter } from 'react-enhanced-image'

function App() {
  const { addSticker, addMentionSticker, addLocationSticker } = useStickers('my-canvas')
  const { exportFinalImage } = useImageExporter('my-canvas')

  const handleExport = async () => {
    const result = await exportFinalImage()
    console.log(result?.dataUrl) // base64 PNG
  }

  return (
    <>
      <EnhancedImage
        id="my-canvas"
        image={imageDataUrl}
        cropWidth={600}
        cropHeight={600}
        zoom={100}
        rotation={0}
      />

      <button onClick={() => addMentionSticker('john')}>@john</button>
      <button onClick={() => addLocationSticker('Bratislava')}>📍 Bratislava</button>
      <button onClick={handleExport}>Export</button>
    </>
  )
}
```

## API

### `<EnhancedImage />`

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique canvas identifier — must match `useStickers` and `useImageExporter` |
| `image` | `string` | Image source as data URL or HTTP URL |
| `cropWidth` | `number` | Canvas width in pixels |
| `cropHeight` | `number` | Canvas height in pixels |
| `zoom` | `number` | Initial zoom level (100 = 100%) |
| `rotation` | `number` | Initial rotation in degrees |
| `brightness` | `number` | Initial brightness (0–200, 100 = default). Adjustable at runtime via `useCanvas` |
| `contrast` | `number` | Initial contrast (0–200, 100 = default). Adjustable at runtime via `useCanvas` |

### `useStickers(canvasId)`

```ts
const {
  stickers,                  // StickerInput[] | undefined — current stickers
  selectedSticker,           // string | undefined — selected sticker id
  addSticker,                // (svgString | dataUrl: string) => void
  addMentionSticker,         // (username: string) => void — renders @username pill
  addLocationSticker,        // (locationName: string) => void — renders 📍 location pill
  removeSticker,             // (id: string) => void
  setSelectedSticker,        // (id?: string) => void
  updateSticker,             // (sticker: StickerInput) => void
  updateAllStickers,         // (stickers: StickerInput[]) => void
  undo,                      // () => void
  redo,                      // () => void
  canUndo,                   // boolean
  canRedo,                   // boolean
  copySelectedSticker,       // () => void — copies selected sticker to clipboard
  pasteSticker,              // () => void — pastes clipboard sticker (+15px offset)
  duplicateSelectedSticker,  // () => void — duplicate in place (+15px offset)
} = useStickers('my-canvas')
```

### `useImageExporter(canvasId)`

```ts
const { exportFinalImage } = useImageExporter('my-canvas')

const result = await exportFinalImage()
```

`result` is `FinalImageResult | null`:

```ts
type FinalImageResult = {
  dataUrl: string           // base64 PNG — the full rendered canvas (image + all stickers)
  metaData: {
    stickers: StickerInput[] // all stickers at time of export with their positions and sizes
  }
}
```

**Use case — save & restore sticker positions:**

```ts
// Export
const result = await exportFinalImage()
const flat = result.dataUrl          // send to server / display in <img>
const layout = result.metaData.stickers // save to DB to restore later

// Restore — pass stickers back via updateAllStickers
const { updateAllStickers } = useStickers('my-canvas')
updateAllStickers(layout)
```

### `StickerInput`

```ts
type StickerInput = {
  id: string
  type: 'sticker' | 'mention' | 'location' | 'emoji'
  src: string        // data URL for images, username/location name for text types
  x: number
  y: number
  width: number
  height: number
  payload?: Record<string, unknown>
}
```

## Sticker types

| Type | `src` value | Renders |
|------|------------|---------|
| `sticker` | SVG string or data URL (PNG/JPG) | Image on canvas |
| `mention` | username without `@` | `@username` dark pill |
| `location` | location name | Red dot + location name dark pill |
| `emoji` | emoji character or text | Text rendered directly |

## Gestures

| Gesture | Action |
|---------|--------|
| Mouse drag | Pan image |
| Mouse wheel | Zoom in/out |
| Two-finger pinch | Zoom in/out (touch) |
| Single finger drag | Pan image (touch) |
| Click sticker | Select sticker |
| Drag selected sticker | Move sticker |
| Drag corner handle | Resize sticker |

## Development

```bash
pnpm install
pnpm dev      # demo app at localhost:5173
pnpm build    # build library to dist/
pnpm lint
```

## License

MIT
