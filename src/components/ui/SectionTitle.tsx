import React from 'react';
import { cn } from '../../lib/utils';

interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className, ...props }: SectionTitleProps) {
  return (
    <h2 
      className={cn(
        "font-sans font-normal text-[2rem] leading-[1.05] tracking-[-1.12px] text-[var(--color-thread-heading)] mb-8",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
