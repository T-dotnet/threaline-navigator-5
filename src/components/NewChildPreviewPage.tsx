import { motion } from "motion/react";
import { ArrowRight, BookOpen, CalendarClock, ClipboardList, LineChart, ListTodo, Upload, Users } from "lucide-react";
import { Page } from "../types";
import { useCurrentChild } from "../context/ChildContext";
import { QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from "../questionnaire";
import { getJourneyHomeCopy, hasReportContext } from "../lib/journeyCopy";
import { getChildSessionStatus, getSessionDate, isNewChildOnboardingComplete } from "../lib/childStatus";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { FadeInScroll } from "./ui/FadeInScroll";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { ActionPromptPanel } from "./ui/ActionPromptPanel";
import { Button } from "./ui/Button";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionDescription } from "./ui/SectionDescription";
import { TimelineStep } from "./ui/TimelineStep";
import { GuideCard } from "./ui/GuideCard";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { FirstSessionCard } from "./ui/FirstSessionCard";
import { ActionLink } from "./ui/ActionLink";

interface NewChildPreviewPageProps {
  onPageChange: (page: Page) => void;
  onOpenSetup?: (step?: 1 | 2 | 3 | 4 | 5 | "welcome") => void;
}

const previewSections = [
  {
    title: "Understanding",
    description: "A plain-language view of what the questionnaire answers are starting to show.",
    icon: Users,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[0],
    page: "understanding" as Page,
  },
  {
    title: "Priorities",
    description: "A plain-language guide to how Now, Next, and Later will be decided.",
    icon: ListTodo,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[1],
    page: "priorities" as Page,
  },
  {
    title: "Reviews",
    description: "A calmer review space for what you noticed and what to keep watching before the session.",
    icon: LineChart,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[2],
    page: "what-you-noticed" as Page,
  },
  {
    title: "Resources",
    description: "Short, practical preparation tools that match the intake stage without jumping to conclusions.",
    icon: BookOpen,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[3],
    page: "resources" as Page,
  },
];

