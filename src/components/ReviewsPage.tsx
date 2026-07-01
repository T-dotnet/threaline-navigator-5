import { motion } from "motion/react";
import {
  Clock,
  Calendar,
  ArrowUpRight,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { FadeInScroll } from "./ui/FadeInScroll";
import { AreaItem } from "./ui/AreaItem";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { FirstSessionCard } from "./ui/FirstSessionCard";
import { ReviewRhythmSection } from "./ui/ReviewRhythmSection";

import { PageContainer } from "./ui/PageContainer";

import { Page } from "../types";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { isMaintenancePhase, isPlanNotStarted, isSessionBooked as getIsSessionBooked } from "../lib/childStatus";
import watercolorBgImg from "../assets/images/optimized/watercolor-bg-900.jpg";

export default function ReviewsPage({
  onPageChange,
  onOpenSetup,
}: {
  onPageChange: (page: Page) => void;
  onOpenSetup?: (step?: 1 | 2 | 3 | 4 | 5 | "welcome") => void;
}) {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const isLiam = isMaintenancePhase(currentChild);
  const isNoahStarting = isPlanNotStarted(currentChild);
  const showParentClarity = isParentClarity && !currentChild.isNew && !isLiam && !isNoahStarting;
  const reviewDate = isLiam ? "12 Dec" : isNoahStarting ? "8 Oct" : "12 Sep";
  const reviewTime = "4:00 pm";
  const isSessionBooked = getIsSessionBooked(currentChild);
  const showReviewDates = !currentChild.isNew || isSessionBooked;
  const reviewRhythmItems = [
    {
      state: "Done",
      title: "Assessment baseline",
      meta: showReviewDates ? "14 June" : "",
      description: "The starting point: what is happening, what matters most, and the first plan.",
      icon: <Check className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
    {
      state: "Next review",
      title: "First full review",
      meta: showReviewDates ? (isNoahStarting ? "8 October" : "12 September") : "After first session",
      description: "Revisit priorities, update the plan, and confirm what has improved and what needs attention next.",
      icon: <Calendar className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
    {
      state: "Happening now",
      title: "Progress tracking",
      meta: "Between reviews",
      description: "We watch what changes week to week and flag patterns, like sleep, before they become urgent.",
      icon: <Clock className="w-[19px] h-[19px] stroke-[1.8]" />,
      active: true,
    },
    {
      state: "Ongoing",
      title: "Keep the picture current",
      meta: `Each term`,
      description: `The picture updates as ${currentChild.name} grows, because needs shift and clarity should not expire.`,
      icon: <ArrowUpRight className="w-[19px] h-[19px] stroke-[1.8]" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Reviews · How we're progressing"
        title={`How ${currentChild.name}'s doing over time.`}
        titleClassName="md:leading-[4.5rem]"
        titleWidthClassName="max-w-[16ch]"
        className={currentChild.isNew ? "mb-12" : "mb-24"}
        description={
          <PageMetaRow
            items={[
              { icon: Clock, children: "Updated 14 June 2026" },
              {
                icon: Calendar,
                children: isLiam
                  ? "Maintenance phase active"
                  : isNoahStarting
                  ? "First progress review 8 October"
                  : "Next full review 12 September",
              },
            ]}
          />
        }
      />

      {currentChild.isNew && (
        <div className="w-full h-[200px] rounded-t-[24px] sm:rounded-t-[32px] overflow-hidden relative border border-black/5">
          <img
            src={watercolorBgImg}
            alt="Watercolor Accent"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="grid grid-cols-[2fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-6 mb-24">
        <HeroQuoteCard
          kicker="The long view"
          quote={
            isLiam ? (
              `Liam has achieved all baseline targets. His profile now reflects a state of sustained developmental mastery.`
            ) : isNoahStarting ? (
              `Noah's plan has a clean starting point. The next review will compare the baseline with what happens after the first support routine is actually tried.`
            ) : showParentClarity ? (
              `The main story is simple: ${currentChild.name}'s classroom focus is moving in the right direction. Sleep stays on the watchlist because it may explain the days where focus still dips.`
            ) : (
              `Most assessments are a snapshot. Yours keeps updating — so the picture stays true as ${currentChild.name} grows, not frozen at the day you got the report.`
            )
          }
          className="h-full"
        />

        <FirstSessionCard
          label="Next review"
          date={reviewDate}
          time={reviewTime}
          detail=""
          provider="Dr. Naomi Clark"
          onReschedule={() => onOpenSetup?.(5)}
        />
      </div>

      {/* What's Changed Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What's changed
          </SectionLabel>
          <SectionTitle>
            {isLiam ? "Current status summaries." : isNoahStarting ? "What we are waiting to learn." : "How the picture has moved."}
          </SectionTitle>
        </div>

        <div className="border-y border-black/10">
          {isLiam ? (
            <>
              <AreaItem
                title="Self-Correction"
                description="Fully independent in most social contexts."
                status="Complete"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Task Endurance"
                description="Extended engagement is now a stable characteristic."
                status="Complete"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Social Connection"
                description="Emerging as a peer leader in school creative projects."
                status="Strength"
                icon={<ArrowUpRight className="w-3 h-3 stroke-[2.4]" />}
              />
            </>
          ) : isNoahStarting ? (
            <>
              <AreaItem
                title="First support routine"
                description="Ready to begin. No progress is recorded yet because the routine has not been used long enough to show movement."
                status="0%"
                icon={<Minus className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Baseline"
                description="The starting picture is clear enough to compare against once home and school observations begin."
                status="Set"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
              />
              <AreaItem
                title="Early observations"
                description="The next useful update will be whether the first routine feels repeatable in real life."
                status="Waiting"
                icon={<Plus className="w-3 h-3 stroke-[2.4]" />}
              />
            </>
          ) : (
            <>
              <AreaItem
                title="Classroom attention"
                description={showParentClarity ? "Teacher-friendly classroom strategies are starting to show movement. Keep this as the main action area until the September review." : "Focus in class is improving as the strategies take hold."}
                status="Improving"
                icon={<ArrowUpRight className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Teacher feedback", "Parent check-in"] : undefined}
              />
              <AreaItem
                title="Emotional regulation at home"
                description={showParentClarity ? "Home frustration is still present, but not escalating. We expect this may ease if classroom focus keeps improving." : "Holding steady — likely to ease further as attention improves."}
                status="Steady"
                icon={<Minus className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Parent notes"] : undefined}
              />
              <AreaItem
                title="Sleep"
                description={showParentClarity ? "Not something to act on heavily yet. Keep routines consistent and watch whether tired mornings line up with harder school days." : "A new signal since the assessment — now on the watchlist."}
                status="Emerging"
                icon={<Plus className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Parent check-in", "Pattern watch"] : undefined}
              />
              <AreaItem
                title="Friendships & social connection"
                description={showParentClarity ? "Still a strength. This can safely stay off the parent task list unless something changes." : "Still going well — no change needed."}
                status="Strength"
                icon={<Check className="w-3 h-3 stroke-[2.4]" />}
                sources={showParentClarity ? ["Maya", "Parent notes"] : undefined}
              />
            </>
          )}
        </div>
      </FadeInScroll>

      {/* Review Rhythm Section */}
      <ReviewRhythmSection items={reviewRhythmItems} />

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="This is the loop that keeps your clarity current."
        buttonText="Back to today's focus"
        buttonIcon={<Check className="w-4 h-4 stroke-[2]" />}
        onClick={() => onPageChange("home")}
      />
    </motion.div>
  );
}
