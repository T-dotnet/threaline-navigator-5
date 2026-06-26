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
import { ListItemCard } from "./ui/ListItemCard";
import { InsightSection } from "./ui/InsightSection";
import { QUESTIONS, QUESTIONNAIRE_SECTIONS, formatAnswer, getAnsweredCount, getCompletedQuestionnaireSections } from "../questionnaire";

import img2912 from "../assets/images/IMG_2912.jpeg";
import img2947 from "../assets/images/IMG_2947.jpeg";
import homeFamilyWatercolorImg from "../assets/images/home_family_watercolor.png";
import creativePlayImg from "../assets/images/classroom_fatigue_thumbnail_1781935350699.jpg";
import empathyImg from "../assets/images/breathing_exercises_thumbnail_1781935364678.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";

const newChildUnderstandingSections = [
  {
    name: "Home & family",
    label: "Family context",
    title: "Home life and the people around them.",
    summary: "This helps the clinician understand daily support, family transitions, and what brings joy at home.",
    image: homeFamilyWatercolorImg,
  },
  {
    name: "Daily routines",
    label: "Everyday rhythm",
    title: "Sleep, mornings, meals, and regulation load.",
    summary: "Routines often reveal where the day is flowing smoothly and where small supports may help.",
    image: img2912,
  },
  {
    name: "At school",
    label: "Learning setting",
    title: "School participation and peer context.",
    summary: "School answers begin to show how learning, confidence, friendships, and support fit together.",
    image: creativePlayImg,
  },
  {
    name: "Development & history",
    label: "Developmental picture",
    title: "Communication, sensory patterns, and strengths.",
    summary: "This section adds the developmental background the clinician needs before drawing conclusions.",
    image: empathyImg,
  },
];

function answerPreview(sectionName: string, answers: Record<string, unknown>, childName: string) {
  return (QUESTIONS[sectionName] || [])
    .map((question) => ({
      question: question.text.replace(/\$\{childName\}/g, childName),
      answer: formatAnswer(answers[question.id]),
    }))
    .filter((item) => item.answer.trim() !== "");
}

function answerText(answers: Record<string, unknown>, id: string) {
  return formatAnswer(answers[id]).trim();
}

function buildSectionAnalysis(sectionName: string, answers: Record<string, unknown>, childName: string) {
  if (sectionName === "Home & family") {
    const livesWith = answerText(answers, "family_live_with");
    const relationship = answerText(answers, "family_relationship").toLowerCase();
    const transitions = answerText(answers, "family_transitions").toLowerCase();
    const interests = answerText(answers, "family_interests");
    return `${childName}'s home context is now anchored: living arrangements, caregiver relationship, recent transitions, and motivating interests are all recorded. The strongest thread is ${interests ? `what keeps ${childName} engaged, including ${interests}` : relationship || "the family support pattern"}, with ${transitions || "recent stressors"} noted for clinical review.`;
  }

  if (sectionName === "Daily routines") {
    const bedtime = answerText(answers, "routines_bedtime").toLowerCase();
    const sleep = answerText(answers, "routines_sleep").toLowerCase();
    const morning = answerText(answers, "routines_morning").toLowerCase();
    const eating = answerText(answers, "routines_eating").toLowerCase();
    return `Daily rhythm is now visible: bedtime is marked as ${bedtime}, typical sleep is ${sleep}, mornings ${morning}, and mealtimes are ${eating}. This gives the clinician a first read on where effort builds up across the day.`;
  }

  if (sectionName === "At school") {
    const setting = answerText(answers, "school_type").toLowerCase();
    const feeling = answerText(answers, "school_feeling").toLowerCase();
    const social = answerText(answers, "school_social").toLowerCase();
    const support = answerText(answers, "school_support").toLowerCase();
    return `School context is ready to review: ${childName}'s setting is ${setting}, school feeling is ${feeling}, peer interaction is ${social}, and support is currently ${support}. This starts to separate learning context from home routines.`;
  }

  const sensory = answerText(answers, "dev_sensory").toLowerCase();
  const communication = answerText(answers, "dev_communication").toLowerCase();
  const regulation = answerText(answers, "dev_regulation").toLowerCase();
  const strengths = answerText(answers, "dev_strengths");
  return `Developmental context is now outlined: sensory notes include ${sensory}, communication is described as ${communication}, and regulation is ${regulation}. Strengths such as ${strengths || "the parent-noted positives"} give the clinician useful starting points.`;
}

