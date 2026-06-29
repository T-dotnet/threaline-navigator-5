import { motion } from "motion/react";
import {
  Clock,
  Info,
  ArrowRight,
  Moon,
  Smile,
  School,
  Users2,
  ShieldCheck,
  Download,
  Search,
  Activity,
  Eye,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Child } from "../types";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { PageIcon } from "./ui/PageIcon";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { LockerItem } from "./ui/LockerItem";
import { FactRow } from "./ui/FactRow";
import { ValueCard } from "./ui/ValueCard";
import { AreaItem } from "./ui/AreaItem";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Button } from "./ui/Button";
import { PageFooterCTA } from "./ui/PageFooterCTA";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { isMaintenancePhase } from "../lib/childStatus";

export default function EmergingDetailsPage({
  onPageChange,
}: {
  onPageChange: (page: any) => void;
}) {
  const { currentChild } = useCurrentChild();
  const isLiam = isMaintenancePhase(currentChild);
  const focusTopic = isLiam ? "Social Leadership" : "Sleep";
  const focusDescription = isLiam 
    ? `We believe advanced social mentoring is the highest leverage area for ${currentChild.name} right now, leveraging his clinical mastery into peer leadership.`
    : `We believe improving sleep is the highest leverage area for ${currentChild.name} right now, acting as a foundation for attention and mood.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        {/* Header Template */}
      <PageHeader
        kicker="Emerging · Primary focus"
        title={`A clear picture of how ${currentChild.name}'s ${focusTopic.toLowerCase()} is doing.`}
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[17ch]"
        className="mb-24"
        description={
          <div className="flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Updated 14 June 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Search className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              {isLiam ? "Consolidated from recent mastery" : "Emerging from recent observations"}
            </span>
          </div>
        }
      />

      {/* Picture Card Template */}
      <HeroQuoteCard
        kicker="The picture so far"
        quote={focusDescription}
        evidenceLevel={isLiam ? 3 : 2}
        evidenceText={isLiam ? "High, consolidated evidence" : "Moderate, emerging evidence"}
        className="mb-24"
        rightNode={
          <HeroActionCard
            icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
            title={`${focusTopic} report`}
            subtitle="Download PDF"
          />
        }
      />

      {/* Ripple/Impact Template */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            What you're seeing
          </SectionLabel>
          <SectionTitle>
            Areas {focusTopic.toLowerCase()} will affect.
          </SectionTitle>
        </div>

        <div className="border-b border-black/10">
          <AreaItem
            title={isLiam ? "Role modeling" : "Emotional regulation"}
            impact={isLiam ? "Expected outcome: Mentor confidence" : "Expected outcome: Better mood and fewer meltdowns"}
            evidence={3}
            description={isLiam 
              ? `Liam starts to guide peers through conflict resolution using the same strategies he once mastered himself.` 
              : "When sleep is consistent, the neurological capacity to manage frustration increases significantly."}
            sources={isLiam ? ["Observation", "Preschool staff"] : ["Parent Reports", "Clinical Observation"]}
          />
          <AreaItem
            title={isLiam ? "Project duration" : "School participation"}
            impact={isLiam ? "Expected outcome: 60min+ engagement" : "Expected outcome: Increased focus in morning blocks"}
            evidence={3}
            description={isLiam 
              ? `Demonstrating extreme mastery in complex, multi-day building projects without losing integration.`
              : `Reducing 'attention fog' caused by cumulative fatigue helps ${currentChild.name} engage more deeply with classmates.`}
            sources={isLiam ? ["Clinical data"] : ["Teacher Feedback"]}
          />
        </div>
      </FadeInScroll>

      {/* Proactive Strategies Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            PROACTIVE STRATEGIES
          </SectionLabel>
          <SectionTitle>
            Subtle pathways for observation.
          </SectionTitle>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 mt-8">
          <LockerItem
            icon={<Moon className="w-[19px] h-[19px] stroke-[1.8]" />}
            title="Sensory Cool-down"
            description="Keep overhead lights dim after 7:30 PM. Swap tablets for physical books or audiobooks with calm background narration."
            action="View setup guide"
            cornerClass="rounded-tl-[32px]"
          />
          <LockerItem
            icon={<Activity className="w-[19px] h-[19px] stroke-[1.8]" />}
            title="Energy Outflow"
            description="Promote physical exertion or raw energy release activities before 4:30 PM to clear adrenaline well before bedtime."
            action="See activity ideas"
            cornerClass="rounded-tr-[32px]"
          />
          <LockerItem
            icon={<Eye className="w-[19px] h-[19px] stroke-[1.8]" />}
            title="Gentle Observation"
            description="No need to change trackers. Allow natural play routines and check in if you pattern-spot afternoon fatigue."
            action="Open observation log"
            cornerClass="rounded-br-[32px]"
          />
        </div>

        <div className="mt-10 mb-24">
          <h3 className="text-[1.25rem] font-medium text-[var(--color-thread-heading)] mb-3.5 tracking-tight">
            Watchlist philosophy
          </h3>
          <p className="text-[1.05rem] text-[var(--color-thread-gray)] leading-relaxed max-w-[72ch]">
            Early watch points are designed to give you options, not rules.
            Catching sleep patterns early means we can make subtle, frictionless
            updates without ever turning it into a stressful clinic or classroom
            obligation.
          </p>
        </div>

        <div className="mb-24">
          <div>
            <SectionLabel>
              OUR FRAMEWORK
            </SectionLabel>
            <SectionTitle className="text-balance">
              Responsive and fluid update thresholds
            </SectionTitle>
          </div>
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
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
          </div>
        </div>
      </FadeInScroll>

      </PageContainer>

      {/* Footer Nav Template */}
      <PageFooterCTA
        buttonText="See all priorities"
        onClick={() => onPageChange("priorities")}
        onBackClick={() => onPageChange("home")}
        backText="Back to dashboard"
      />
    </motion.div>
  );
}







