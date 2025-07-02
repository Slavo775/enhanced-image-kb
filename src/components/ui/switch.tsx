"use client"

import type React from "react"

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
  style?: React.CSSProperties
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, id, style }) => {
  const switchStyles: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px",
    backgroundColor: checked ? "#3b82f6" : "#d1d5db",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    border: "none",
    outline: "none",
    ...style,
  }

  const thumbStyles: React.CSSProperties = {
    position: "absolute",
    top: "2px",
    left: checked ? "22px" : "2px",
    width: "20px",
    height: "20px",
    backgroundColor: "white",
    borderRadius: "50%",
    transition: "left 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  }

  return (
    <button id={id} style={switchStyles} onClick={() => onCheckedChange(!checked)} role="switch" aria-checked={checked}>
      <div style={thumbStyles} />
    </button>
  )
}
