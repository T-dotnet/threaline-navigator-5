import * as React from "react"
import { motion } from "motion/react"
import { cn } from "../../lib/utils"
import { ActionLink } from "./ActionLink"
import { GuideCardProps } from "../../types"
import { scaleHover } from "../../lib/motion-presets"

export function GuideCard({
  category,
  title,
  description,
  readTime,
  image,
  cornerClass = "rounded-tr-[32px]",
  actionText = "Read guide",
  onClick,
  disableHover = false,
  className,
}: GuideCardProps) {
  return (
    <motion.div
      {...(disableHover ? {} : scaleHover)}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "bg-white flex flex-col cursor-pointer transition-all group overflow-hidden",
        cornerClass,
        className
      )}
    >
      {image && (
        <div className="w-full aspect-[16/9] overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              !disableHover && "group-hover:scale-105"
            )}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[1.12rem] font-medium tracking-tight leading-[1.3] mb-1.5 text-[var(--color-thread-dark-slate)] font-sans">
          {title}
        </h3>
        <div className="flex gap-3.5 flex-wrap items-center mb-3 text-[0.78rem] text-[var(--color-thread-gray)] font-sans">
          <span className="text-[0.6rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)]">
            {category}
          </span>
          <span>{readTime}</span>
        </div>
        <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed flex-1 font-sans">
          {description}
        </p>
        <div className="flex items-center justify-between pt-4 mt-6">
          <ActionLink
            variant="slate"
            as="span"
            className={cn(
              "font-medium text-[0.84rem]",
              !disableHover && "group-hover:text-[var(--color-thread-mid-green)]"
            )}
          >
            {actionText}
          </ActionLink>
        </div>
      </div>
    </motion.div>
  );
}
