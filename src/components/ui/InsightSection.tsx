import * as React from "react";
import { cn } from "../../lib/utils";
import { FadeInScroll } from "./FadeInScroll";
import { ActionLink } from "./ActionLink";
import { InsightSectionProps } from "../../types";

export function InsightSection({
  kicker,
  title,
  description,
  image,
  actionText,
  onActionClick,
  className,
  reverse = false,
}: InsightSectionProps) {
  return (
    <div className={cn(
      "grid grid-cols-[1fr_2fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-12",
      className
    )}>
      <FadeInScroll 
        className={cn(
          "md:h-full md:flex md:flex-col",
          reverse ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
        )}
      >
        <div className="bg-white rounded-br-[32px] p-7.5 flex flex-col h-full">
          <span className="text-[0.66rem] tracking-[0.14em] uppercase text-[var(--color-thread-mid-green)] font-bold mb-6">
            {kicker}
          </span>
          <h3 className="text-[1.8rem] font-medium tracking-tight leading-tight mb-4 text-slate-900">
            {title}
          </h3>
          <p className="text-[1.05rem] text-slate-500 leading-relaxed mb-8 flex-1">
            {description}
          </p>
          {actionText && (
            <div className="mt-auto">
              <ActionLink variant="default" as="button" onClick={onActionClick}>
                {actionText}
              </ActionLink>
            </div>
          )}
        </div>
      </FadeInScroll>

      <FadeInScroll 
        delay={0.1} 
        className={cn(
          "md:h-full md:flex md:flex-col",
          reverse ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"
        )}
      >
        <div className="rounded-tl-[36px] overflow-hidden h-[400px]">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </FadeInScroll>
    </div>
  );
}
