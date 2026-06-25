import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | null;
  iconClassName?: string;
  variant?: 'default' | 'forest' | 'light' | 'slate';
  as?: 'button' | 'span' | 'a';
  // Extra typing helper to satisfy standard triggers/buttons
  onClick?: (e: React.MouseEvent<any>) => void;
  id?: string;
}

export const ActionLink = React.forwardRef<HTMLElement, ActionLinkProps>(
  ({ className, children, icon: Icon = ChevronRight, iconClassName, variant = 'default', as = 'button', onClick, id, ...props }, ref) => {
    const Component = as as any;

    const getVariantClasses = () => {
      // Map aliases to master styles: 'default' (primary brand green), 'light' (white)
      const resolvedVariant = 
        (variant === 'forest' || variant === 'slate') ? 'default' : variant;

      switch (resolvedVariant) {
        case 'light':
          return "text-white/95 hover:text-white font-sans";
        case 'default':
        default:
          return "text-[var(--color-thread-mid-green)] hover:opacity-85 font-sans";
      }
    };

    return (
      <Component
        ref={ref}
        id={id}
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 text-[0.84rem] font-semibold transition-all group/action cursor-pointer py-1.5 min-h-[32px]",
          getVariantClasses(),
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {Icon && (
          <Icon
            className={cn(
              "w-3.5 h-3.5 stroke-[2] transition-transform duration-200 group-hover/action:translate-x-0.5",
              iconClassName
            )}
          />
        )}
      </Component>
    );
  }
);

ActionLink.displayName = 'ActionLink';
