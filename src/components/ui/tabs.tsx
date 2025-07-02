"use client"

import * as React from "react"

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: "",
  onValueChange: () => {},
})

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  style,
  ...props
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")

  const value = controlledValue ?? internalValue
  const handleValueChange = onValueChange ?? setInternalValue

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div style={{ width: "100%", ...style }} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        height: "40px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        backgroundColor: "#f1f5f9",
        padding: "4px",
        color: "#64748b",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ style, children, value: triggerValue, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(TabsContext)
  const isActive = value === triggerValue

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange(triggerValue)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "4px",
        padding: "6px 12px",
        fontSize: "14px",
        fontWeight: "500",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        backgroundColor: isActive ? "white" : "transparent",
        color: isActive ? "#0f172a" : "#64748b",
        boxShadow: isActive ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ style, children, value: contentValue, ...props }, ref) => {
    const { value } = React.useContext(TabsContext)

    if (value !== contentValue) return null

    return (
      <div
        ref={ref}
        style={{
          marginTop: "8px",
          outline: "none",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