export default function NewChildPreviewPage({ onPageChange, onOpenSetup }: NewChildPreviewPageProps) {
  const { currentChild } = useCurrentChild();
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = getCompletedQuestionnaireSections(answers);
  const isQuestionnaireComplete = completedSections.length === QUESTIONNAIRE_SECTIONS.length;
  const sessionStatus = getChildSessionStatus(currentChild);
  const isSessionBooked = sessionStatus === "booked";
  const isSessionCancelled = sessionStatus === "cancelled";
  const isAssessmentPending = isNewChildOnboardingComplete(currentChild);
  const firstSessionDate = getSessionDate(currentChild);
  const firstSessionTime = isSessionBooked ? currentChild.intake?.sessionTime || "4:00 pm" : undefined;
  const reportContext = hasReportContext(currentChild.intake?.availableInfo);
  const homeCopy = getJourneyHomeCopy(currentChild.name, currentChild.intake?.journeyStage, reportContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
          kicker={homeCopy.kicker}
          title={homeCopy.title}
          titleClassName="md:leading-[4.5rem]"
          titleWidthClassName="max-w-[17ch]"
          className="mb-12"
          description={
            <SectionDescription>
              {homeCopy.description}
            </SectionDescription>
          }
        />

        <div className="grid grid-cols-[2fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-6 mb-24">
          <HeroQuoteCard
            kicker="Navigator workspace"
            quote={homeCopy.quote}
            evidenceLevel={isAssessmentPending ? 3 : 1}
            evidenceText={isAssessmentPending ? "Setup completed" : "Setup in progress"}
            className="h-full"
            action={
              isAssessmentPending ? undefined : (
                <Button
                  variant="mint"
                  onClick={() => onOpenSetup?.()}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
                >
                  Continue setup
                </Button>
              )
            }
          />

          <FirstSessionCard
            date={firstSessionDate}
            time={firstSessionTime}
            isBooked={isSessionBooked}
            isCancelled={isSessionCancelled}
            onBook={() => onOpenSetup?.(5)}
            onReschedule={isSessionBooked ? () => onOpenSetup?.(5) : undefined}
          />
        </div>

        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>Workspace preview</SectionLabel>
            <SectionTitle>Understanding, priorities, reviews, and resources.</SectionTitle>
          </div>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 mt-8">
            {previewSections.map((section, index) => {
              const Icon = section.icon;
              const corners = ["rounded-tr-[32px]", "rounded-tl-[32px]", "rounded-br-[32px]", "rounded-bl-[32px]"];
              const hasContext = completedSections.includes(section.questionnaireSection);
              return (
                <div
                  key={section.title}
                  className={`overflow-hidden bg-white ${corners[index]} transition-all duration-300`}
                >
                  <div className="p-8">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 stroke-[1.8] text-[var(--color-thread-mid-green)]" />
                    </div>
                    <h3 className="font-serif text-[1.55rem] text-[var(--color-thread-heading)] mb-3 leading-snug">
                      {section.title}
                    </h3>
                    <p className="text-[0.95rem] leading-relaxed text-slate-600">
                      {section.description}
                    </p>
                    <div className="pt-4 mt-6">
                      <ActionLink
                        variant="slate"
                        as="button"
                        onClick={() => onPageChange(section.page)}
                        className="text-[0.84rem]"
                      >
                        Learn more
                      </ActionLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInScroll>

        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>Before the session</SectionLabel>
            <SectionTitle>{homeCopy.timelineTitle}</SectionTitle>
          </div>
          <div className="relative mt-1">
            <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />
            <TimelineStep
              done={isQuestionnaireComplete}
              active={!isQuestionnaireComplete}
              title="Finish the questionnaire"
              meta="Intake"
              metaTag={isQuestionnaireComplete ? "Completed" : "Now"}
              description={
                <div className="space-y-3">
                  <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
                    {homeCopy.questionnaireDescription}
                  </p>
                  <Button
                    type="button"
                    variant={isQuestionnaireComplete ? "muted" : "mint"}
                    className="min-h-[38px] px-4 py-2 text-[0.78rem]"
                    onClick={() => onOpenSetup?.(4)}
                    rightIcon={isQuestionnaireComplete ? <ArrowRight className="w-3.5 h-3.5 stroke-[2]" /> : <ClipboardList className="w-3.5 h-3.5 stroke-[2]" />}
                  >
                    {isQuestionnaireComplete ? "Review questionnaire" : "Continue questionnaire"}
                  </Button>
                </div>
              }
            />
            <TimelineStep
              active={!isSessionBooked && isQuestionnaireComplete}
              todo={!isSessionBooked && !isQuestionnaireComplete}
              done={isSessionBooked}
              title="Attend the first session"
              meta="Telehealth"
              metaTag={isSessionBooked ? "Booked" : isSessionCancelled ? "Cancelled" : isQuestionnaireComplete ? "Next" : "To book"}
              description={
                <div className="space-y-3">
                  <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
                    {isSessionBooked
                      ? homeCopy.sessionDescription
                      : isSessionCancelled
                      ? "The previous appointment was cancelled. Choose a new time when you are ready."
                      : "Choose a time for the first clinician session once you are ready. Booking can happen now or after you finish the questionnaire."}
                  </p>
                  <Button
                    type="button"
                    variant={isSessionBooked ? "muted" : "forest"}
                    className="min-h-[38px] px-4 py-2 text-[0.78rem]"
                    onClick={() => onOpenSetup?.(5)}
                    rightIcon={<CalendarClock className="w-3.5 h-3.5 stroke-[2]" />}
                  >
                    {isSessionBooked ? "Reschedule or cancel" : isSessionCancelled ? "Book new session" : "Book first session"}
                  </Button>
                </div>
              }
            />
          </div>
        </FadeInScroll>

        <FadeInScroll className="mb-24">
          <ActionPromptPanel
            label="Reports or information ready"
            title="Upload what you have. We'll help explain it."
            description={`If you already have reports, school notes, or other useful information for ${currentChild.name}, add them here now. Once they are uploaded, Threadline can help you understand the document more clearly before the first session.`}
            action={
              <HeroActionCard
                icon={<Upload className="w-[22px] h-[22px] stroke-[1.7]" />}
                title="Upload documents"
                subtitle="Add reports or notes"
                onClick={() => onPageChange("documents")}
              />
            }
          />
        </FadeInScroll>

        <FadeInScroll className="mb-16">
          <div>
            <SectionLabel>Helpful preparation</SectionLabel>
            <SectionTitle>{homeCopy.prepTitle}</SectionTitle>
            {homeCopy.prepDescription && (
              <SectionDescription>{homeCopy.prepDescription}</SectionDescription>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
            {homeCopy.prepCards === 'gentle' && (
              <>
                <GuideCard
                  category="Session prep"
                  title="Questions to bring to the call"
                  description="Keep a short list of what you want the clinician to understand first."
                  readTime="5 min"
                  cornerClass="rounded-tr-[32px]"
                />
                <GuideCard
                  category="Gentle next step"
                  title="Two things to notice"
                  description="What feels hardest right now, and when does the day feel easiest?"
                  readTime="3 min"
                  cornerClass="rounded-tl-[32px]"
                />
                <GuideCard
                  category="Observation"
                  title="What to notice this week"
                  description="Look for patterns around routines, transitions, sleep, school, and friendships."
                  readTime="6 min"
                  cornerClass="rounded-bl-[32px]"
                />
              </>
            )}
            {homeCopy.prepCards === 'support' && (
              <>
                <GuideCard
                  category="Session prep"
                  title="Questions to bring to the call"
                  description="Keep a short list of what support would help most after diagnosis."
                  readTime="5 min"
                  cornerClass="rounded-tr-[32px]"
                />
                <GuideCard
                  category="Support context"
                  title="What support already exists"
                  description="Plans, reports, school adjustments, and strategies already tried can help shape next steps."
                  readTime="4 min"
                  cornerClass="rounded-tl-[32px]"
                />
                <GuideCard
                  category="Observation"
                  title="What to notice this week"
                  description="Look for patterns around routines, transitions, sleep, school, and friendships."
                  readTime="6 min"
                  cornerClass="rounded-bl-[32px]"
                />
              </>
            )}
            {homeCopy.prepCards === 'documents' && (
              <>
                <GuideCard
                  category="Session prep"
                  title="Questions to bring to the call"
                  description="Keep a list of existing reports and observations that can make the assessment more useful."
                  readTime="5 min"
                  cornerClass="rounded-tr-[32px]"
                />
                <GuideCard
                  category="Assessment prep"
                  title="What to gather before assessment"
                  description="Collect reports, teacher notes, and recent observations so the session starts with the right context."
                  readTime="4 min"
                  cornerClass="rounded-tl-[32px]"
                />
                <GuideCard
                  category="Observation"
                  title="What to notice this week"
                  description="Look for patterns around routines, transitions, sleep, school, and friendships."
                  readTime="6 min"
                  cornerClass="rounded-bl-[32px]"
                />
              </>
            )}
          </div>
        </FadeInScroll>
      </PageContainer>

      <PageFooterCTA
        title={homeCopy.footerTitle}
        buttonText={homeCopy.footerButton}
        buttonIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
        onClick={() => onOpenSetup?.()}
      />
    </motion.div>
  );
}
