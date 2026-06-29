import { useState } from "react";
import { motion } from "motion/react";
import { Clock, ClipboardList, Download, Lock, Users, ArrowRight } from "lucide-react";
import { getChildData } from "../data";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { ValueCard } from "./ui/ValueCard";
import { AreaItem } from "./ui/AreaItem";
import { FadeInScroll } from "./ui/FadeInScroll";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { GuideCard } from "./ui/GuideCard";
import { ActionLink } from "./ui/ActionLink";
import { QuestionnaireModal } from "./ui/QuestionnaireModal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { QUESTIONS, QUESTIONNAIRE_SECTIONS, formatAnswer, getAnsweredCount, getCompletedQuestionnaireSections, normalizeQuestionnaireSectionName } from "../questionnaire";

import img2912 from "../assets/images/IMG_2912.jpeg";
import img2947 from "../assets/images/IMG_2947.jpeg";
import creativePlayImg from "../assets/images/optimized/classroom-fatigue-900.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";
import { getJourneyUnderstandingCopy } from "../lib/journeyCopy";

function answerText(answers: Record<string, unknown>, id: string) {
  return formatAnswer(answers[id]).trim();
}

function LockedQuestionnaireSection({
  answeredCount,
  onStart,
  questionCount,
}: {
  answeredCount: number;
  onStart: () => void;
  questionCount: number;
}) {
  return (
    <Card className="rounded-tr-[32px]">
      <CardHeader className="flex flex-row items-start justify-between gap-5 p-7.5 pb-0">
        <div>
          <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-2 block">
            Locked
          </span>
          <CardTitle className="font-serif font-normal text-[1.45rem] leading-tight">
            Nothing recorded yet.
          </CardTitle>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
          <Lock className="w-4.5 h-4.5" />
        </div>
      </CardHeader>
      <CardContent className="p-7.5 pt-5">
        <p className="text-[0.92rem] leading-relaxed text-slate-500 mb-5 max-w-[56ch]">
          Answer all {questionCount} questions in this section to open it here.{answeredCount > 0 ? ` ${answeredCount} answered so far.` : ""}
        </p>
        <ActionLink
          variant="forest"
          onClick={onStart}
          icon={ArrowRight}
          className="text-[0.84rem]"
        >
          {answeredCount > 0 ? "Continue section" : "Start section"}
        </ActionLink>
      </CardContent>
    </Card>
  );
}

