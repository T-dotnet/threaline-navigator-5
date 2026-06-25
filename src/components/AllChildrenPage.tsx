import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronRight, Calendar, Users, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Child, Page } from "../types";
import { ProgressBar } from "./ui/ProgressBar";
import { PageHeader } from "./ui/PageHeader";
import { EvidenceBadge } from "./ui/EvidenceBadge";
import { ActionLink } from "./ui/ActionLink";
import { Button } from "./ui/Button";
import { PlanProgressCard } from "./ui/PlanProgressCard";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";

interface AllChildrenPageProps {
  onPageChange: (page: Page) => void;
}

export default function AllChildrenPage({
  onPageChange,
}: AllChildrenPageProps) {
  const { childrenList, setChild } = useCurrentChild();
  const [isSecondaryLight, setIsSecondaryLight] = useState(true);

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
  const getChildSynthesisData = (childName: string) => {
    switch (childName) {
      case "Liam":
        return {
          quote: "Liam has achieved all current developmental milestones for this phase; focus now shifts to long-term enrichment and peer-leadership skills.",
          evidenceLevel: 3,
          progress: 100,
          progressText: "all goals met — maintenance phase",
          nextReview: "12 December",
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "green",
        };
      case "Sophia":
        return {
          quote: "Sophia exhibits brilliant verbal reasoning and high peer sensitivity, but academic organization challenges necessitate visual scheduling aids.",
          evidenceLevel: 3,
          progress: 58,
          progressText: "good pacing — steady progress",
          nextReview: "24 September",
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "white",
        };
      case "Maya":
      default:
        return {
          quote: "Maya is showing marked improvements in auditory processing, though focus remains heavily tethered to circadian stability.",
          evidenceLevel: 3,
          progress: 65,
          progressText: "on track — steady progress",
          nextReview: "12 September",
          accentColor: "text-[var(--color-thread-mid-green)]",
          theme: "white",
        };
    }
  };

  const handleFocusChild = useCallback((child: Child) => {
    setChild(child);
    onPageChange("home");
  }, [setChild, onPageChange]);

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
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[3.8rem] leading-[1.15] md:leading-[4.3rem]"
        className="mb-28"
      />

      <div className="flex flex-col gap-16">
        {childrenList.map((child, index) => {
          const childData = getChildSynthesisData(child.name);
          const isGreenTheme = childData.theme === "green";

          return (
            <motion.section
              key={child.name}
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
                  <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-thread-mid-green)] text-white flex items-center justify-center font-semibold text-[1.05rem] font-serif shadow-sm">
                    {child.initial}
                  </div>
                  <div>
                    <h2 className="text-[1.8rem] font-serif font-normal tracking-tight text-[var(--color-thread-heading)] leading-none">
                      {child.name}'s Profile
                    </h2>
                    <span className="text-[0.84rem] text-slate-500 font-medium block mt-1">
                      Age {child.age} · Developmental track
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
                  Manage {child.name}'s Dashboard
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
                  evidenceText="Strong formulation"
                  evidenceVariant={isGreenTheme ? 'green' : 'default'}
                  action={
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
                  }
                />

                {/* Quarter Plan Card */}
                <div
                  className="h-auto md:h-[300px]"
                  id={`plan-card-${child.name.toLowerCase()}`}
                >
                  <PlanProgressCard
                    progress={childData.progress}
                    statusText={childData.progressText}
                    nextReview={childData.nextReview}
                    className="rounded-bl-[32px] h-full"
                  />
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