function buildSectionConnectionDescription(sectionName: string, answers: Record<string, unknown>, childName: string) {
  const bedtime = answerText(answers, "routines_bedtime").toLowerCase();
  const schoolFeeling = answerText(answers, "school_feeling").toLowerCase();
  const social = answerText(answers, "school_social").toLowerCase();
  const regulation = answerText(answers, "dev_regulation").toLowerCase();
  const communication = answerText(answers, "dev_communication").toLowerCase();
  const interests = answerText(answers, "family_interests");
  const transitions = answerText(answers, "family_transitions").toLowerCase();

  if (sectionName === "Home & family") {
    return `Home context gives the rest of the intake its anchor. ${interests ? `${childName}'s interests, including ${interests}, can become useful motivators` : "Motivating interests and family routines can become useful supports"}, while ${transitions || "recent family transitions"} may help explain pressure points that show up in routines, school confidence, or regulation.`;
  }

  if (sectionName === "Daily routines") {
    return `Routines often show where the day is already using most of its energy. Bedtime is marked as ${bedtime || "part of the intake picture"}, and that rhythm may shape how ${childName} arrives at school, handles peer demands, and recovers after hard moments.`;
  }

  if (sectionName === "At school") {
    return `School answers show how home and development appear in a busier setting. Feeling ${schoolFeeling || "about school"}, interacting with peers as ${social || "described by the family"}, and current supports all help the clinician separate environment fit from skill development.`;
  }

  return `Developmental history gives the intake its deeper pattern. ${childName}'s communication is described as ${communication || "part of the profile"} and regulation as ${regulation || "part of the profile"}, which helps explain why routines, school participation, and family supports may need to be matched carefully.`;
}

