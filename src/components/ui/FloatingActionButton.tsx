import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export function FloatingActionButton({
  icon,
  label,
  className,
  type = "button",
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "fixed right-6 bottom-6 z-[70] w-14 h-14 rounded-full bg-[var(--color-thread-mid-green)] text-white shadow-[0_18px_40px_-12px_rgba(16,133,96,0.45)] hover:opacity-92 transition-all flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/30",
        className,
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
