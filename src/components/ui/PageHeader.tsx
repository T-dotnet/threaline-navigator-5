import React from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: string;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  titleClassName?: string;
  kickerClassName?: string;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, kicker, title, description, action, titleClassName, kickerClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-24', className)} {...props}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            {kicker && (
              <span className={cn(
                "text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-5 block",
                kickerClassName
              )}>
                {kicker}
              </span>
            )}
            <h1 className={cn(
              "font-serif font-normal text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] tracking-[-0.075rem] text-[var(--color-thread-heading)] max-w-[22ch]",
              titleClassName
            )}>
              {title}
            </h1>
            {description && (
              <div className="mt-4.5">
                {typeof description === 'string' ? (
                  <p className="text-[0.98rem] text-[var(--color-thread-gray)] max-w-[55ch] leading-relaxed">
                    {description}
                  </p>
                ) : (
                  description
                )}
              </div>
            )}
          </div>
          {action && (
            <div className="pt-2 md:self-end flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';

