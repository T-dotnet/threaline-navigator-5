import { motion } from "motion/react";
import {
  Clock,
  Layers,
  Check,
  ArrowRight,
  FileText,
  Home,
  Download,
} from "lucide-react";
import { cn } from "../lib/utils";

import { Child } from "../types";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { FadeInScroll } from "./ui/FadeInScroll";
import { TimelineStep } from "./ui/TimelineStep";
import { Button } from "./ui/Button";
import { AreaItem } from "./ui/AreaItem";
import { StrategyCard } from "./ui/StrategyCard";
import { PageFooterCTA } from "./ui/PageFooterCTA";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { getChildSessionStatus, getChildSubheading, getSessionDate, isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";

export default function RoadmapPage({
  onPageChange,
}: {
  onPageChange: (page: any) => void;
}) {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const isLiam = isMaintenancePhase(currentChild);
  const isNoahStarting = isPlanNotStarted(currentChild);
  const isNewChild = Boolean(currentChild.isNew);
  const showParentClarity = isParentClarity && !isNewChild && !isLiam && !isNoahStarting;
  const newChildSetupStatus = getChildSubheading(currentChild).toLowerCase();
  const sessionStatus = getChildSessionStatus(currentChild);
  const sessionMeta = sessionStatus === "booked"
    ? `${getSessionDate(currentChild, "long")} · Telehealth`
    : sessionStatus === "cancelled"
    ? "Session cancelled"
    : "Session not booked";
  const sessionMetaTag = sessionStatus === "booked" ? "Booked" : sessionStatus === "cancelled" ? "Cancelled" : "To book";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Roadmap · What to do"
        title={isNewChild ? "Your setup, in clear steps." : isLiam ? "Plan complete." : isNoahStarting ? "Plan ready to start." : "Your plan, in clear steps."}
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[16ch]"
        className={isNewChild ? "mb-12" : "mb-24"}
        description={
          <div className="flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Updated 14 June 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              {isNewChild ? getChildSubheading(currentChild) : "Sequenced to build on itself"}
            </span>
          </div>
        }
      />

      <HeroQuoteCard
        kicker="The plan"
        quote={
          isNewChild
            ? `A short setup roadmap for getting ready for ${currentChild.name}'s first session. Finish the essentials, share existing context if you have it, then the support roadmap opens after review.`
            : isLiam
            ? "Liam has successfully navigated the core roadmap. All initial intervention steps are finalized and verified."
            : isNoahStarting
            ? "Noah's first quarter roadmap is ready, but nothing has moved yet. Start with one practical support, then use the first observations to shape what comes next."
            : showParentClarity
            ? `This is the practical plan for ${currentChild.name}: share the teacher pack first, agree the small classroom changes, then watch whether focus and home frustration ease.`
            : "A short, prioritised plan — not a 40-page report. A few things to do, in an order where each step makes the next one easier."
        }
        className="mb-24"
        rightNode={
          <HeroActionCard
            icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
            title={isNewChild ? "Setup roadmap" : "Roadmap"}
            subtitle={isNewChild ? "Preview PDF" : "Download PDF"}
          />
        }
        action={
          <div className="font-medium text-[0.84rem] opacity-70">
            Focused on{" "}
            <strong className="opacity-100 ml-1">
              {isNewChild ? "Intake setup" : isLiam ? "Maintenance & Enrichment" : isNoahStarting ? "First support step" : "Classroom attention"}
            </strong> · {isNewChild ? newChildSetupStatus : isLiam ? "Goal status: 100%" : isNoahStarting ? "Goal status: 0%" : "your Now priority"}
          </div>
        }
      />

      {/* Next Actions Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Recommended next actions
          </SectionLabel>
          <SectionTitle>
            {isLiam ? "Past milestones." : isNoahStarting ? "Start the first step." : showParentClarity ? "Start with the teacher pack." : "Do these, in this order."}
          </SectionTitle>
        </div>

        <div className="relative mt-1">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />

          {isNewChild ? (
            <>
              <TimelineStep
                active
                title="Finish the questionnaire"
                meta="Before session · You"
                metaTag="Now"
                description={`Your everyday observations give the clinician useful context before ${currentChild.name}'s first session.`}
              />
              <TimelineStep
                todo
                title="Share existing context"
                meta="Before session · Optional"
                metaTag="Optional"
                description="Use the Development history questions to tell us what reports or observations already exist. No upload is needed here."
              />
              <TimelineStep
                todo
                title="Attend the first session"
                meta={sessionMeta}
                metaTag={sessionMetaTag}
                description={sessionStatus === "booked"
                  ? "After clinical review, the assessment pages will open with real priorities and next steps."
                  : sessionStatus === "cancelled"
                  ? "Book a new time before clinical review can begin."
                  : "Choose a session time when you are ready to complete the assessment setup."}
              />
            </>
          ) : isLiam ? (
            <>
              <TimelineStep
                done
                title="All core assessments completed"
                meta="March 2026 · Threadline"
                metaTag="Done"
                description="Liam's profile is fully mapped and integrated across clinical and educational benchmarks."
              />
              <TimelineStep
                done
                title="Social Integration Routines"
                meta="May 2026 · You + School"
                metaTag="Done"
                description="Custom peer-interaction templates are now part of Liam's daily school experience."
              />
              <TimelineStep
                done
                title="Self-Correction Mastery"
                meta="June 2026 · You"
                metaTag="Done"
                description="Liam has achieved independent regulation milestones. No further active routines required."
              />
            </>
          ) : isNoahStarting ? (
            <>
              <TimelineStep
                active
                title="Begin the first support routine"
                meta="This week · You + School"
                metaTag="Start"
                description="Use the first agreed support in one real setting. The aim is repeatability, not perfection."
              />
              <TimelineStep
                todo
                title="Record what happens first"
                meta="First week · You"
                metaTag="Observe"
                description="Capture short examples of what was easier, what was harder, and whether the routine felt realistic."
              />
              <TimelineStep
                todo
                title="Adjust with the clinician"
                meta="8 October · Review"
                metaTag="Review"
                description="Use the first evidence to decide whether Noah's plan stays the same, gets simpler, or needs a new order."
              />
            </>
          ) : (
            <>
              <TimelineStep
                done
                title="Assessment completed"
                meta="14 June · Threadline"
                metaTag="Done"
                description={`The full picture is in — brought together from you, ${currentChild.name}'s teacher, your clinician, and ${currentChild.name} herself.`}
              />
              <TimelineStep
                active
                title={`Share the classroom strategy pack with ${currentChild.name}'s teacher`}
                meta="This week · You"
                metaTag="In progress"
                description={showParentClarity
                  ? "This is the main action. Send or hand over the pack, then use it to agree two or three changes the teacher can actually try this week."
                  : `A short, teacher-friendly summary of what helps ${currentChild.name} focus, ready to send or hand over.`}
              />
              <TimelineStep
                todo
                title="Agree classroom accommodations with the school"
                meta="Next 2 weeks · You + School"
                metaTag="To do"
                description={showParentClarity
                  ? "Keep the conversation small: where Maya sits, how tasks are chunked, and how the teacher gives a quiet cue when attention drifts."
                  : "A 20-minute conversation to put a few of the school strategies below in place and decide who's tracking them."}
              />
            </>
          )}
        </div>
      </FadeInScroll>

      {/* Strategies Section */}
      {!isNewChild && (
        <FadeInScroll className="mb-24">
          <div>
            <SectionLabel>
              Strategies that help
            </SectionLabel>
            <SectionTitle>
              Practical things to try.
            </SectionTitle>
          </div>

          <div className="relative rounded-br-[36px] p-12 bg-watercolor">
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              <StrategyCard
                title="At school"
                icon={<FileText className="w-[18px] h-[18px] stroke-[1.8]" />}
                items={isLiam ? [
                  "Liam leads small peer groups during creative projects.",
                  "Utilize advanced logic puzzles for extension during down time.",
                  "Monthly check-in with teacher to maintain social velocity.",
                ] : isNoahStarting ? [
                  "Choose one classroom routine to try first.",
                  "Keep the instruction short and visible.",
                  "Notice whether Noah can repeat it without extra adult load.",
                ] : [
                  `Seat ${currentChild.name} near the front, away from busy walkways and windows.`,
                  "Break tasks into short, clear chunks with quick check-ins.",
                  "Use visual timers and simple written checklists.",
                  "Agree a quiet signal for when she's drifting, instead of calling it out.",
                ]}
                cornerClass="rounded-tr-[28px]"
                className="shadow-premium border border-black/[0.03]"
              />
              <StrategyCard
                title="At home"
                icon={<Home className="w-[18px] h-[18px] stroke-[1.8]" />}
                items={isLiam ? [
                  "Encourage independent hobby exploration (e.g., coding, building).",
                  "Shift from co-regulation to independent reflection sessions.",
                  "Allow Liam to choose his own organizational tools.",
                ] : isNoahStarting ? [
                  "Keep the first home support predictable and brief.",
                  "Write down one example of what helped or got in the way.",
                  "Avoid adding a second routine until the first one is usable.",
                ] : [
                  "Keep homework at the same time and place each day.",
                  "Short focused bursts with movement breaks between them.",
                  showParentClarity ? "Clear phones, screens and clutter before homework starts." : "Clear the workspace of phones, screens and clutter.",
                  "Notice and name what went well, however small.",
                ]}
                cornerClass="rounded-bl-[28px]"
                className="shadow-premium border border-black/[0.03]"
              />
            </div>
          </div>
        </FadeInScroll>
      )}

      {/* Supports Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Supports worth exploring
          </SectionLabel>
          <SectionTitle>
            Options, not obligations.
          </SectionTitle>
        </div>
        <SectionDescription className="mb-6">
          {isNewChild ? (
            `Optional ways to give the clinician more context before ${currentChild.name}'s assessment. Use what is useful; nothing here needs to become a new task list.`
          ) : isLiam ? (
            "Liam's support structure is now self-sustaining. These options are for future enrichment."
          ) : isNoahStarting ? (
            "Noah's first plan is just beginning. These supports are useful only if they make the first routine easier to start, not if they add more tasks."
          ) : showParentClarity ? (
            `These are options to discuss, not extra homework. Start with the teacher pack, then add support only if ${currentChild.name}'s focus still needs it.`
          ) : (
            `Only what's likely to help, given where ${currentChild.name} is now. Explore these at your own pace, with your clinician.`
          )}
        </SectionDescription>

        <div className="border-b border-black/10">
          <AreaItem
            title={isNewChild ? "Upload existing reports" : isLiam ? "Leadership mentorship" : isNoahStarting ? "Starter school support" : "School support plan"}
            description={isNewChild ? "Add any previous assessments, school notes, examples of work, or health letters you already have." : isLiam ? "Connecting Liam with older student mentors to foster leadership skills." : isNoahStarting ? "A small classroom adjustment to try first, then review against Noah's baseline." : "Formalise the classroom accommodations so they hold steady across teachers and terms."}
            status={isNewChild ? "Optional" : "Suggested"}
          />
          <AreaItem
            title={isNewChild ? "Share school context" : isLiam ? "Creative Logic Course" : isNoahStarting ? "First-week notes" : "Occupational therapy — focus & regulation"}
            description={isNewChild ? "Bring teacher notes, recent feedback, or a few examples of what feels harder at school." : isLiam ? "External curriculum to keep Liam's high creative retention challenged." : isNoahStarting ? "Short examples that show whether the first support can be repeated in real life." : "Worth considering if the home strategies need more hands-on support down the track."}
            status={isLiam ? "Optional" : "Optional"}
          />
          <AreaItem
            title={isNewChild ? "Keep a short observation note" : isLiam ? "Annual Review" : isNoahStarting ? "First review" : "GP / paediatric review"}
            description={isNewChild ? "Jot down patterns around routines, transitions, sleep, friendships, or school days if they stand out." : isLiam ? "Scheduled baseline check to ensure maintenance phase remains stable." : isNoahStarting ? "A check-in to decide whether the first support is working or needs to be simplified." : "Keep your GP in the loop so medical options can be discussed if and when they're relevant."}
            status={isNewChild ? "Optional" : "In place"}
          />
        </div>
      </FadeInScroll>

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="A plan only works if you track it."
        buttonText="See how it's going"
        onClick={() => onPageChange("reviews")}
      />
    </motion.div>
  );
}
