"use client"

import { useState } from "react"
import { ImageEditor } from "../components/ImageEditor"
import type { EditorState } from "../types"
import "../styles/index.css"

function App() {
  const [editorState, setEditorState] = useState<EditorState | null>(null)

  const handleStateChange = (state: EditorState) => {
    console.log("Editor state changed:", state)
    setEditorState(state)
  }

  const handleExport = async (canvas: HTMLCanvasElement) => {
    console.log("Image exported:", canvas)
    alert("Obrázok bol úspešne exportovaný! 🎉")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#fff",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              margin: "0 0 12px 0",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🎨 React Image Editor Demo
          </h1>
          <p style={{ fontSize: "18px", margin: "0", opacity: 0.9 }}>
            Vytvor úžasné obrázky s interaktívnymi prvkami! 🚀
          </p>
        </div>

        <ImageEditor width={800} height={600} onStateChange={handleStateChange} onExport={handleExport} />

        {editorState && editorState.image && (
          <div
            style={{
              maxWidth: "800px",
              margin: "30px auto 0",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ color: "#333", marginBottom: "20px", fontSize: "22px", fontWeight: "600" }}>
              📊 Editor Statistics
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {editorState.image.originalWidth} × {editorState.image.originalHeight}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Original Size</div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #f093fb, #f5576c)",
                  color: "#fff",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{editorState.stickers.length}</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Stickers</div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
                  color: "#fff",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{editorState.mentions.length}</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Mentions</div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                  color: "#fff",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{editorState.locations.length}</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Locations</div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #fa709a, #fee140)",
                  color: "#fff",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{editorState.cropPreset?.name || "Custom"}</div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Crop Format</div>
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #a8edea, #fed6e3)",
                  color: "#333",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>{Math.round(editorState.image.scale * 100)}%</div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>Image Scale</div>
              </div>
            </div>

            <details style={{ marginTop: "20px" }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#667eea",
                  fontSize: "16px",
                  padding: "8px 0",
                }}
              >
                🔍 View Complete JSON State
              </summary>
              <pre
                style={{
                  fontSize: "11px",
                  overflow: "auto",
                  backgroundColor: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  marginTop: "12px",
                  border: "1px solid #e9ecef",
                  maxHeight: "400px",
                  lineHeight: "1.4",
                  color: "#333",
                }}
              >
                {JSON.stringify(editorState, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
