# React Image Editor

A powerful, lightweight React image editor component with drag-and-drop functionality, stickers, cropping, and export capabilities.

## Features

- 🖼️ **Image Upload** - Drag & drop or click to upload images
- ✂️ **Crop Tool** - Select and crop image areas
- 🎭 **Stickers** - Add emojis, text, mentions, and locations
- 🔄 **Image Controls** - Scale, rotation, opacity, filters
- 📱 **Mobile Support** - Touch-friendly interactions
- 💾 **Export** - Download PNG or copy to clipboard
- 🎨 **No Dependencies** - Pure React with inline styles

## Installation

\`\`\`bash
npm install react-image-editor
# or
pnpm install react-image-editor
# or
yarn add react-image-editor
\`\`\`

## Usage

\`\`\`tsx
import { ImageEditor } from 'react-image-editor'

function App() {
  const handleStateChange = (state) => {
    console.log('Editor state:', state)
  }

  const handleExport = (canvas) => {
    // Handle the exported canvas
    console.log('Exported canvas:', canvas)
  }

  return (
    <ImageEditor
      width={600}
      height={400}
      onStateChange={handleStateChange}
      onExport={handleExport}
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `600` | Canvas width in pixels |
| `height` | `number` | `400` | Canvas height in pixels |
| `onStateChange` | `(state: EditorState) => void` | - | Called when editor state changes |
| `onExport` | `(canvas: HTMLCanvasElement) => void` | - | Called when image is exported |

## Development

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
\`\`\`

## License

MIT
