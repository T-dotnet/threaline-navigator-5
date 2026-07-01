import { motion } from "motion/react";
import { ChevronRight, Calendar, Clock, FileText, Download, Play, Printer, Eye, LineChart, ListTodo, Users, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Page } from "../types";
import { getChildData } from "../data";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { ActionLink } from "./ui/ActionLink";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Button } from "./ui/Button";
import { TimelineItem } from "./ui/TimelineItem";
import { LockerItem } from "./ui/LockerItem";
import { AICopilotBar } from "./ui/AICopilotBar";
import { InsightSection } from "./ui/InsightSection";

import { PlanProgressCard } from "./ui/PlanProgressCard";
import img2912 from "../assets/images/IMG_2912.jpeg";
import watercolorBgImg from "../assets/images/optimized/watercolor-bg-900.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { SetupSummary } from "./ui/SetupSummary";
import { ModalCloseButton, ModalShell } from "./ui/ModalShell";
import { getJourneyHomeCopy, hasReportContext } from "../lib/journeyCopy";
import { getChildSessionStatus, getSessionDate, isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";

const newChildPreviewCards = [
  {
    title: "Understanding",
    description: "What the answers are starting to show, without jumping to conclusions.",
    icon: Users,
  },
  {
    title: "Priorities",
    description: "A plain-language guide to how Now, Next, and Later will be decided.",
    icon: ListTodo,
  },
  {
    title: "Reviews",
    description: "A place to revisit what you noticed and what to keep watching before the session.",
    icon: LineChart,
  },
  {
    title: "Resources",
    description: "Short preparation tools matched to the intake stage.",
    icon: BookOpen,
  },
];


export default function HomePage({
  onPageChange,
  onOpenSetup,
}: {
  onPageChange: (page: Page) => void;
  onOpenSetup?: (step?: 1 | 2 | 3 | 4 | 5 | "welcome") => void;
}) {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const [isZeroProgressMomentOpen, setIsZeroProgressMomentOpen] = useState(false);
  const data = getChildData(currentChild).home;

  const isLiam = isMaintenancePhase(currentChild);
  const isNoahStarting = isPlanNotStarted(currentChild);
  const showParentClarity = isParentClarity && !currentChild.isNew && !isLiam && !isNoahStarting;
  const newChildHomeCopy = getJourneyHomeCopy(
    currentChild.name,
    currentChild.intake?.journeyStage,
    hasReportContext(currentChild.intake?.availableInfo)
  );
  const synthesisQuote = isLiam 
    ? "Liam has achieved all current developmental milestones for this phase; focus now shifts to long-term enrichment and peer-leadership skills."
    : isNoahStarting
      ? "Noah's first quarter plan is ready. Progress is still at 0%, so the focus is simply starting the first support routine and noticing what changes."
    : currentChild.isNew 
      ? newChildHomeCopy.quote
      : showParentClarity
      ? `${currentChild.name}'s main working thread is classroom focus. The plan is helping attention improve first, while we keep an eye on sleep because it can make focus fluctuate.`
      : "Maya is showing marked improvements in auditory processing, though focus remains heavily tethered to circadian stability.";
  
  const sessionStatus = getChildSessionStatus(currentChild);
  const isSessionBooked = sessionStatus === "booked";
  const isSessionCancelled = sessionStatus === "cancelled";
  const firstSessionDate = getSessionDate(currentChild, "long") ?? "Not booked";
  const firstSessionTime = isSessionBooked ? currentChild.intake?.sessionTime || "4:00 pm" : isSessionCancelled ? "Cancelled" : "Choose a time";
  const progressValue = isLiam ? 100 : isNoahStarting ? 0 : currentChild.isNew ? 0 : 65;
  const progressStatus = isLiam
    ? "all goals met — maintenance phase"
    : isNoahStarting
    ? "not started — first actions ready"
    : currentChild.isNew
    ? isSessionBooked
      ? "booked — assessment pending"
      : isSessionCancelled
      ? "session cancelled — book a new time"
      : "setup in progress — session not booked"
    : "on track — steady progress";
  const nextReview = isLiam ? "12 December" : isNoahStarting ? "8 October" : currentChild.isNew ? firstSessionDate : "12 September";
  const evidenceTag = isLiam ? "Consolidated" : isNoahStarting ? "Baseline" : currentChild.isNew ? "Initial" : "Emerging";
  const sessionDetails = currentChild.isNew
    ? [
        {
          label: "Date",
          value: firstSessionDate,
          icon: <Calendar className="w-4 h-4 stroke-[1.8]" />,
        },
        {
          label: "Time",
          value: firstSessionTime,
          icon: <Clock className="w-4 h-4 stroke-[1.8]" />,
        },
        {
          label: "Information",
          value: currentChild.intake?.availableInfo?.length
            ? "Report context noted"
            : newChildHomeCopy.prepCards === "gentle"
            ? "Questions first"
            : "Context pending",
          icon: <FileText className="w-4 h-4 stroke-[1.8]" />,
        },
      ]
    : undefined;
  const visibleNewChildPreviewCards = newChildPreviewCards;
  const zeroProgressMomentKey = currentChild.id
    ? `threadline-zero-progress-moment-${currentChild.id}`
    : `threadline-zero-progress-moment-${currentChild.name}`;

  useEffect(() => {
    if (!isNoahStarting) {
      setIsZeroProgressMomentOpen(false);
      return;
    }

    try {
      if (sessionStorage.getItem(zeroProgressMomentKey)) return;
    } catch {
      // If session storage is unavailable, still show the moment once for this render.
    }

    setIsZeroProgressMomentOpen(true);
  }, [isNoahStarting, zeroProgressMomentKey]);

  const closeZeroProgressMoment = () => {
    try {
      sessionStorage.setItem(zeroProgressMomentKey, "seen");
    } catch {
      // Storage can be unavailable in restricted contexts; closing still works.
    }
    setIsZeroProgressMomentOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <ModalShell
        isOpen={isZeroProgressMomentOpen}
        titleId="zero-progress-moment-title"
        maxWidthClassName="max-w-[680px]"
      >
            <div className="relative h-[190px] overflow-hidden">
              <img
                src={watercolorBgImg}
                alt=""
                className="h-full w-full object-cover"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-white/20 to-transparent" />
              <ModalCloseButton
                onClick={closeZeroProgressMoment}
                label="Close new chapter modal"
                className="absolute right-5 top-5 h-9 w-9 bg-white/90 text-[var(--color-thread-heading)] shadow-sm hover:bg-white"
                iconClassName="h-4 w-4"
              />
              <div className="absolute bottom-5 left-7 right-7">
                <span className="text-[0.68rem] tracking-[0.18em] uppercase font-medium text-[var(--color-thread-mid-green)]">
                  A new chapter is ready
                </span>
              </div>
            </div>

            <div className="px-7 py-7 sm:px-9 sm:py-8">
              <h2
                id="zero-progress-moment-title"
                className="font-serif font-normal text-[2rem] sm:text-[2.45rem] leading-[1.08] tracking-tight text-[var(--color-thread-heading)] max-w-[12ch]"
              >
                Congratulations on this next step.
              </h2>
              <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-500 max-w-[58ch]">
                Noah's plan is at 0%, and that is not a problem to fix. It means the next part of the journey is clearly marked: one first focus, one gentle routine to try, and a way to notice what changes.
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-500 max-w-[58ch]">
                Whether this is your first plan or a fresh plan after earlier reviews, this is the point where clarity turns into a small, doable next action.
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-500 max-w-[58ch]">
                Invite a partner, teacher, or carer to see Noah's profile. You choose what they can access.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeZeroProgressMoment();
                  onPageChange("settings");
                }}
                className="mt-2 text-left text-[0.84rem] font-medium leading-relaxed text-[var(--color-thread-mid-green)] hover:text-[var(--color-thread-heading)] transition-colors"
              >
                Manage sharing
              </button>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="mint"
                  onClick={() => {
                    closeZeroProgressMoment();
                    onPageChange("priorities");
                  }}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                >
                  See Noah's first priorities
                </Button>
              </div>
            </div>
      </ModalShell>
      <PageContainer>
        <PageHeader
        kicker={currentChild.isNew ? newChildHomeCopy.kicker : "Tuesday · Good morning"}
        title={currentChild.isNew ? newChildHomeCopy.title : isLiam ? `${currentChild.name} has completed this quarter's plan, Sarah.` : isNoahStarting ? `${currentChild.name}'s plan is ready to begin, Sarah.` : "Here's where to put your energy today, Sarah."}
        titleClassName="md:leading-[4.5rem]"
        titleWidthClassName="max-w-[18ch]"
        className={currentChild.isNew ? "mb-12" : "mb-28"}
      />

      <div className="grid grid-cols-[1.6fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-12">
        <div className="flex flex-col max-md:gap-y-14 md:contents">
          {/* Focus Card */}
          <FadeInScroll className="md:col-start-1 md:row-start-1 md:h-full md:flex md:flex-col">
            <HeroQuoteCard
              kicker="Key synthesis"
              quote={synthesisQuote}
              evidenceLevel={currentChild.isNew ? 1 : 3}
              evidenceText={evidenceTag}
              className="h-full"
              action={
                !currentChild.isNew && (
                  <Button
                    type="button"
                    variant="mint"
                    onClick={() => onPageChange(showParentClarity ? "resources" : "emerging-details")}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                  >
                    {showParentClarity ? "Share teacher pack" : "Learn more"}
                  </Button>
                )
              }
            />
          </FadeInScroll>

        </div>

        <div className="flex flex-col max-md:gap-y-6 md:contents">
          {/* Stat Card */}
          <FadeInScroll delay={0.1} className="md:col-start-2 md:row-start-1 md:h-full md:flex md:flex-col w-full">
            <PlanProgressCard
              progress={progressValue}
              statusText={progressStatus}
              nextReview={nextReview}
              title={currentChild.isNew ? "First session" : "This quarter's plan"}
              details={sessionDetails}
              footerLabel={currentChild.isNew ? "Date" : undefined}
              onReschedule={currentChild.isNew ? () => onOpenSetup?.(5) : () => onOpenSetup?.(5)}
              rescheduleLabel={currentChild.isNew ? (isSessionBooked ? "Reschedule" : isSessionCancelled ? "Book again" : "Book session") : undefined}
              className="w-full h-full"
            />
          </FadeInScroll>
        </div>
      </div>

      {/* Timeline List or Setup Summary */}
      <FadeInScroll delay={0.1} className="mt-20 mb-10">
        {currentChild.isNew ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 sm:gap-4 mb-4">
              <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium">
                Setup Progress
              </span>
            </div>
            <SetupSummary
              childName={currentChild.name}
              onContinueQuestionnaire={() => onOpenSetup?.(4)}
              onReviewUnderstanding={() => onPageChange("understanding")}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 sm:gap-4 mb-4">
              <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium">
                {isLiam ? "Completed quarter · Next review" : "Now · Next · Later"}
              </span>
              <ActionLink
                variant="default"
                as="button"
                onClick={() => onPageChange("priorities")}
              >
                {isLiam ? "Open review priorities" : "View all priorities"}
              </ActionLink>
            </div>

            <div className="mt-1.5 flex flex-col">
              <TimelineItem
                tag={isLiam ? "New" : "Now"}
                title={data.timeline.now.title}
                meta={data.timeline.now.meta}
                content={data.timeline.now.content}
                progress={isLiam ? 100 : isNoahStarting ? 0 : 35}
                isFirst
                active
                isCollapsible
              />
              <TimelineItem
                tag={isLiam ? "Then" : "Next"}
                title={data.timeline.next.title}
                meta={data.timeline.next.meta}
                content={data.timeline.next.content}
                progress={isLiam ? 0 : isNoahStarting ? 0 : 15}
                isCollapsible
              />
              <TimelineItem
                tag="Later"
                title={data.timeline.later.title}
                meta={data.timeline.later.meta}
                content={data.timeline.later.content}
                progress={0}
                isCollapsible
              />
              <div className="border-b border-black/10" />
            </div>
          </>
        )}
      </FadeInScroll>

      {currentChild.isNew && (
        <FadeInScroll delay={0.12} className="mt-20 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-3 block">
                After assessment
              </span>
              <h2 className="font-serif font-normal text-[2rem] tracking-tight text-[var(--color-thread-heading)] leading-tight">
                What will unlock next.
              </h2>
            </div>
            <Button
              type="button"
              variant="mint"
              onClick={() => onPageChange("preview")}
              rightIcon={<Eye className="w-3.5 h-3.5 stroke-[2]" />}
            >
              Preview dashboard
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {visibleNewChildPreviewCards.map((card, index) => {
              const Icon = card.icon;
              const corners = ["rounded-tr-[28px]", "rounded-tl-[28px]", "rounded-br-[28px]", "rounded-bl-[28px]"];
              return (
                <div
                  key={card.title}
                  className={`bg-white border border-black/5 shadow-premium-light p-6 ${corners[index]}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <h3 className="font-medium text-[1rem] text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-[0.84rem] text-slate-500 leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </FadeInScroll>
      )}

      {/* Watchlist Sleep Section - Hide for new children */}
      {!currentChild.isNew && (
        <InsightSection
          className="mt-20"
          kicker="On the watchlist"
          title="Sleep"
          description={isLiam
            ? "Liam's sleep hygiene remains optimal. We are maintaining current wind-down routines to support his high-performance learning phases."
            : isNoahStarting
            ? "Noah's first plan has just started, so sleep is a baseline signal to watch rather than something to turn into a separate task today."
            : showParentClarity
            ? `${currentChild.name}'s sleep is not the main priority today, but it may explain why focus still changes from day to day. Keep the routine steady and we will only move it up if the signal grows.`
            : "Maya is showing signs of increased evening fatigue. We are currently monitoring latency patterns and bedtime routine transitions for consistency."}
          image={img2912}
          actionText="View sleep log"
          onActionClick={() => onPageChange("emerging-details")}
        />
      )}

      {/* Aids & Exercises Locker */}
      <FadeInScroll delay={0.15} className="mt-20 mb-16">
        <div className="mb-6">
          <span className="text-[0.66rem] tracking-[0.2em] uppercase text-slate-500 font-medium mb-2.5 block text-uppercase">
            Aids & exercises locker
          </span>
          <h2 className="font-medium text-[1.4rem] tracking-tight">
            Quick activities locker.
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          <LockerItem
            icon={<Download className="w-[19px] h-[19px] stroke-[1.8]" />}
            title="Download templates"
            description="Editable letter templates, transition checklists and customisable behaviour journals."
            action="Download printable PDFs"
            cornerClass="rounded-tl-[32px]"
          />
          <LockerItem
            icon={<Play className="w-[19px] h-[19px] stroke-[1.8]" />}
            title="Watch short videos"
            description="5-minute play-based co-regulation tactics designed for real parents."
            action="Launch video player"
            cornerClass="rounded-tr-[32px]"
          />
          <LockerItem
            icon={<Printer className="w-[19px] h-[19px] stroke-[1.8]" />}
            title="Print classroom guides"
            description="Double-sided sheets designed for teachers, tutors and clinical aides."
            action="Generate print format"
            cornerClass="rounded-br-[32px]"
          />
        </div>
      </FadeInScroll>

      </PageContainer>

      {/* Reusable, Modular AICopilotBar */}
      <AICopilotBar currentChildName={currentChild.name} />
    </motion.div>
  );
}
