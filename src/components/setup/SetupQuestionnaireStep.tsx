import { motion } from "motion/react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { QUESTIONS, QUESTIONNAIRE_SECTIONS } from "../../questionnaire";

interface SetupQuestionnaireStepProps {
  title: string;
  description: string;
  answers: Record<string, any>;
  sectionKickerClass: string;
  stepHeadingClass: string;
  stepLeadClass: string;
  getSectionStatus: (sectionName: string) => string;
  onOpenSection: (sectionName: string) => void;
}

export function SetupQuestionnaireStep({
  title,
  description,
  answers,
  sectionKickerClass,
  stepHeadingClass,
  stepLeadClass,
  getSectionStatus,
  onOpenSection,
}: SetupQuestionnaireStepProps) {
  const completedSectionsCount = QUESTIONNAIRE_SECTIONS.filter(
    (section) => getSectionStatus(section) === "Completed",
  ).length;
  const totalQuestionsCount = Object.values(QUESTIONS).flat().length;
  const answeredQuestionsCount = Object.values(QUESTIONS).flat().filter((question) => {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    if (typeof answer === "string") return answer.trim() !== "";
    return true;
  }).length;
  const progressPercent = Math.round((answeredQuestionsCount / totalQuestionsCount) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <span className={sectionKickerClass}>Step 4 of 5 · Questionnaire</span>
        <h1 className={cn(stepHeadingClass, "max-w-none")}>{title}</h1>
        <p className={stepLeadClass}>{description}</p>
      </div>

      <div className="space-y-3">
        <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-tr-[24px] shadow-none flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative flex-shrink-0">
            <svg
              className="w-full h-full -rotate-90 absolute inset-0"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="var(--color-thread-mid-green)"
                strokeOpacity="0.15"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="var(--color-thread-mid-green)"
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - progressPercent / 100)}
                className="transition-all duration-500"
              />
            </svg>
            <span className="text-[0.72rem] font-medium text-[var(--color-thread-heading)] z-10">
              {progressPercent}%
            </span>
          </div>
          <div>
            <div className="font-medium text-[var(--color-thread-heading)] text-[0.92rem] mb-0.5">
              {completedSectionsCount} of 4 sections completed
            </div>
            <div className="text-[0.78rem] text-[var(--color-thread-gray)]">
              {answeredQuestionsCount} of {totalQuestionsCount} questions answered. Progress is saved.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-tr-[24px] overflow-hidden">
          {QUESTIONNAIRE_SECTIONS.map((section, index) => {
            const status = getSectionStatus(section);
            const isDone = status === "Completed";
            const questionCount = (QUESTIONS[section] || []).length;
            const isLocked = false;
            const isInProgress = !isDone && status !== "Not started";
            return (
              <button
                key={section}
                onClick={() => {
                  if (isLocked) return;
                  onOpenSection(section);
                }}
                disabled={isLocked}
                className={cn(
                  "w-full bg-white p-4 flex items-center gap-5 text-left transition-all group border-b border-black/5 last:border-b-0",
                  isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[var(--color-thread-off-white)]/40 cursor-pointer",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    isDone
                      ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                      : isLocked
                      ? "border-slate-200 text-slate-300 bg-slate-50"
                      : "border-slate-200 text-slate-400 bg-[var(--color-thread-off-white)] group-hover:bg-white group-hover:border-[var(--color-thread-mid-green)] group-hover:text-[var(--color-thread-mid-green)]",
                  )}
                >
                  {isDone ? <Check className="w-4 h-4" /> : isLocked ? <span className="text-slate-300">🔒</span> : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "font-sans font-medium text-[1.12rem] tracking-tight leading-[1.3]",
                      isLocked ? "text-slate-400" : "text-[var(--color-thread-dark-slate)]",
                    )}
                  >
                    {section}
                  </div>
                  <div className="text-[0.78rem] text-[var(--color-thread-gray)] mt-1.5 leading-relaxed">
                    {isLocked
                      ? `Complete "${QUESTIONNAIRE_SECTIONS[index - 1]}" to unlock`
                      : `${questionCount} questions`}
                  </div>
                </div>
                {!isLocked && (
                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className={cn(
                        "text-[0.6rem] font-medium inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-[0.12em] whitespace-nowrap",
                        isDone
                          ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
                          : status === "Not started"
                          ? "bg-[var(--color-thread-off-white)] text-slate-400"
                          : "bg-[var(--color-thread-cream)] text-[var(--color-thread-heading)]",
                      )}
                    >
                      {isDone && <Check className="w-3 h-3" />}
                      {isDone ? "Completed" : isInProgress ? status : "Start section"}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
