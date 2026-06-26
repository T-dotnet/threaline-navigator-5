import { motion } from "motion/react";
import { Check, ChevronRight, Calendar, Plus, Send, Download, Play, Printer, Eye, LineChart, ListTodo, Milestone, Users } from "lucide-react";
import { cn } from "../lib/utils";
import React, { useState, useRef } from "react";
import { Child } from "../types";
import { getChildData } from "../data";
import { ProgressBar } from "./ui/ProgressBar";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { ActionLink } from "./ui/ActionLink";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Button } from "./ui/Button";
import { TimelineItem } from "./ui/TimelineItem";
import { QuickLink } from "./ui/QuickLink";
import { LockerItem } from "./ui/LockerItem";
import { AICopilotBar } from "./ui/AICopilotBar";
import { InsightSection } from "./ui/InsightSection";

import { PlanProgressCard } from "./ui/PlanProgressCard";
import img2912 from "../assets/images/IMG_2912.jpeg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { SetupSummary } from "./ui/SetupSummary";

const newChildPreviewCards = [
  {
    title: "Understanding",
    description: "Strengths, support needs, and the evidence behind the first clinical picture.",
    icon: Users,
  },
  {
    title: "Priorities",
    description: "A ranked view of what to focus on first and what can safely wait.",
    icon: ListTodo,
  },
  {
    title: "Roadmap",
    description: "Clear next steps for home, school, and follow-up conversations.",
    icon: Milestone,
  },
  {
    title: "Reviews",
    description: "A rhythm for tracking how the picture changes over time.",
    icon: LineChart,
  },
];


export default function HomePage({
  onPageChange,
  onOpenSetup,
}: {
  onPageChange: (page: any) => void;
  onOpenSetup?: () => void;
}) {
  const { currentChild } = useCurrentChild();
  const [isActionDone, setIsActionDone] = useState(false);
  const data = getChildData(currentChild).home;

  const isLiam = currentChild.name === "Liam";
  const synthesisQuote = isLiam 
    ? "Liam has achieved all current developmental milestones for this phase; focus now shifts to long-term enrichment and peer-leadership skills."
    : currentChild.isNew 
      ? `We're currently gathering the full picture for ${currentChild.name}. Once your questionnaire and first session are complete, a clinical synthesis will appear here.`
      : "Maya is showing marked improvements in auditory processing, though focus remains heavily tethered to circadian stability.";
  
  const progressValue = isLiam ? 100 : currentChild.isNew ? 0 : 65;
  const progressStatus = isLiam ? "all goals met — maintenance phase" : currentChild.isNew ? "initial setup — assessment pending" : "on track — steady progress";
  const nextReview = isLiam ? "12 December" : currentChild.isNew ? "Thu 26 June" : "12 September";
  const evidenceTag = isLiam ? "Consolidated" : currentChild.isNew ? "Initial" : "Emerging";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker={currentChild.isNew ? "PREVIEW · ASSESSMENT PENDING" : "Tuesday · Good morning"}
        title="Here's where to put your energy today, Sarah."
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[18ch]"
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
                    onClick={() => onPageChange("emerging-details")}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
                  >
                    Learn more
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
              title={currentChild.isNew ? "Session" : "This quarter's plan"}
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
              onContinueQuestionnaire={() => onOpenSetup?.()}
              onReviewUnderstanding={() => onPageChange("understanding")}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 sm:gap-4 mb-4">
              <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium">
                Now · Next · Later
              </span>
              <ActionLink
                variant="default"
                as="button"
                onClick={() => onPageChange("priorities")}
              >
                View all priorities
              </ActionLink>
            </div>

            <div className="mt-1.5 flex flex-col">
              <TimelineItem
                tag="Now"
                title={data.timeline.now.title}
                meta={data.timeline.now.meta}
                content={data.timeline.now.content}
                progress={35}
                isFirst
                active
                isCollapsible
              />
              <TimelineItem
                tag="Next"
                title={data.timeline.next.title}
                meta={data.timeline.next.meta}
                content={data.timeline.next.content}
                progress={15}
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
            {newChildPreviewCards.map((card, index) => {
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
            : "Maya is showing signs of increased evening fatigue. We are currently monitoring latency patterns and bedtime routine transitions for consistency."}
          image={img2912}
          actionText="View sleep log"
          onActionClick={() => onPageChange('priorities')}
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
