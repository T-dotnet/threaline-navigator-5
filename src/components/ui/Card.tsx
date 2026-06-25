import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  delay?: number;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animated = false, delay = 0, hoverable = false, ...props }, ref) => {
    const baseClasses = cn(
      'bg-white rounded-2xl overflow-hidden relative',
      hoverable && 'hover:-translate-y-0.5 transition-all duration-300',
      className
    );

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay }}
          className={baseClasses}
          {...(props as unknown as HTMLMotionProps<'div'>)}
        />
      );
    }

    return <div ref={ref} className={baseClasses} {...props} />;
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-4 sm:p-7 sm:pb-5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-serif font-bold text-[var(--color-thread-heading)]', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0 sm:p-7 sm:pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';
