import React from 'react';
import { cn } from '../../lib/utils';

interface ValueCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  title: string;
  content: string | React.ReactNode;
  solid?: boolean;
  variant?: 'default' | 'mint' | 'white';
  cornerClass?: string;
}

export const ValueCard = React.forwardRef<HTMLDivElement, ValueCardProps>(
  ({ className, title, content, solid = false, variant = 'default', cornerClass = "rounded-[20px]", ...props }, ref) => {
    const isMint = variant === 'mint';
    const isWhite = variant === 'white';
    const isSolid = solid && variant === 'default';

    return (
      <div
        ref={ref}
        className={cn(
          "p-7.5 relative overflow-hidden",
          cornerClass,
          isSolid ? "bg-[var(--color-thread-mid-green)] text-white" :
          isMint ? "bg-[#E6F4ED] text-[var(--color-thread-darkest)]" :
          isWhite ? "bg-white text-[var(--color-thread-darkest)]" :
          "bg-[var(--color-thread-cream)] text-[var(--color-thread-darkest)]",
          className
        )}
        {...props}
      >
        <svg
          className="absolute -right-[70px] -top-[80px] opacity-15 pointer-events-none"
          width="240"
          height="240"
        >
          <circle
            cx="120"
            cy="120"
            r="48"
            fill="none"
            stroke={isSolid ? "white" : "black"}
            strokeOpacity={isSolid ? "1" : "0.2"}
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="120"
            r="82"
            fill="none"
            stroke={isSolid ? "white" : "black"}
            strokeOpacity={isSolid ? "1" : "0.2"}
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="120"
            r="116"
            fill="none"
            stroke={isSolid ? "white" : "black"}
            strokeOpacity={isSolid ? "1" : "0.2"}
            strokeWidth="1"
          />
        </svg>
        <h3 className="text-[1.18rem] font-semibold tracking-tight mb-2.5 relative">
          {title}
        </h3>
        {typeof content === 'string' ? (
          <p
            className={cn(
              "text-[0.92rem] leading-relaxed relative",
              isSolid ? "text-white/85" : "text-[var(--color-thread-gray)]",
            )}
          >
            {content}
          </p>
        ) : (
          <div className="relative text-[0.92rem]">
            {content}
          </div>
        )}
      </div>
    );
  }
);

ValueCard.displayName = 'ValueCard';
