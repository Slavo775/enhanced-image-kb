import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, style, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      style={{
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "1",
        ...style,
      }}
      {...props}
    />
  ),
)
Label.displayName = "Label"

export { Label }
