import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import { ProgressBar } from "./ProgressBar";

interface PlanProgressCardProps {
  progress: number;
  statusText: string;
  nextReview: string;
  className?: string;
  title?: string;
}

export function PlanProgressCard({
  progress,
  statusText,
  nextReview,
  className,
  title = "This Quarter's Plan Progress",
}: PlanProgressCardProps) {
  const parts = statusText.split(" — ");
  const mainStatus = parts[0];
  const subStatus = parts[1];

  return (
    <div
      className={cn(
        "bg-[var(--hero-secondary-bg)] text-[var(--hero-secondary-text)] rounded-bl-[32px] p-7.5 flex flex-col h-full",
        className
      )}
    >
      <span className="text-[0.68rem] tracking-[0.12em] uppercase opacity-75 font-bold mb-5 block flex-shrink-0">
        {title}
      </span>
      
      <div className="flex flex-col gap-1 mb-5.5">
        <div className="font-serif text-[4rem] leading-[4rem] tracking-[-2.2px]">
          {progress}%
        </div>
        <div className="text-[1.125rem] opacity-80 leading-snug">
          {mainStatus} —<br />
          <span className="opacity-75 text-[0.95em]">{subStatus}</span>
        </div>
      </div>
      
      <div className="flex flex-col mt-auto">
        <div className="mb-5.5">
          <ProgressBar
            value={progress}
            max={100}
            heightClass="h-3"
            isSecondary
            colorClass="bg-[var(--hero-secondary-text)]"
          />
        </div>
        
        <div className="flex items-center gap-2 text-[0.84rem] opacity-60 border-t border-current/10 pt-4.5">
          <Calendar className="w-4 h-4 stroke-[1.8]" />
          <span>
            Next review:{" "}
            <strong className="opacity-100 font-semibold ml-1">
              {nextReview}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
