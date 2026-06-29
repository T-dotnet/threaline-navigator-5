import { CalendarClock } from "lucide-react";
import { cn } from "../../lib/utils";

interface FirstSessionCardProps {
  date?: string;
  time?: string;
  label?: string;
  detail?: string;
  provider?: string;
  isBooked?: boolean;
  isCancelled?: boolean;
  onBook?: () => void;
  onReschedule?: () => void;
  className?: string;
}

export function FirstSessionCard({
  date,
  time,
  label = "First session",
  detail = "Telehealth",
  provider = "Dr. Naomi Clark",
  isBooked = true,
  isCancelled = false,
  onBook,
  onReschedule,
  className,
}: FirstSessionCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] rounded-bl-[32px] p-7.5 flex flex-col h-full min-h-[260px]",
        className
      )}
    >
      <span className="text-[0.68rem] tracking-[0.12em] uppercase opacity-75 font-medium mb-5 block">
        {label}
      </span>
      <div className="w-12 h-12 rounded-full bg-[var(--color-thread-mid-green)] text-white flex items-center justify-center mb-6">
        <CalendarClock className="w-5 h-5 stroke-[1.8]" />
      </div>
      {isBooked ? (
        <>
          <div className="font-serif text-[2.4rem] leading-[1.05] tracking-tight text-[var(--color-thread-heading)]">
            {date}
          </div>
          <div className="mt-2 text-[1rem] opacity-75">
            {time}{detail ? ` · ${detail}` : ""}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-current/10 pt-5 text-[0.84rem]">
            <span className="opacity-70">{provider}</span>
            {onReschedule && (
              <button
                type="button"
                onClick={onReschedule}
                className="shrink-0 font-medium text-[var(--color-thread-mid-green)] underline underline-offset-2 decoration-current/40 transition hover:decoration-current"
              >
                Reschedule
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="font-serif text-[2.2rem] leading-[1.05] tracking-tight text-[var(--color-thread-heading)]">
            {isCancelled ? "Session cancelled" : "Session not booked"}
          </div>
          <p className="mt-3 text-[0.92rem] leading-relaxed opacity-70">
            {isCancelled
              ? "Choose a new time when you are ready."
              : "Choose a time for the first clinician session."}
          </p>
          {onBook && (
            <button
              type="button"
              onClick={onBook}
              className="mt-auto inline-flex items-center justify-center rounded-2xl bg-[var(--color-thread-mid-green)] text-white px-5 py-3 text-sm font-semibold transition hover:bg-[var(--color-thread-heading)]"
            >
              {isCancelled ? "Book new session" : "Book first session"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