export default function UnderstandingPage({
  onPageChange,
  onOpenSetup,
}: {
  onPageChange: (page: any) => void;
  onOpenSetup?: () => void;
}) {
  const { currentChild, updateChild } = useCurrentChild();
  const [activeQuestionnaireSection, setActiveQuestionnaireSection] = useState<string | null>(null);
  const [activeConnectionSection, setActiveConnectionSection] = useState("Home & family");
  const data = getChildData(currentChild).understanding;
  const answers = currentChild.intake?.questionnaireAnswers || {};
  const completedSections = currentChild.intake?.completedQuestionnaireSections || getCompletedQuestionnaireSections(answers);
  const completedCount = completedSections.length;
  const totalSections = QUESTIONNAIRE_SECTIONS.length;
  const progress = Math.round((completedCount / totalSections) * 100);
  const firstIncompleteSection = QUESTIONNAIRE_SECTIONS.find((section) => !completedSections.includes(section));
  const activeConnection = newChildUnderstandingSections.find((section) => section.name === activeConnectionSection) || newChildUnderstandingSections[0];

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

  if (currentChild.isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-16"
      >
        <PageContainer>
          <PageHeader
            kicker="Understanding · Intake picture"
            title={`What we know about ${currentChild.name} so far.`}
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
            quote={`We are building ${currentChild.name}'s first understanding from the sections you complete in the questionnaire. Each completed section opens here with the information you shared, while clinical interpretation waits for review.`}
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
              <SectionLabel>Questionnaire to understanding</SectionLabel>
              <SectionTitle>Unlock each section.</SectionTitle>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 max-lg:grid-cols-1">
              {newChildUnderstandingSections.map((section, index) => {
                const isUnlocked = completedSections.includes(section.name);
                const answeredCount = getAnsweredCount(section.name, answers);
                const sectionQuestions = QUESTIONS[section.name] || [];
                const rows = answerPreview(section.name, answers, currentChild.name);
                const corners = ["rounded-tr-[32px]", "rounded-tl-[32px]", "rounded-br-[32px]", "rounded-bl-[32px]"];

                if (isUnlocked) {
                  return (
                    <GuideCard
                      key={section.name}
                      category={`${section.label} · Complete`}
                      title={section.title}
                      description={buildSectionAnalysis(section.name, answers, currentChild.name)}
                      readTime={`${rows.length} answers`}
                      image={section.image}
                      cornerClass={corners[index]}
                      actionText="Open questionnaire section"
                      onClick={() => setActiveQuestionnaireSection(section.name)}
                      disableHover
                      className="h-full shadow-premium-light"
                    />
                  );
                }

                return (
                  <Card
                    key={section.name}
                    className={`border border-black/5 shadow-premium-light ${corners[index]} h-full`}
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-5 p-7.5 pb-0">
                      <div>
                        <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-2 block">
                          {section.label}
                        </span>
                        <CardTitle className="font-serif font-normal text-[1.45rem] leading-tight">
                          {section.title}
                        </CardTitle>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                    </CardHeader>

                    <CardContent className="p-7.5 pt-5">
                      <p className="text-[0.9rem] leading-relaxed text-slate-500 mb-5">
                        {section.summary}
                      </p>

                      <div className="border-t border-black/5 pt-4">
                        <div className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                          Locked
                        </div>
                        <p className="text-[0.9rem] leading-relaxed text-slate-500 mb-4">
                          Answer all {sectionQuestions.length} questions in this section to open it here. {answeredCount > 0 ? `${answeredCount} answered so far.` : "Nothing recorded yet."}
                        </p>
                        <ActionLink
                          variant="forest"
                          onClick={() => setActiveQuestionnaireSection(section.name)}
                          icon={ArrowRight}
                          className="text-[0.84rem]"
                        >
                          {answeredCount > 0 ? "Continue section" : "Start section"}
                        </ActionLink>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </FadeInScroll>

          {completedCount === totalSections && (
            <>
              <FadeInScroll className="mb-12">
                <div>
                  <SectionLabel>How these connect</SectionLabel>
                  <SectionTitle>They connect.</SectionTitle>
                </div>
                <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch mb-6 w-full">
                  {newChildUnderstandingSections.map((section) => (
                    <ListItemCard
                      key={section.name}
                      active={activeConnectionSection === section.name}
                      onClick={() => setActiveConnectionSection(section.name)}
                    >
                      {section.label}
                    </ListItemCard>
                  ))}
                </div>
              </FadeInScroll>

              <InsightSection
                className="mb-24"
                kicker={activeConnection.label}
                title={activeConnection.title}
                description={buildSectionConnectionDescription(activeConnection.name, answers, currentChild.name)}
                image={activeConnection.image}
                equalHeight
              />
            </>
          )}

          <FadeInScroll className="grid grid-cols-2 gap-6 mb-24 max-md:grid-cols-1">
            <ValueCard
              variant="mint"
              title="Your words stay visible"
              content={`The understanding page shows what you entered for ${currentChild.name} before anyone turns it into a clinical formulation.`}
              cornerClass="rounded-tr-[32px]"
            />
            <ValueCard
              variant="white"
              title="Interpretation waits for review"
              content="Questionnaire answers unlock context, not conclusions. Priorities and recommendations stay limited until the clinician reviews the full intake."
              cornerClass="rounded-bl-[32px]"
            />
          </FadeInScroll>
        </PageContainer>

        <PageFooterCTA
          title={completedCount === totalSections ? "The questionnaire context is ready for review." : "Keep adding context before the session."}
          buttonText={completedCount === totalSections ? "Back to home" : "Continue questionnaire"}
          onClick={() => completedCount === totalSections ? onPageChange("home") : setActiveQuestionnaireSection(firstIncompleteSection || QUESTIONNAIRE_SECTIONS[0])}
        />

        <QuestionnaireModal
          isOpen={Boolean(activeQuestionnaireSection)}
          section={activeQuestionnaireSection}
          answers={answers}
          childName={currentChild.name}
          onClose={() => setActiveQuestionnaireSection(null)}
          onSave={saveQuestionnaireAnswers}
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
        quote={data.description}
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
            category="High Competency"
            title="Creative Play"
            description="Displays rich imaginative flow, abstract play and artistic task retention. A real strength to integrate into curriculum pathways."
            readTime=""
            image={creativePlayImg}
            cornerClass="rounded-tr-[32px]"
            actionText="Explore strength"
          />
          <GuideCard
            category="Exceptional Grasp"
            title="Verbal Comprehension"
            description="Excellent grasp of spoken guidelines and a highly adaptive communicative scope. Enthusiastic sharing is seen daily."
            readTime=""
            image={img2947}
            cornerClass="rounded-tl-[32px]"
            actionText="Explore strength"
          />
          <GuideCard
            category="Active Skillset"
            title="Social Empathy"
            description="Deep sensitivity to family members and primary playground buddies. Welcomes constructive social feedback loop cues."
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
            What we're seeing
          </SectionLabel>
          <SectionTitle>
            Areas affecting {currentChild.name}'s day.
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
