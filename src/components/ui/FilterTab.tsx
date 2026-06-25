import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { buttonPress } from "../../lib/motion-presets"

export interface FilterTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label: string;
}

export const FilterTab = React.forwardRef<HTMLButtonElement, FilterTabProps>(
  ({ className, active, label, onClick, ...props }, ref) => {
    return (
      <motion.button
        ref={ref as any}
        {...buttonPress}
        onClick={onClick}
        className={cn(
          "px-5 py-2.5 rounded-full text-[0.84rem] font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 min-h-[44px]",
          active
            ? "bg-[#E6F4ED] text-[var(--color-thread-mid-green)]"
            : "bg-white text-[var(--color-thread-gray)] hover:text-[var(--color-thread-dark-slate)]",
          className
        )}
        {...props}
      >
        {label}
      </motion.button>
    )
  }
)
FilterTab.displayName = "FilterTab"
