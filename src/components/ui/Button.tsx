import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { buttonPress } from '../../lib/motion-presets';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'mint' | 'slate' | 'white' | 'muted' | 'link' | 'forest';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'mint', isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      mint: 'inline-flex items-center gap-1 bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] font-semibold text-[0.82rem] px-5 py-3 rounded-full hover:opacity-95 shadow-sm transition-all min-h-[44px]',
      slate: 'bg-[var(--color-thread-dark-slate)] text-white text-[0.98rem] font-semibold px-6 py-3.5 rounded-full hover:opacity-90 transition-all shadow-sm min-h-[48px]',
      white: 'inline-flex items-center gap-1 bg-white text-[var(--color-thread-mid-green)] font-semibold text-[0.82rem] px-5 py-3 rounded-full hover:bg-[var(--color-thread-off-white)] shadow-sm transition-all min-h-[44px]',
      muted: 'text-[0.84rem] font-semibold text-[var(--color-thread-gray)] hover:text-[var(--color-thread-heading)] bg-[var(--color-thread-off-white)] hover:bg-[var(--color-thread-light-green)] border border-black/5 px-4.5 py-2.5 rounded-full transition-colors whitespace-nowrap min-h-[40px]',
      link: 'text-[0.84rem] text-[var(--color-thread-dark-slate)] font-semibold border-b border-[var(--color-thread-dark-slate)] pb-0.5 hover:opacity-70 transition-all min-h-[32px] inline-flex items-center',
      forest: 'inline-flex items-center gap-1 bg-[var(--color-thread-mid-green)] text-white font-semibold text-[0.82rem] px-5 py-3 rounded-full hover:opacity-90 transition-all shadow-sm min-h-[44px]',
    };

    return (
      <motion.button
        ref={ref as any}
        {...buttonPress}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          variants[variant],
          className
        )}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-1.5 flex-shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-1.5 flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

