import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { ChecklistItemProps } from "../../types";

export function ChecklistItem({
  title,
  description,
  className,
  icon = <Check className="w-[13px] h-[13px] stroke-[3]" />,
}: ChecklistItemProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-thread-mid-green)] text-white flex items-center justify-center mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="text-[1.05rem] font-bold tracking-tight text-slate-900">
          {title}
        </h4>
        <p className="text-[0.9rem] text-slate-500 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}
