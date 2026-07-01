import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { TimelineStep } from "../ui/TimelineStep";

interface SetupCompleteStepProps {
  reflectedChildName: string;
  mirroredJourneyStage: string;
  mirroredHardestAreasSentence: string;
  mirroredAvailableInfoSentence: string;
  navigatorHelp: string;
  nextStep: string;
  sessionDay: string;
  isAppointmentCancelled: boolean;
  sectionKickerClass: string;
  stepHeadingClass: string;
  stepLeadClass: string;
  onBack: () => void;
  onViewProfile: () => void;
  onSetupAnotherChild: () => void;
}

export function SetupCompleteStep({
  reflectedChildName,
  mirroredJourneyStage,
  mirroredHardestAreasSentence,
  mirroredAvailableInfoSentence,
  navigatorHelp,
  nextStep,
  sessionDay,
  isAppointmentCancelled,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  onBack,
  onViewProfile,
  onSetupAnotherChild,
}: SetupCompleteStepProps) {
  const sessionTitle = sessionDay
    ? `Your session — Thu ${sessionDay} Jun`
    : isAppointmentCancelled
    ? "Your session — Session cancelled"
    : "Your session — Session not booked";

  return (
    <>
      <div className="w-full md:w-3/5 p-8 sm:p-12 md:p-14 flex flex-col justify-between gap-10">
        <div className="space-y-8 sm:space-y-10">
          <div>
            <span className={sectionKickerClass}>Reflection</span>
            <h1 className={cn(stepHeadingClass, "max-w-[18ch]")}>
              Thank you. We&apos;ve got enough to get started.
            </h1>
            <p className={stepLeadClass}>Here&apos;s what we&apos;ve understood so far, based only on what you shared.</p>
          </div>

          <div className="bg-[var(--color-thread-off-white)]/70 p-6 rounded-tr-[24px] flex flex-col gap-5">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                  {mirroredJourneyStage}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                  {mirroredHardestAreasSentence}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                  {mirroredAvailableInfoSentence}
                </p>
              </div>
            </div>

            <div className="border-t border-black/5 pt-5">
              <div className="text-[0.6rem] tracking-[0.12em] uppercase text-slate-400 font-medium mb-2">How Navigator can help</div>
              <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
                {navigatorHelp}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-black/5 w-full flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={onBack}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Button
            onClick={onViewProfile}
            variant="mint"
            className="px-8 shadow-none w-full sm:w-auto"
          >
            See {reflectedChildName} profile <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="w-full md:w-2/5 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex flex-col justify-start space-y-8 overflow-y-auto">
        <div>
          <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-6 block">What happens next</span>
          <div className="relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black/5">
            <TimelineStep
              title="Before your session"
              meta="Questionnaire"
              metaTag="Step 1"
              titleClassName="text-[0.92rem] tracking-normal leading-[1.35] text-[var(--color-thread-heading)]"
              description={nextStep}
              active
            />
            <TimelineStep
              title={sessionTitle}
              meta="Telehealth"
              metaTag="Step 2"
              titleClassName="text-[0.92rem] tracking-normal leading-[1.35] text-[var(--color-thread-heading)]"
              description="Meet Dr. Clark on a video call from home."
              todo
            />
            <TimelineStep
              title="After your session"
              meta="Results"
              metaTag="Step 3"
              titleClassName="text-[0.92rem] tracking-normal leading-[1.35] text-[var(--color-thread-heading)]"
              description="She reviews everything, then your result and first priorities appear."
              todo
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-tr-[24px] border border-black/5 shadow-none">
          <h4 className="font-medium text-[var(--color-thread-heading)] text-sm mb-1">Setting up another child?</h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Each child has their own session, context, and next steps.</p>
          <Button variant="muted" className="w-full text-xs py-2" onClick={onSetupAnotherChild}>
            Set up another child
          </Button>
        </div>
      </div>
    </>
  );
}