export default function UnderstandingPage({
  onPageChange,
  onOpenSetup,
}: {
  onPageChange: (page: any) => void;
  onOpenSetup?: () => void;
}) {
  const { currentChild, updateChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const [activeQuestionnaireSection, setActiveQuestionnaireSection] = useState<string | null>(null);
  const data = getChildData(currentChild).understanding;
  const isNoahStarting = isPlanNotStarted(currentChild);
  const showParentClarity = isParentClarity && !currentChild.isNew && !isMaintenancePhase(currentChild) && !isNoahStarting;
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = (currentChild.intake?.completedQuestionnaireSections || getCompletedQuestionnaireSections(answers)).map(normalizeQuestionnaireSectionName);
  const completedCount = completedSections.length;
  const totalSections = QUESTIONNAIRE_SECTIONS.length;
  const progress = Math.round((completedCount / totalSections) * 100);
  const firstIncompleteSection = QUESTIONNAIRE_SECTIONS.find((section) => !completedSections.includes(section));
  const journeyUnderstandingCopy = getJourneyUnderstandingCopy(currentChild.name, currentChild.intake?.journeyStage);
  const strengthsSectionName = QUESTIONNAIRE_SECTIONS[0];
  const seeingSectionName = QUESTIONNAIRE_SECTIONS[1];
  const isStrengthsUnlocked = completedSections.includes(strengthsSectionName);
  const isSeeingUnlocked = completedSections.includes(seeingSectionName);
  const strengthsAnsweredCount = getAnsweredCount(strengthsSectionName, answers);
  const seeingAnsweredCount = getAnsweredCount(seeingSectionName, answers);
  const strengthsQuestionCount = QUESTIONS[strengthsSectionName]?.length || 0;
  const seeingQuestionCount = QUESTIONS[seeingSectionName]?.length || 0;

  const saveQuestionnaireAnswers = (updatedAnswers: Record<string, unknown>) => {
    updateChild({
      ...currentChild,
      intake: {
        ...currentChild.intake,
        questionnaireAnswers: updatedAnswers,
        completedQuestionnaireSections: getCompletedQuestionnaireSections(updatedAnswers),
      },
    });
  };

  // After saving a section, advance to the next incomplete section (or close modal if all done)
  const saveQuestionnaireAnswersAndAdvance = (updatedAnswers: Record<string, unknown>) => {
    saveQuestionnaireAnswers(updatedAnswers);
    const completed = getCompletedQuestionnaireSections(updatedAnswers);
    const next = QUESTIONNAIRE_SECTIONS.find((section) => !completed.includes(section)) || null;
    setActiveQuestionnaireSection(next);
  };

  if (currentChild.isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-16"
      >
        <PageContainer>
          <PageHeader
            kicker={journeyUnderstandingCopy.kicker}
            title={journeyUnderstandingCopy.title}
            titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[16ch]"
            className="mb-14"
            description={
              <div className="flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
                  Intake in progress
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
                  Built from questionnaire answers
                </span>
              </div>
            }
          />

          <HeroQuoteCard
            kicker="The picture so far"
            quote={journeyUnderstandingCopy.quote}
            evidenceLevel={completedCount > 0 ? 2 : 1}
            evidenceText={`${completedCount} of ${totalSections} sections unlocked`}
            className="mb-16"
            rightNode={
              <HeroActionCard
                icon={<ClipboardList className="w-[22px] h-[22px] stroke-[1.7]" />}
                title={`${progress}%`}
                subtitle="Questionnaire progress"
              />
            }
          />

          <FadeInScroll className="mb-24">
            <div>
              <SectionLabel>
                What's going well
              </SectionLabel>
              <SectionTitle>
                Strengths to build on.
              </SectionTitle>
            </div>

            {isStrengthsUnlocked ? (
              <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
                <GuideCard
                  category="Strength"
                  title={answerText(answers, "attention_focus") || "Strengths emerging"}
                  description={`${currentChild.name} seems most confident or settled here. This gives the first session something positive to build from.`}
                  readTime=""
                  image={creativePlayImg}
                  cornerClass="rounded-tr-[32px]"
                  actionText="Review answers"
                  onClick={() => setActiveQuestionnaireSection(strengthsSectionName)}
                />
                <GuideCard
                  category="Support that helps"
                  title={answerText(answers, "behaviour_emotions") || "Helpful support"}
                  description="This is the kind of support that may help the day feel safer, calmer, or easier to restart."
                  readTime=""
                  image={img2947}
                  cornerClass="rounded-tl-[32px]"
                  actionText="Review answers"
                  onClick={() => setActiveQuestionnaireSection(strengthsSectionName)}
                />
                <GuideCard
                  category="Best rhythm"
                  title={answerText(answers, "sleep") || "Best part of the day"}
                  description="Knowing when things tend to go best helps the clinician understand what already works."
                  readTime=""
                  image={img2912}
                  cornerClass="rounded-bl-[32px]"
                  actionText="Review answers"
                  onClick={() => setActiveQuestionnaireSection(strengthsSectionName)}
                />
              </div>
            ) : (
              <div className="mt-8">
                <LockedQuestionnaireSection
                  answeredCount={strengthsAnsweredCount}
                  onStart={() => setActiveQuestionnaireSection(strengthsSectionName)}
                  questionCount={strengthsQuestionCount}
                />
              </div>
            )}
          </FadeInScroll>

          <FadeInScroll className="mb-24">
            <div>
              <SectionLabel>
                What you're seeing
              </SectionLabel>
              <SectionTitle>
                Areas affecting {currentChild.name}'s day.
              </SectionTitle>
            </div>

            {isSeeingUnlocked ? (
              <div className="border-b border-black/10">
                <AreaItem
                  title={answerText(answers, "learning") || "Hardest right now"}
                  impact=""
                  description="This is the area that feels hardest at the moment, based on the intake answer."
                  actionText="See questionnaire answers"
                  actionPlacement="header"
                  onAction={() => setActiveQuestionnaireSection(seeingSectionName)}
                  sources={["Questionnaire"]}
                />
                <AreaItem
                  title={answerText(answers, "movement_coordination") || "Support needed"}
                  impact=""
                  description="This shows where extra scaffolding, reassurance, or practical support may be most useful."
                  actionText="See questionnaire answers"
                  actionPlacement="header"
                  onAction={() => setActiveQuestionnaireSection(seeingSectionName)}
                  sources={["Questionnaire"]}
                />
                <AreaItem
                  title={answerText(answers, "speech_communication") || "Overload signal"}
                  impact=""
                  description={`This is how ${currentChild.name} may show that something is becoming too much.`}
                  actionText="See questionnaire answers"
                  actionPlacement="header"
                  onAction={() => setActiveQuestionnaireSection(seeingSectionName)}
                  sources={["Questionnaire"]}
                />
              </div>
            ) : (
              <div className="mt-8">
                <LockedQuestionnaireSection
                  answeredCount={seeingAnsweredCount}
                  onStart={() => setActiveQuestionnaireSection(seeingSectionName)}
                  questionCount={seeingQuestionCount}
                />
              </div>
            )}
          </FadeInScroll>

          <FadeInScroll className="grid grid-cols-2 gap-6 mb-24 max-md:grid-cols-1">
            <ValueCard
              variant="mint"
              title={journeyUnderstandingCopy.firstValueTitle}
              content={journeyUnderstandingCopy.firstValue}
              cornerClass="rounded-tr-[32px]"
            />
            <ValueCard
              variant="white"
              title={journeyUnderstandingCopy.secondValueTitle}
              content={journeyUnderstandingCopy.secondValue}
              cornerClass="rounded-bl-[32px]"
            />
          </FadeInScroll>
        </PageContainer>

        <PageFooterCTA
          title={completedCount === totalSections ? journeyUnderstandingCopy.footerTitle : "Keep adding context before the session."}
          buttonText={completedCount === totalSections ? "Back to home" : "Continue questionnaire"}
          onClick={() => completedCount === totalSections ? onPageChange("home") : setActiveQuestionnaireSection(firstIncompleteSection || QUESTIONNAIRE_SECTIONS[0])}
        />

        <QuestionnaireModal
          isOpen={Boolean(activeQuestionnaireSection)}
          section={activeQuestionnaireSection}
          answers={answers}
          childName={currentChild.name}
          onClose={() => setActiveQuestionnaireSection(null)}
          onSave={saveQuestionnaireAnswersAndAdvance}
        />

      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Understanding · What's happening"
        title={`A clear picture of how ${currentChild.name} is doing.`}
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[16ch]"
        className="mb-24"
        description={
          <div className="flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Updated 14 June 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Brought together from 4 sources
            </span>
          </div>
        }
      />

      {/* Picture Card */}
      <HeroQuoteCard
        kicker="The picture so far"
        quote={showParentClarity ? `${currentChild.name} is bright and socially steady. The clearest support need right now is classroom focus, and sleep is worth watching because tired mornings may make attention harder.` : data.description}
        evidenceLevel={3}
        evidenceText="Strong, consistent evidence"
        className="mb-24"
        rightNode={
          <HeroActionCard
            icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
            title="Report"
            subtitle="Download PDF"
          />
        }
      />

      {/* Strengths Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What's going well
          </SectionLabel>
          <SectionTitle>
            Strengths to build on.
          </SectionTitle>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
          <GuideCard
            category={isNoahStarting ? "Settled Strength" : "High Competency"}
            title={isNoahStarting ? "Pattern spotting" : "Creative Play"}
            description={isNoahStarting ? "Noah notices routines, details and changes quickly. This can become a useful anchor when the first support plan starts." : "Displays rich imaginative flow, abstract play and artistic task retention. A real strength to integrate into curriculum pathways."}
            readTime=""
            image={creativePlayImg}
            cornerClass="rounded-tr-[32px]"
            actionText="Explore strength"
          />
          <GuideCard
            category={isNoahStarting ? "Good Foundation" : "Exceptional Grasp"}
            title={isNoahStarting ? "Clear one-to-one learning" : "Verbal Comprehension"}
            description={isNoahStarting ? "Noah responds well when instructions are calm, direct and given one step at a time. That gives the starter plan something practical to build on." : "Excellent grasp of spoken guidelines and a highly adaptive communicative scope. Enthusiastic sharing is seen daily."}
            readTime=""
            image={img2947}
            cornerClass="rounded-tl-[32px]"
            actionText="Explore strength"
          />
          <GuideCard
            category={isNoahStarting ? "Protective Factor" : "Active Skillset"}
            title={isNoahStarting ? "Warm adult connection" : "Social Empathy"}
            description={isNoahStarting ? "Noah accepts support best when the adult relationship feels predictable. Keeping that connection steady should help the first routine land." : "Deep sensitivity to family members and primary playground buddies. Welcomes constructive social feedback loop cues."}
            readTime=""
            image={img2912}
            cornerClass="rounded-bl-[32px]"
            actionText="Explore strength"
          />
        </div>
      </FadeInScroll>

      {/* Areas Affecting Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What you're seeing
          </SectionLabel>
          <SectionTitle>
            {showParentClarity ? `What affects ${currentChild.name}'s day most.` : `Areas affecting ${currentChild.name}'s day.`}
          </SectionTitle>
        </div>

        <div className="border-b border-black/10">
          {data.focusAreas.map((area, idx) => (
            <AreaItem
              key={idx}
              title={area.title}
              impact=""
              evidence={3}
              description={area.description}
              sources={area.sources}
            />
          ))}
        </div>
      </FadeInScroll>

      {/* Values Section */}
      <FadeInScroll className="grid grid-cols-2 gap-6 mb-24 max-md:grid-cols-1">
        <ValueCard
          variant="mint"
          title="Evidence → formulation"
          content="Every insight here is traced to its source and reviewed by a qualified clinician — not generated in isolation. Where the evidence is strong, we say so plainly."
          cornerClass="rounded-tr-[32px]"
        />
        <ValueCard
          variant="white"
          title="Honest about uncertainty"
          content="Where the evidence isn't strong enough, we don't force a conclusion. 'More to explore' is a valid, useful result — and the picture keeps building as new information arrives."
          cornerClass="rounded-bl-[32px]"
        />
      </FadeInScroll>

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="Understanding what's happening is the start."
        buttonText="See what matters most"
        onClick={() => onPageChange("priorities")}
      />
    </motion.div>
  );
}
