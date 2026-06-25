import { motion } from "motion/react";
import {
  Clock,
  Calendar,
  ArrowUpRight,
  Minus,
  Plus,
  Check,
  Download,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

import { Child } from "../types";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { PageIcon } from "./ui/PageIcon";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { FadeInScroll } from "./ui/FadeInScroll";
import { TimelineStep } from "./ui/TimelineStep";
import { Button } from "./ui/Button";
import { AreaItem } from "./ui/AreaItem";
import { ProgressChartSection } from "./ui/ProgressChartSection";
import { PageFooterCTA } from "./ui/PageFooterCTA";

const data = [
  { name: "14 Jun", value: 165 },
  { name: "Jul", value: 150 },
  { name: "Aug", value: 128 },
  { name: "Now", value: 105 },
  { name: "Future", value: 80 },
  { name: "12 Sep", value: 52 },
];

const liamData = [
  { name: "Mar", value: 180 },
  { name: "Apr", value: 140 },
  { name: "May", value: 90 },
  { name: "Jun", value: 50 },
  { name: "Now", value: 20 },
  { name: "End", value: 0 },
];

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";

export default function ReviewsPage({
  onPageChange,
}: {
  onPageChange: (page: any) => void;
}) {
  const { currentChild } = useCurrentChild();
  const isLiam = currentChild.name === "Liam";
  const activeData = isLiam ? liamData : data;

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
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[16ch]"
        className="mb-24"
        description={
          <div className="flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Updated 14 June 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              {isLiam ? "Maintenance phase active" : "Next full review 12 September"}
            </span>
          </div>
        }
      />

      <HeroQuoteCard
        kicker="The long view"
        quote={
          isLiam ? (
            `Liam has achieved all baseline targets. His profile now reflects a state of sustained developmental mastery.`
          ) : (
            `Most assessments are a snapshot. Yours keeps updating — so the picture stays true as ${currentChild.name} grows, not frozen at the day you got the report.`
          )
        }
        className="mb-24"
        rightNode={
          <HeroActionCard
            icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
            title={isLiam ? "Summary" : "Reminder"}
            subtitle="Download report"
          />
        }
        action={
          <div>
            <div className="mt-6 flex items-center gap-4 w-full max-w-[420px] relative">
              <div className="flex-1 h-[5px] rounded-full bg-black/5 overflow-hidden">
                <div
                  className="bg-[var(--hero-accent)] h-full rounded-full"
                  style={{ width: isLiam ? "100%" : "65%" }}
                />
              </div>
              <span className="text-[0.78rem] opacity-70 flex-shrink-0">
                {isLiam ? "100% · complete" : "65% · on track"}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 mt-1.5 relative font-semibold text-[0.84rem] opacity-80">
              {isLiam ? "Maintenance tracking enabled" : "Next full review · 12 September"}
            </div>
          </div>
        }
      />


      {/* Progress Chart Section */}
      <ProgressChartSection
        label="Progress over time"
        title={isLiam ? "Milestones achieved." : "The trend, not a single moment."}
        chartLabel={isLiam ? "Overall Developmental Consolidation" : "Focus & engagement at school"}
        chartSubtitle={isLiam ? "Goal reached in June" : "Trending up since the assessment"}
        data={activeData}
        description={isLiam 
          ? "Liam's trajectory mirrors the planned interventions perfectly. He has settled into a maintenance rhythm where new skills are generalized across home and school automatically."
          : `A steady upward trend since the assessment as the classroom strategies take hold. The predicted path is where we'd expect ${currentChild.name} to be by your first full review on 12 September.`
        }
        xAxisLabels={isLiam ? ["Mar", "Apr", "May", "Jun", "Now"] : ["14 Jun", "Jul", "Aug", "Now", "12 Sep"]}
        activeLabelIndex={3}
      />

      {/* What's Changed Section */}
      <FadeInScroll className="mb-24">
        <div className="bg-watercolor rounded-br-[36px] p-12">
          <div className="bg-white rounded-bl-[32px] p-7.5 shadow-premium">
            <div>
              <SectionLabel>
                What's changed
              </SectionLabel>
              <SectionTitle>
                {isLiam ? "Current status summaries." : "How the picture has moved."}
              </SectionTitle>
            </div>
            <div className="border-b border-black/10">
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
              ) : (
                <>
                  <AreaItem
                    title="Classroom attention"
                    description="Focus in class is improving as the strategies take hold."
                    status="Improving"
                    icon={<ArrowUpRight className="w-3 h-3 stroke-[2.4]" />}
                  />
                  <AreaItem
                    title="Emotional regulation at home"
                    description="Holding steady — likely to ease further as attention improves."
                    status="Steady"
                    icon={<Minus className="w-3 h-3 stroke-[2.4]" />}
                  />
                  <AreaItem
                    title="Sleep"
                    description="A new signal since the assessment — now on the watchlist."
                    status="Emerging"
                    icon={<Plus className="w-3 h-3 stroke-[2.4]" />}
                  />
                  <AreaItem
                    title="Friendships & social connection"
                    description="Still going well — no change needed."
                    status="Strength"
                    icon={<Check className="w-3 h-3 stroke-[2.4]" />}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </FadeInScroll>

      {/* Review Rhythm Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Your review rhythm
          </SectionLabel>
          <SectionTitle>
            Clarity that keeps up.
          </SectionTitle>
        </div>

        <div className="relative mt-1">
          <div className="absolute left-[11px] top-3.5 bottom-5 w-[2px] bg-black/10" />
          <TimelineStep
            done
            title="Assessment & first picture"
            meta="14 June · baseline established"
            description="The starting point — what's happening, what matters most, and the first plan."
          />
          <TimelineStep
            active
            title="Progress tracking"
            meta="Now · between reviews"
            description="We watch how priorities move week to week and flag anything emerging — like sleep — before it becomes urgent."
          />
          <TimelineStep
            todo
            title="First full review"
            meta="12 September · You + Threadline"
            description="Revisit priorities, update the plan, and confirm what's improved and what to focus on next."
          />
          <TimelineStep
            todo
            title="Ongoing reviews"
            meta={`Each term · As ${currentChild.name} grows`}
            description="The picture keeps updating across the years — because needs shift, and clarity shouldn't expire."
          />
        </div>
      </FadeInScroll>

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
