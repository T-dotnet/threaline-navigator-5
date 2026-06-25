import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Clock, Info, ArrowRight, Download, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

import { Child } from "../types";
import { PageHeader } from "./ui/PageHeader";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { FactRow } from "./ui/FactRow";
import { PageIcon } from "./ui/PageIcon";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { ListItemCard } from "./ui/ListItemCard";
import { FadeInScroll } from "./ui/FadeInScroll";
import { ActionLink } from "./ui/ActionLink";
import { Button } from "./ui/Button";
import { TimelineItem } from "./ui/TimelineItem";
import { PriorityCard } from "./ui/PriorityCard";
import { InsightSection } from "./ui/InsightSection";
import { PageFooterCTA } from "./ui/PageFooterCTA";

import img2912 from "../assets/images/IMG_2912.jpeg";
import classroomImg from "../assets/images/classroom_fatigue_thumbnail_1781935350699.jpg";
import breathingImg from "../assets/images/breathing_exercises_thumbnail_1781935364678.jpg";
import pediatricianImg from "../assets/images/pediatrician_questions_thumbnail_1781935339183.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";

export default function PrioritiesPage({
  onPageChange,
}: {
  onPageChange: (page: any) => void;
}) {
  const { currentChild } = useCurrentChild();
  const isLiam = currentChild.name === "Liam";
  const [activePriorityId, setActivePriorityId] = useState("sleep");

  const prioritiesData = useMemo(() => [
    {
      id: "sleep",
      label: "On the watchlist",
      title: "Sleep",
      description: isLiam 
        ? "Liam's sleep hygiene remains optimal. We are maintaining current wind-down routines to support his high-performance learning phases."
        : `Not a ranked priority yet — but because sleep can feed into attention, we're keeping an eye on ${currentChild.name}'s patterns. If the signal grows, it may move into Now or Next.`,
      image: img2912
    },
    {
      id: "attention",
      label: "Current focus",
      title: "Attention",
      description: `Addressing ${currentChild.name}'s classroom focus is our primary objective. Strengthening this foundation is the most effective way to unlock progress in learning and peer socialisation.`,
      image: classroomImg
    },
    {
      id: "regulation",
      label: "Next phase",
      title: "Emotional regulation",
      description: `Once attention stability is established, we'll pivot to proactive emotional tools. This sequence prevents 'effort fatigue' by focusing on one core skill set at a time.`,
      image: breathingImg
    },
    {
      id: "school",
      label: "Long-term goal",
      title: "School participation",
      description: `Meaningful engagement in school life is the ultimate outcome of our current work. Every focus area we tackle today is a building block for this future independence.`,
      image: pediatricianImg
    }
  ], [isLiam, currentChild.name]);

  const activePriority = prioritiesData.find(p => p.id === activePriorityId) || prioritiesData[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Priorities · What matters most"
        title="Where to focus — and why."
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[16ch]"
        className="mb-28"
        description={
          <div className="flex gap-4.5 text-[0.82rem] text-[var(--color-thread-gray)] flex-wrap">
            <span className="flex items-center gap-1.5">
              <Clock className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Updated 14 June 2026
            </span>
            <span className="flex items-center gap-1.5">
              <Info className="w-[15px] h-[15px] stroke-[1.8] text-[var(--color-thread-mid-green)]" />{" "}
              Built from {currentChild.name}'s understanding profile
            </span>
          </div>
        }
      />

      <FadeInScroll className="mb-24">
        <HeroQuoteCard
          kicker="How we prioritise"
          quote={
            isLiam
              ? "Liam has met his core goals. We now prioritize advanced social integration and leadership-readiness milestones."
              : `We don't hand you a list of everything. We rank what matters by its real impact on ${currentChild.name} — and show the reasoning behind every call.`
          }
          className="h-full"
          rightNode={
            <HeroActionCard
              icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
              title="Priority list"
              subtitle="Download PDF"
            />
          }
          action={
            <p className="text-[0.84rem] opacity-70 relative leading-relaxed max-w-[48ch]">
              Each priority is weighed by{" "}
              <strong className="opacity-100">functional impact</strong>,{" "}
              <strong className="opacity-100">developmental risk</strong>,{" "}
              <strong className="opacity-100">family burden</strong>,{" "}
              <strong className="opacity-100">family capacity</strong>, and{" "}
              <strong className="opacity-100">
                how priorities depend on one another
              </strong>
              .
            </p>
          }
        />
      </FadeInScroll>

      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Now · Next · Later
          </SectionLabel>
          <SectionTitle>
            {isLiam ? "Everything is on track." : "Three priorities, in order."}
          </SectionTitle>
        </div>

        <div className="mt-6 flex flex-col">
          {isLiam ? (
            <>
              <TimelineItem
                tag="Done"
                title="Transitional Irritability"
                meta="Completed · Strategic co-regulation in place"
                content="Liam has internalised several calming routines. He now identifies frustration triggers early and self-corrects without adult intervention in 90% of observed sessions."
                facts={{
                  "Functional impact": "High",
                  "Success rate": "Strong",
                  "Family burden": "Low",
                  "Family capacity": "Strong",
                }}
                dependency="This success allows us to move towards <strong>Advanced Creative Depth</strong>."
                progress={100}
                active
                isCollapsible={false}
              />
              <TimelineItem
                tag="Done"
                title="Task Retention"
                meta="Completed · Excellent creative depth"
                content="Memory and task sequencing are now strengths. Liam can follow multi-step instructions and remain engaged in complex play for over 45 minutes."
                facts={{
                  "Retention score": "High",
                  "Task completion": "Strong",
                  "Clinical confidence": "High",
                }}
                dependency="Liam is ready for <strong>Peer Leadership</strong> roles in small group settings."
                progress={100}
                isCollapsible={false}
              />
            </>
          ) : (
            <>
              <TimelineItem
                tag="Now"
                title="Classroom attention"
                meta="High impact · clearest theme across every source"
                content={`Trouble staying focused in class is currently the biggest drag on ${currentChild.name}'s learning and self-confidence. Addressing it first tends to make other supports work better too.`}
                facts={{
                  "Functional impact": "High",
                  "Developmental risk": "Moderate",
                  "Family burden": "Moderate",
                  "Family capacity": "Strong",
                }}
                dependency="Progress here should also ease <strong>Emotional regulation</strong> and <strong>school participation</strong>."
                progress={35}
                active
                isCollapsible={false}
              />
              <TimelineItem
                tag="Next"
                title="Emotional regulation at home"
                meta="Moderate impact · prepare over coming months"
                content="Frustration around homework and changes in routine is real, and it's hard on home life. But it sits downstream of attention — so we expect it to ease as focus improves. That's why it's next, not now: tackling attention first does double duty."
                facts={{
                  "Functional impact": "Moderate",
                  "Emotional distress": "Moderate",
                  "Family burden": "High",
                  "Depends on": "Attention",
                }}
                dependency="Linked to <strong>Classroom attention</strong> — we'll revisit this as that improves."
                progress={15}
                isCollapsible={false}
              />
              <TimelineItem
                tag="Later"
                title="Friendships & social connection"
                meta="Safe to wait · currently a strength"
                content={`${currentChild.name} has warm, steady friendships and real empathy — this is going well, so it doesn't need your attention today. Naming it 'later' is deliberate: it means you can set it down without worrying you've missed something.`}
                facts={{
                  "Functional impact": "Low",
                  "Developmental risk": "Low",
                }}
                dependency="We'll surface this again if anything changes."
                progress={0}
                isCollapsible={false}
              />
            </>
          )}
          <div className="border-b border-black/10" />
        </div>
      </FadeInScroll>

      {/* Connect Section */}
      <FadeInScroll className="mb-12">
        <div>
          <SectionLabel>
            How these connect
          </SectionLabel>
          <SectionTitle>
            Priorities aren't independent.
          </SectionTitle>
        </div>
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch mb-6 w-full">
          {prioritiesData.map((priority) => (
            <ListItemCard 
              key={priority.id}
              active={activePriorityId === priority.id}
              onClick={() => setActivePriorityId(priority.id)}
            >
              {priority.title}
            </ListItemCard>
          ))}
        </div>
      </FadeInScroll>

      {/* Watchlist Sleep Section */}
      <InsightSection
        className="mb-24"
        kicker={activePriority.label}
        title={activePriority.title}
        description={activePriority.description}
        image={activePriority.image}
      />

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title="Now you know what matters most."
        buttonText="See what to do"
        onClick={() => onPageChange("roadmap")}
      />
    </motion.div>
  );
}
