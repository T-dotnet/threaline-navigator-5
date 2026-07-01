import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalShellProps {
  isOpen: boolean;
  titleId: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  maxWidthClassName?: string;
  radiusClassName?: string;
  zIndexClassName?: string;
}

interface ModalCloseButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  iconClassName?: string;
}

export function ModalCloseButton({
  onClick,
  label,
  className,
  iconClassName,
}: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-thread-off-white)] text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/30",
        className,
      )}
      aria-label={label}
    >
      <X className={cn("h-4 w-4 stroke-[2]", iconClassName)} />
    </button>
  );
}

export function ModalShell({
  isOpen,
  titleId,
  children,
  className,
  panelClassName,
  maxWidthClassName = "max-w-[760px]",
  radiusClassName = "rounded-tr-[42px] rounded-bl-[42px]",
  zIndexClassName = "z-[80]",
}: ModalShellProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 flex items-center justify-center overflow-y-auto bg-slate-950/35 px-4 py-6 backdrop-blur-sm",
            zIndexClassName,
            className,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={cn(
              "relative my-auto w-full overflow-hidden border border-black/5 bg-white shadow-modal",
              maxWidthClassName,
              radiusClassName,
              panelClassName,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
