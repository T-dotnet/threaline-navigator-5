import * as React from "react"
import { cn } from "../../lib/utils"

export interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  fallback?: React.ReactNode;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ className, fallback, src, alt, size = "md", ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold transition-all overflow-hidden shrink-0",
        {
          "w-[32px] h-[32px] text-[0.82rem]": size === "sm",
          "w-[40px] h-[40px] text-[0.86rem]": size === "md",
          "w-[44px] h-[44px] text-[0.86rem]": size === "lg",
        },
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  )
}
