import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimelineStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  meta: string;
  metaTag?: string;
  description: string | React.ReactNode;
  done?: boolean;
  active?: boolean;
  todo?: boolean;
  titleClassName?: string;
}

export const TimelineStep = React.forwardRef<HTMLDivElement, TimelineStepProps>(
  ({ className, titleClassName, title, meta, metaTag, description, done = false, active = false, todo = false, ...props }, ref) => {
    // If no metaTag is provided, auto-calculate it based on step state
    const resolvedMetaTag = metaTag || (done ? "Done" : active ? "In progress" : "To do");

    return (
      <div
        ref={ref}
        className={cn("relative grid grid-cols-[24px_1fr] gap-4.5 pb-6.5", className)}
        {...props}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center shadow-[0_0_0_4px_var(--color-thread-off-white)] z-[2] flex-shrink-0 transition-all",
            done && "bg-[var(--color-thread-mid-green)] text-white",
            active && "bg-white border-2 border-[var(--color-thread-mid-green)]",
            todo && "bg-white border-2 border-black/10",
          )}
        >
          {done && <Check className="w-[13px] h-[13px] stroke-[3]" />}
          {active && (
            <div className="w-2 h-2 rounded-full bg-[var(--color-thread-mid-green)]" />
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={cn(
              "text-[1.12rem] font-medium tracking-tight leading-[1.3] text-[var(--color-thread-dark-slate)]",
              done && "text-[var(--color-thread-placeholder)]",
              titleClassName,
            )}
          >
            {title}
          </div>
          <div className="flex gap-3.5 flex-wrap items-center mt-1.5 text-[0.78rem] text-[var(--color-thread-gray)]">
            <span className="text-[0.6rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)]">
              {resolvedMetaTag}
            </span>
            <span>{meta}</span>
          </div>
          {typeof description === 'string' ? (
            <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed mt-2 max-w-[60ch]">
              {description}
            </p>
          ) : (
            <div className="mt-2 max-w-[60ch]">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TimelineStep.displayName = 'TimelineStep';
