import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { ChevronRight } from 'lucide-react';
import { buttonPress } from '../../lib/motion-presets';

interface ListItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function ListItemCard({ children, className, active, ...props }: ListItemCardProps) {
  return (
    <motion.div 
      {...buttonPress}
      className={cn(
        "flex-1 flex items-center justify-between rounded-full px-5 py-3 transition-all group min-h-[44px]",
        active 
          ? "bg-[#E6F4ED] text-[var(--color-thread-mid-green)]" 
          : "bg-white text-[var(--color-thread-gray)] hover:bg-[var(--color-thread-off-white)] cursor-pointer",
        className
      )}
      {...(props as any)}
    >
      <span className="text-[0.92rem] font-medium text-[var(--color-thread-dark-slate)]">{children}</span>
      <ChevronRight className={cn(
        "w-4 h-4 stroke-[1.8] transition-colors",
        active ? "text-[var(--color-thread-mid-green)]" : "text-slate-400 group-hover:text-[var(--color-thread-mid-green)]"
      )} />
    </motion.div>
  );
}
