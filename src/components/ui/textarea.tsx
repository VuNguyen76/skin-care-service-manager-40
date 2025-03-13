
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCharacterCount?: boolean;
  maxCharacters?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharacterCount, maxCharacters, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };
    
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onChange={showCharacterCount ? handleChange : onChange}
          {...props}
        />
        {showCharacterCount && (
          <div className={cn(
            "text-xs text-right mt-1",
            maxCharacters && charCount > maxCharacters ? "text-destructive" : "text-muted-foreground"
          )}>
            {charCount}{maxCharacters ? `/${maxCharacters}` : ""} characters
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
