import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

const SETUP_STEPS = [
  { num: 1, title: "Journey", desc: "Where you are now" },
  { num: 2, title: "Your child", desc: "Name & date of birth" },
  { num: 3, title: "Hardest right now", desc: "Top areas" },
  { num: 4, title: "Questionnaire", desc: "Everyday life" },
  { num: 5, title: "Your session", desc: "Book a video call" },
];

interface SetupStepperProps {
  activeStep: number;
  heading: string;
}

export function SetupStepper({ activeStep, heading }: SetupStepperProps) {
  const currentStep = SETUP_STEPS.find((step) => step.num === activeStep) ?? SETUP_STEPS[0];
  const progressPercent = ((activeStep - 1) / (SETUP_STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-4 md:block">
        <div className="text-[0.72rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium md:mb-8">
          {heading}
        </div>
        <div className="md:hidden text-[0.72rem] font-medium text-slate-400 whitespace-nowrap">
          Step {activeStep} of {SETUP_STEPS.length}
        </div>
      </div>

      <div className="md:hidden mt-4 rounded-tr-[24px] bg-[var(--color-thread-off-white)]/70 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center text-sm font-medium flex-shrink-0">
            {activeStep}
          </div>
          <div className="min-w-0">
            <div className="text-[0.98rem] font-medium text-[var(--color-thread-heading)] leading-tight">
              {currentStep.title}
            </div>
            <div className="text-[0.8rem] text-slate-500 leading-snug mt-1">
              {currentStep.desc}
            </div>
          </div>
        </div>

        <div className="relative mt-5 px-1">
          <div className="absolute left-4 right-4 top-3 h-0.5 bg-black/10" />
          <div
            className="absolute left-4 top-3 h-0.5 bg-[var(--color-thread-mid-green)] transition-all duration-500"
            style={{ width: `calc((100% - 2rem) * ${progressPercent / 100})` }}
          />
          <div className="relative z-10 grid grid-cols-5 gap-1">
            {SETUP_STEPS.map((step) => {
              const isPast = activeStep > step.num;
              const isCurrent = activeStep === step.num;

              return (
                <div key={step.num} className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[0.68rem] font-medium border-2 bg-white transition-colors",
                      isPast
                        ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                        : isCurrent
                        ? "border-[var(--color-thread-mid-green)] text-[var(--color-thread-mid-green)] shadow-[0_0_0_4px_var(--color-thread-light-green)]"
                        : "border-slate-200 text-slate-400",
                    )}
                    aria-label={`${step.title}: ${isPast ? "complete" : isCurrent ? "current" : "up next"}`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span
                    className={cn(
                      "text-[0.64rem] leading-tight text-center",
                      isCurrent || isPast ? "text-[var(--color-thread-heading)]" : "text-slate-400",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hidden md:block space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/5">
        {SETUP_STEPS.map((step) => {
          const isPast = activeStep > step.num;
          const isCurrent = activeStep === step.num;
          return (
            <div key={step.num} className="flex gap-4 relative z-10">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-medium border-2 transition-colors bg-[var(--color-thread-off-white)]",
                  isPast
                    ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                    : isCurrent
                    ? "border-[var(--color-thread-mid-green)] text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)] shadow-[0_0_0_4px_var(--color-thread-light-green)]"
                    : "border-slate-200 text-slate-400 bg-white",
                )}
              >
                {isPast ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <div>
                <div
                  className={cn(
                    "text-[0.92rem] font-medium mb-0.5 transition-colors",
                    isCurrent || isPast ? "text-[var(--color-thread-heading)]" : "text-slate-400",
                  )}
                >
                  {step.title}
                </div>
                <div
                  className={cn(
                    "text-[0.78rem] transition-colors",
                    isCurrent ? "text-slate-500" : "text-slate-400",
                  )}
                >
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
