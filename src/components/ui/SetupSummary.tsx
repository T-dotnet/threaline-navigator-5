import React from 'react';
import { Check, ArrowRight, FileText, Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCurrentChild } from '../../context/ChildContext';
import { QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from '../../questionnaire';

interface SetupSummaryProps {
  childName: string;
  onContinueQuestionnaire?: () => void;
  onReviewUnderstanding?: () => void;
  className?: string;
}

export function SetupSummary({ childName, onContinueQuestionnaire, onReviewUnderstanding, className }: SetupSummaryProps) {
  const { currentChild } = useCurrentChild();
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = currentChild.intake?.completedQuestionnaireSections || getCompletedQuestionnaireSections(answers);
  const remainingSections = Math.max(0, QUESTIONNAIRE_SECTIONS.length - completedSections.length);
  const isQuestionnaireComplete = remainingSections === 0;

  return (
    <div className={cn("bg-white rounded-3xl border border-black/5 shadow-premium overflow-hidden", className)}>
      <div className="p-8 sm:p-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left side: Status */}
          <div className="flex-1 space-y-8">
            <div>
              <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-3 block">Setup status</span>
              <h3 className="font-serif font-normal text-2xl text-[var(--color-thread-heading)] mb-2">Great progress, Sarah.</h3>
              <p className="text-slate-500 text-sm">You've completed most of the setup for {childName}. A few tasks remain before your session.</p>
            </div>

            <div className="space-y-4">
              {/* Step 1: Your child */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400">Step 1</div>
                  <div className="font-medium text-slate-900 text-sm">{childName}'s profile created</div>
                </div>
              </div>

              {/* Step 2: What you notice */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400">Step 2</div>
                  <div className="font-medium text-slate-900 text-sm">Concerns & notes recorded</div>
                </div>
              </div>

              {/* Step 3: Session */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400">Step 3</div>
                  <div className="font-medium text-slate-900 text-sm">Telehealth session booked</div>
                </div>
              </div>

              {/* Step 4: Questionnaire */}
              <div className={cn(
                "flex items-center justify-between gap-4 p-4 rounded-2xl border",
                isQuestionnaireComplete ? "bg-[var(--color-thread-light-green)]/45 border-transparent" : "bg-amber-50/50 border-amber-100"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isQuestionnaireComplete
                      ? "bg-[var(--color-thread-mid-green)] text-white"
                      : "border-2 border-amber-500 text-amber-500"
                  )}>
                    {isQuestionnaireComplete ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">!</span>}
                  </div>
                  <div>
                    <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400">Step 4</div>
                    <div className="font-medium text-slate-900 text-sm">
                      {isQuestionnaireComplete
                        ? "Questionnaire complete"
                        : `Questionnaire: ${remainingSections} sections left`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={isQuestionnaireComplete ? onReviewUnderstanding : onContinueQuestionnaire}
                  className={cn(
                    "text-xs font-bold flex items-center gap-1 group",
                    isQuestionnaireComplete ? "text-[var(--color-thread-mid-green)] hover:text-[var(--color-thread-heading)]" : "text-amber-600 hover:text-amber-700"
                  )}
                >
                  {isQuestionnaireComplete ? "Review" : "Complete"} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Step 5: Documents */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-thread-mid-green)] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400">Step 5</div>
                  <div className="font-medium text-slate-900 text-sm">Initial documents uploaded</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Session Info */}
          <div className="w-full md:w-72 space-y-6">
            <div className="bg-[var(--color-thread-off-white)] p-6 rounded-2xl border border-black/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-thread-mid-green)] shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400">Session</div>
                  <div className="font-serif text-lg text-[var(--color-thread-heading)]">Thu 26 June</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>4:00 pm (AEST)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Telehealth link sent to email</span>
                </div>
              </div>
            </div>

            <div className="p-2">
              <p className="text-[0.7rem] text-slate-400 leading-relaxed italic">
                A clinician will review your questionnaire and documents 24 hours before your session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
