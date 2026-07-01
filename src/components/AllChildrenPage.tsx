import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CalendarClock, ChevronLeft, ChevronRight, ClipboardList, LineChart, Users, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { getChildSessionStatus, getChildSubheading, getSessionDate, isNewChildOnboardingComplete } from "../lib/childStatus";
import { Child, Page } from "../types";
import { ProgressBar } from "./ui/ProgressBar";
import { PageHeader } from "./ui/PageHeader";
import { EvidenceBadge } from "./ui/EvidenceBadge";
import { ActionLink } from "./ui/ActionLink";
import { Button } from "./ui/Button";
import { PlanProgressCard } from "./ui/PlanProgressCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { FirstSessionCard } from "./ui/FirstSessionCard";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";

interface AllChildrenPageProps {
  onPageChange: (page: Page) => void;
}

export default function AllChildrenPage({
  onPageChange,
}: AllChildrenPageProps) {
  const { childrenList, setChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const [isSecondaryLight, setIsSecondaryLight] = useState(true);
  const [activeUpdateIndex, setActiveUpdateIndex] = useState(0);

  useEffect(() => {
    let style = "light";
    try {
      style = localStorage.getItem("thread-secondary-style") || "light";
    } catch (e) {
      console.warn("Storage access is blocked or restricted:", e);
    }
    setIsSecondaryLight(style === "light");
  }, []);

  // Helper to retrieve child-specific premium synthesis quote and progression details
  const getChildSynthesisData = (child: Child) => {
    if (child.isNew) {
      const sessionStatus = getChildSessionStatus(child);
      const sessionBooked = sessionStatus === "booked";
      const sessionCancelled = sessionStatus === "cancelled";
      const sessionDate = getSessionDate(child);
      const sessionTime = sessionBooked ? child.intake?.sessionTime || "4:00 pm" : undefined;
      return {
        quote: `We're gathering the full picture for ${child.name}. The assessment pages will open after the first session and clinical review.`,
        evidenceLevel: 1,
        evidenceText: getChildSubheading(child),
        progress: 0,
        progressText: sessionBooked
          ? "booked — assessment pending"
          : sessionCancelled
          ? "session cancelled — book a new time"
          : "session not booked",
        nextReview: sessionDate || (sessionCancelled ? "Cancelled" : "Not booked"),
        sessionDate,
        sessionTime,
        documentStatus: "Initial documents uploaded",
        accentColor: "text-amber-600",
        theme: "white",
      };
    }

    switch (child.name) {
      case "Liam":
        return {
          quote: "Liam has achieved all current developmental milestones for this phase; focus now shifts to long-term enrichment and peer-leadership skills.",
          evidenceLevel: 3,
          evidenceText: "Strong formulation",
          progress: 100,
          progressText: "all goals met — maintenance phase",
          nextReview: "12 December",
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "green",
        };
      case "Noah":
        return {
          quote: "Noah's first quarter plan is ready to begin. Progress is still 0%, so the next update should come from trying the first support routine.",
          evidenceLevel: 3,
          evidenceText: "Baseline ready",
          progress: 0,
          progressText: "not started — first actions ready",
          nextReview: "8 October",
          accentColor: "text-amber-600",
          theme: "white",
        };
      case "Sophia":
        return {
          quote: "Sophia exhibits brilliant verbal reasoning and high peer sensitivity, but academic organization challenges necessitate visual scheduling aids.",
          evidenceLevel: 3,
          evidenceText: "Strong formulation",
          progress: 58,
          progressText: "good pacing — steady progress",
          nextReview: "24 September",
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "white",
        };
      case "Maya":
      default:
        return {
          quote: isParentClarity ? "Maya's classroom focus is improving. Sleep stays on the watchlist because tired mornings may explain the days where focus still dips." : "Maya is showing marked improvements in auditory processing, though focus remains heavily tethered to circadian stability.",
          evidenceLevel: 3,
          evidenceText: "Strong formulation",
          progress: 65,
          progressText: "on track — steady progress",
          nextReview: "12 September",
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "white",
        };
    }
  };

  const navigate = useNavigate();
  const hasMultipleChildren = childrenList.length > 1;
  const updateSlides = childrenList.map((child) => {
    const childData = getChildSynthesisData(child);
    const sessionStatus = getChildSessionStatus(child);
    const sessionBooked = sessionStatus === "booked";
    const sessionCancelled = sessionStatus === "cancelled";
    const ctaLabel = child.isNew
      ? hasMultipleChildren
        ? `Open ${child.name} intake`
        : "Open intake home"
      : `Open ${child.name}`;
    const fallbackIcon = child.isNew
      ? sessionBooked
        ? <CalendarClock className="w-[22px] h-[22px] stroke-[1.7]" />
        : <ClipboardList className="w-[22px] h-[22px] stroke-[1.7]" />
      : <LineChart className="w-[22px] h-[22px] stroke-[1.7]" />;
    const fallbackTitle = child.isNew
      ? sessionBooked
        ? "Session booked"
        : sessionCancelled
        ? "Session cancelled"
        : "Intake live"
      : "Live progress";
    const fallbackSubtitle = child.isNew
      ? sessionBooked
        ? "Awaiting review"
        : sessionCancelled
        ? "Book a new time"
        : "Setup in motion"
      : childData.progressText;

    return {
      child,
      childData,
      kicker: "Updates",
      quote: child.isNew
        ? `${child.name}'s intake is still being built. ${
            sessionBooked
              ? "A first session is booked, so the next milestone is clinical review."
              : sessionCancelled
              ? "The previous session was cancelled, so the next milestone is booking a new time."
              : "The next milestone is finishing intake and booking the first session."
          }`
        : `${child.name}'s live update: ${childData.progressText}. Next review is ${childData.nextReview}.`,
      evidenceText: child.isNew ? getChildSubheading(child) : childData.evidenceText,
      evidenceLevel: child.isNew ? 1 : childData.evidenceLevel,
      ctaLabel,
      fallbackIcon,
      fallbackTitle,
      fallbackSubtitle,
    };
  });
  const activeSlide = updateSlides[activeUpdateIndex];

  const handleFocusChild = useCallback((child: Child) => {
    setChild(child);
    onPageChange("home");
  }, [setChild, onPageChange]);

  const handlePreviousUpdate = useCallback(() => {
    setActiveUpdateIndex((current) => (current === 0 ? updateSlides.length - 1 : current - 1));
  }, [updateSlides.length]);

  const handleNextUpdate = useCallback(() => {
    setActiveUpdateIndex((current) => (current === updateSlides.length - 1 ? 0 : current + 1));
  }, [updateSlides.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16 font-sans"
    >
      <PageContainer>
        <PageHeader
        kicker="Family Synthesis · Overview"
        title="All Children at a glance."
        description="Monitor your family's dynamic clinical profiles and milestones side-by-side. Use any profile card to dive directly into detailed assessments."
        titleClassName="md:text-[3.8rem] md:leading-[4.3rem]"
        className="mb-28"
      />

      {activeSlide && (
        <div className="mb-24">
          <motion.div
            key={activeSlide.child.name}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <HeroQuoteCard
              kicker={activeSlide.kicker}
              quote={activeSlide.quote}
              evidenceLevel={activeSlide.evidenceLevel}
              evidenceText={activeSlide.evidenceText}
              className="mb-5"
              description={
                <div className="text-[0.96rem] leading-relaxed">
                  Following <strong>{activeSlide.child.name}</strong> and showing the most useful live update before the detailed cards below.
                </div>
              }
              rightNode={
                activeSlide.ctaLabel ? (
                  <HeroActionCard
                    icon={<ArrowRight className="w-[22px] h-[22px] stroke-[1.8]" />}
                    title={activeSlide.ctaLabel}
                    subtitle={activeSlide.child.isNew ? "Continue setup" : "Open child view"}
                    className="bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] w-[190px] rounded-tl-[28px] hover:bg-[var(--color-thread-light-green)]/90"
                    onClick={() => handleFocusChild(activeSlide.child)}
                  />
                ) : (
                  <HeroActionCard
                    icon={activeSlide.fallbackIcon}
                    title={activeSlide.fallbackTitle}
                    subtitle={activeSlide.fallbackSubtitle}
                    className="bg-[var(--color-thread-light-green)] text-[var(--color-thread-heading)] w-[190px] rounded-tl-[28px]"
                  />
                )
              }
            />
          </motion.div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="muted"
                className="min-h-[36px] px-3 py-2"
                onClick={handlePreviousUpdate}
                aria-label="Previous live update"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </Button>
              <Button
                type="button"
                variant="muted"
                className="min-h-[36px] px-3 py-2"
                onClick={handleNextUpdate}
                aria-label="Next live update"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {updateSlides.map((slide, index) => (
                <button
                  key={slide.child.name}
                  type="button"
                  onClick={() => setActiveUpdateIndex(index)}
                  aria-label={`Show live update for ${slide.child.name}`}
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    activeUpdateIndex === index
                      ? "w-8 bg-[var(--color-thread-mid-green)]"
                      : "w-2.5 bg-black/15 hover:bg-black/25"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-16">
        {childrenList.map((child, index) => {
          const childData = getChildSynthesisData(child);
          const isGreenTheme = childData.theme === "green";
          const sessionStatus = getChildSessionStatus(child);
          const sessionBooked = sessionStatus === "booked";
          const sessionCancelled = sessionStatus === "cancelled";
          const sessionDate = getSessionDate(child);
          const sessionTime = sessionBooked ? child.intake?.sessionTime || "4:00 pm" : undefined;

          return (
            <motion.section
              key={`${child.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              className="border-b border-black/5 pb-14 last:border-0"
              id={`child-section-${child.name.toLowerCase()}`}
            >
              {/* Child Section Row Header */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-thread-mid-green)] text-white flex items-center justify-center font-medium text-[1.05rem] font-serif shadow-sm">
                    {child.initial}
                  </div>
                  <div>
                    <h2 className="text-[1.8rem] font-serif font-normal tracking-tight text-[var(--color-thread-heading)] leading-none">
                      {child.name}'s Profile
                    </h2>
                    <span className="text-[0.84rem] text-slate-500 font-medium block mt-1">
                      {child.isNew ? getChildSubheading(child) : `Age ${child.age} · Developmental track`}
                    </span>
                  </div>
                </div>

                <ActionLink
                  variant="forest"
                  as="button"
                  onClick={() => handleFocusChild(child)}
                  id={`focus-${child.name.toLowerCase()}`}
                  icon={ArrowRight}
                  className="text-[0.88rem]"
                >
                  {child.isNew ? "Open Intake Home" : `Manage ${child.name}'s Dashboard`}
                </ActionLink>
              </div>

              {/* Cards Grid: Synthesis (left) and Quarter Plan (right) */}
              <div className="grid grid-cols-[1.5fr_1fr] md:gap-6 max-md:grid-cols-1 max-md:gap-y-8">
                
                {/* Dynamic Synthesis Card */}
                <HeroQuoteCard
                  id={`synthesis-card-${child.name.toLowerCase()}`}
                  variant={isGreenTheme ? "green" : "default"}
                  className="h-auto md:h-[300px] p-8"
                  kicker="Clinician Synthesis Summary"
                  quote={childData.quote}
                  evidenceLevel={childData.evidenceLevel}
                  evidenceText={childData.evidenceText}
                  evidenceVariant={isGreenTheme ? 'green' : 'default'}
                  action={
                    child.isNew ? (
                      isNewChildOnboardingComplete(child) ? (
                        <Button
                          onClick={() => handleFocusChild(child)}
                          variant="mint"
                          rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                        >
                          Open intake
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setChild(child);
                            window.location.href = "/setup";
                          }}
                          variant="mint"
                          rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                        >
                          Continue setup
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => {
                          setChild(child);
                          onPageChange("understanding");
                        }}
                        variant={isGreenTheme ? "white" : "mint"}
                        rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                      >
                        Open Insights
                      </Button>
                    )
                  }
                />

                {/* Quarter Plan Card */}
                <div
                  className="h-auto md:h-[300px]"
                  id={`plan-card-${child.name.toLowerCase()}`}
                >
                  {child.isNew ? (
                    <FirstSessionCard
                      date={sessionDate}
                      time={sessionTime}
                      className="h-full"
                      isBooked={sessionBooked}
                      isCancelled={sessionCancelled}
                      onBook={() => {
                        setChild(child);
                        navigate('/setup?step=5&directSession=1');
                      }}
                      onReschedule={sessionBooked ? () => {
                        setChild(child);
                        navigate('/setup?step=5&directSession=1');
                      } : undefined}
                    />
                  ) : (
                    <PlanProgressCard
                      progress={childData.progress}
                      statusText={childData.progressText}
                      nextReview={childData.nextReview}
                      onReschedule={() => {
                        setChild(child);
                        navigate('/setup?step=5&directSession=1');
                      }}
                      className="rounded-bl-[32px] h-full"
                    />
                  )}
                </div>

              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Footer support notice */}
      <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center flex-wrap gap-4 text-[0.84rem] text-slate-500 text-center md:text-left">
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--color-thread-mid-green)]" />
          Coordinated clinical care dashboard for families
        </span>
        <ActionLink
          variant="default"
          as="button"
          onClick={() => onPageChange("settings")}
          icon={null}
        >
          Manage profile settings & credentials
        </ActionLink>
      </div>
      </PageContainer>
    </motion.div>
  );
}
