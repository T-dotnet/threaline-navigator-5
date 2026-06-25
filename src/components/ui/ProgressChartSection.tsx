import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { SectionLabel } from "./SectionLabel";
import { SectionTitle } from "./SectionTitle";
import { SectionDescription } from "./SectionDescription";
import { FadeInScroll } from "./FadeInScroll";
import { ProgressChartSectionProps } from "../../types";

export function ProgressChartSection({
  label,
  title,
  chartLabel,
  chartSubtitle,
  data,
  description,
  xAxisLabels,
  activeLabelIndex,
  className,
}: ProgressChartSectionProps) {
  return (
    <FadeInScroll className={cn("mb-24", className)}>
      <div>
        <SectionLabel className="mb-2">
          {label}
        </SectionLabel>
        <SectionTitle>
          {title}
        </SectionTitle>
      </div>

      <div className="bg-[var(--color-thread-light-green)] border-[var(--color-thread-light-gray)] rounded-tr-[36px] p-7.5 pb-4">
        <SectionLabel className="mb-2">
          {chartLabel}
        </SectionLabel>
        <h3 className="text-[1.15rem] font-semibold tracking-tight text-[var(--color-thread-dark-slate)] mb-5.5">
          {chartSubtitle}
        </h3>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-thread-mid-green)"
                    stopOpacity={0.14}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-thread-mid-green)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide={true} />
              <YAxis hide={true} domain={[0, 200]} reversed />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-thread-mid-green)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-3 text-[0.72rem] text-[var(--color-thread-gray)] px-2 tracking-[0.03em] uppercase font-medium">
          {xAxisLabels.map((label, i) => (
            <span 
              key={i} 
              className={cn(
                i === activeLabelIndex && "font-bold text-[var(--color-thread-dark-slate)]"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <SectionDescription className="mt-6">
        {description}
      </SectionDescription>
    </FadeInScroll>
  );
}
