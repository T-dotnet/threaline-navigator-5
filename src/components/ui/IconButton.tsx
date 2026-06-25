import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { buttonPress } from "../../lib/motion-presets"

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hasBadge?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, hasBadge, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref as any}
        {...buttonPress}
        type="button"
        className={cn(
          "w-11 h-11 rounded-full bg-white border border-black/10 flex items-center justify-center text-slate-900 relative cursor-pointer hover:border-black/20 transition-all group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 shrink-0",
          className
        )}
        {...(props as any)}
      >
        {hasBadge && (
          <span className="absolute top-[10px] right-[11px] w-[7px] h-[7px] rounded-full bg-[var(--color-thread-mid-green)] border-2 border-white shadow-sm" />
        )}
        {children}
      </motion.button>
    )
  }
)
IconButton.displayName = "IconButton"
