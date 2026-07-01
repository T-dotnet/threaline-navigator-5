import React from 'react';
import { cn } from '../../lib/utils';
import { EvidenceBadge } from './EvidenceBadge';
import { ActionLink } from './ActionLink';
import { ArrowRight } from 'lucide-react';

interface AreaItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  impact?: string;
  evidence?: number;
  status?: string;
  icon?: React.ReactNode;
  description: string | React.ReactNode;
  sources?: string[];
  actionText?: string;
  onAction?: () => void;
  actionPlacement?: 'footer' | 'header' | 'after-sources';
}

export const AreaItem = React.forwardRef<HTMLDivElement, AreaItemProps>(
  ({ className, title, impact = "", evidence, status, icon, description, sources, actionText, onAction, actionPlacement = 'footer', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-t border-black/10 py-6 px-0.5", className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4.5 max-md:flex-wrap">
          <div>
            <div className="text-[1.22rem] font-medium tracking-tight text-[var(--color-thread-dark-slate)]">
              {title}
            </div>
            {impact && (
              <div className="text-[0.78rem] text-[var(--color-thread-gray)] mt-1 font-sans">
                {impact}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end flex-shrink-0 pt-1">
            {evidence !== undefined && (
              <EvidenceBadge
                level={evidence}
                layout="col"
                align="end"
                variant="default"
                labelClassName="font-medium"
              />
            )}
            {status && (
              <span
                className={cn(
                  "text-[0.6rem] tracking-[0.1em] uppercase font-medium px-2.75 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap mt-0.75",
                  (status === "Suggested" || status === "Strength" || status === "Complete") &&
                    "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]",
                  (status === "Optional" || status === "Steady") &&
                    "bg-[var(--color-thread-off-white)] text-[var(--color-thread-gray)] border border-black/10",
                  (status === "In place" || status === "Improving") &&
                    "bg-[var(--color-thread-mid-green)] text-white",
                  status === "Emerging" &&
                    "bg-[var(--color-thread-cream)] text-[var(--color-thread-darkest)]",
                )}
              >
                {icon}
                {status}
              </span>
            )}
            {actionText && onAction && actionPlacement === 'header' && (
              <ActionLink
                variant="forest"
                as="button"
                onClick={onAction}
                icon={ArrowRight}
                className="text-[0.84rem] mt-0.75"
              >
                {actionText}
              </ActionLink>
            )}
          </div>
        </div>
        
        {typeof description === 'string' ? (
          <div className="mt-3 max-w-[62ch]">
            <p className="text-[0.96rem] text-[var(--color-thread-gray)] leading-relaxed font-sans">
              {description}
            </p>
            {actionText && onAction && actionPlacement === 'footer' && (
              <ActionLink
                variant="forest"
                as="button"
                onClick={onAction}
                icon={ArrowRight}
                className="text-[0.84rem] mt-4"
              >
                {actionText}
              </ActionLink>
            )}
          </div>
        ) : (
          <div className="mt-3">
            {description}
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="flex gap-1.75 flex-wrap mt-3.5">
            {sources.map((s: string) => (
              <span
                key={s}
                className="text-[0.7rem] text-[var(--color-thread-gray)] border border-black/10 rounded-full px-2.5 py-1"
              >
                <strong className="text-[var(--color-thread-dark-slate)] font-medium">
                  {s}
                </strong>
              </span>
            ))}
          </div>
        )}

        {actionText && onAction && actionPlacement === 'after-sources' && (
          <ActionLink
            variant="forest"
            as="button"
            onClick={onAction}
            icon={ArrowRight}
            className="text-[0.84rem] mt-4"
          >
            {actionText}
          </ActionLink>
        )}
      </div>
    );
  }
);

AreaItem.displayName = 'AreaItem';
