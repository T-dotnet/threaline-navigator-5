import { motion } from "motion/react";
import { Clock, Users, ArrowRight, Download } from "lucide-react";
import { cn } from "../lib/utils";
import { Child } from "../types";
import { getChildData } from "../data";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { PageIcon } from "./ui/PageIcon";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { InsightCard } from "./ui/InsightCard";
import { ValueCard } from "./ui/ValueCard";
import { AreaItem } from "./ui/AreaItem";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Button } from "./ui/Button";
import { PageFooterCTA } from "./ui/PageFooterCTA";
import { GuideCard } from "./ui/GuideCard";

import img2912 from "../assets/images/IMG_2912.jpeg";
import img2947 from "../assets/images/IMG_2947.jpeg";
import creativePlayImg from "../assets/images/classroom_fatigue_thumbnail_1781935350699.jpg";
import empathyImg from "../assets/images/breathing_exercises_thumbnail_1781935364678.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";

export default function UnderstandingPage({
  onPageChange,
}: {
  onPageChange: (page: any) => void;
}) {
  const { currentChild } = useCurrentChild();
  const data = getChildData(currentChild).understanding;
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






