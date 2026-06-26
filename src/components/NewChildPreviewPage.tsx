import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, LineChart, ListTodo, Lock, Milestone, Users } from "lucide-react";
import { Page } from "../types";
import { useCurrentChild } from "../context/ChildContext";
import { QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from "../questionnaire";
import { PageContainer } from "./ui/PageContainer";
import { PageHeader } from "./ui/PageHeader";
import { FadeInScroll } from "./ui/FadeInScroll";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { Button } from "./ui/Button";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionDescription } from "./ui/SectionDescription";
import { TimelineStep } from "./ui/TimelineStep";
import { GuideCard } from "./ui/GuideCard";
import { PageFooterCTA } from "./ui/PageFooterCTA";

interface NewChildPreviewPageProps {
  onPageChange: (page: Page) => void;
  onOpenSetup?: () => void;
}

const previewSections = [
  {
    title: "Understanding",
    category: "Clinical picture",
    description: "A clear synthesis of strengths, support needs, evidence sources, and what is still uncertain.",
    icon: Users,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[0],
    unlockedHint: "Home and family context added.",
  },
  {
    title: "Priorities",
    category: "What matters first",
    description: "A ranked view of where to focus, why it matters, and what can safely wait.",
    icon: ListTodo,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[1],
    unlockedHint: "Daily routine context added.",
  },
  {
    title: "Roadmap",
    category: "Next steps",
    description: "Practical actions for home, school, and appointments once the first formulation is ready.",
    icon: Milestone,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[2],
    unlockedHint: "School context added.",
  },
  {
    title: "Reviews",
    category: "Progress over time",
    description: "A review rhythm that tracks change without freezing the picture at the first report.",
    icon: LineChart,
    questionnaireSection: QUESTIONNAIRE_SECTIONS[3],
    unlockedHint: "Development history added.",
  },
];

export default function NewChildPreviewPage({ onPageChange, onOpenSetup }: NewChildPreviewPageProps) {
  const { currentChild } = useCurrentChild();
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = getCompletedQuestionnaireSections(answers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
          kicker="PREVIEW · ASSESSMENT PENDING"
          title={`What ${currentChild.name}'s dashboard will unlock.`}
          titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[17ch]"
          className="mb-12"
          description={
            <SectionDescription>
              The clinical pages stay limited until the first session and assessment are complete. Here is the shape of what will appear, without filling gaps with guesses.
            </SectionDescription>
          }
        />

        <HeroQuoteCard
          kicker="Pre-assessment mode"
          quote={`We're gathering the full picture for ${currentChild.name}. Once the questionnaire, documents, and first session are reviewed, these sections will open with real clinical context.`}
          evidenceLevel={1}
          evidenceText="Intake in progress"
          className="mb-24"
          action={
            <Button
              variant="forest"
              onClick={() => onOpenSetup?.()}
              rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
            >
              Continue setup
            </Button>
          }
        />

        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>Coming after assessment</SectionLabel>
            <SectionTitle>Four sections, one clear picture.</SectionTitle>
          </div>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 mt-8">
            {previewSections.map((section, index) => {
              const Icon = section.icon;
              const corners = ["rounded-tr-[32px]", "rounded-tl-[32px]", "rounded-br-[32px]", "rounded-bl-[32px]"];
              const hasContext = completedSections.includes(section.questionnaireSection);
              return (
                <div
                  key={section.title}
                  className={`bg-white border border-black/5 shadow-premium-light p-7.5 ${corners[index]} transition-all duration-300`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${
                    hasContext
                      ? "bg-[var(--color-thread-mid-green)]/10 text-[var(--color-thread-mid-green)]"
                      : "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]"
                  }`}>
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-2 block">
                    {section.category}
                  </span>
                  <h3 className="font-serif text-[1.45rem] text-[var(--color-thread-heading)] mb-2">
                    {section.title}
                  </h3>
                  <p className="text-[0.92rem] leading-relaxed text-slate-500">
                    {section.description}
                  </p>
                  <div className="mt-5">
                    {hasContext ? (
                      <div className="inline-flex items-center gap-2 text-[0.74rem] font-medium text-[var(--color-thread-mid-green)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {section.unlockedHint}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-[0.74rem] font-medium uppercase tracking-[0.12em] text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                        Opens after assessment
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInScroll>

        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>Before the session</SectionLabel>
            <SectionTitle>What helps now.</SectionTitle>
          </div>
          <div className="relative mt-1">
            <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />
            <TimelineStep
              active
              title="Finish the questionnaire"
              meta="Intake"
              metaTag="Now"
              description="Your everyday observations give the clinician useful context before the call."
            />
            <TimelineStep
              todo
              title="Add helpful documents during setup"
              meta="Setup"
              metaTag="Optional"
              description="Upload reports, school notes, or examples as part of setup. You can add more later."
            />
            <TimelineStep
              todo
              title="Attend the first session"
              meta="Telehealth"
              metaTag="Booked"
              description="After clinical review, the assessment pages will open with real priorities and next steps."
            />
          </div>
        </FadeInScroll>

        <FadeInScroll className="mb-16">
          <div>
            <SectionLabel>Helpful preparation</SectionLabel>
            <SectionTitle>Use these while the profile is forming.</SectionTitle>
          </div>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
            <GuideCard
              category="Session prep"
              title="Questions to bring to the call"
              description="Keep a short list of what you want the clinician to understand first."
              readTime="5 min"
              cornerClass="rounded-tr-[32px]"
            />
            <GuideCard
              category="Setup uploads"
              title="What is useful to add"
              description="Reports, school notes, examples of work, or observations from home can all help."
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
          </div>
        </FadeInScroll>
      </PageContainer>

      <PageFooterCTA
        title="Ready to add context before the session?"
        buttonText="Continue setup"
        buttonIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
        onClick={() => onOpenSetup?.()}
      />
    </motion.div>
  );
}
