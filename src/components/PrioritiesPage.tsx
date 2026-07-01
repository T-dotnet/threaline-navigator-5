import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Clock, Info, Download } from "lucide-react";
import { cn } from "../lib/utils";
import { Page } from "../types";

import { PageHeader } from "./ui/PageHeader";
import { PageMetaRow } from "./ui/PageMetaRow";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { HeroActionCard } from "./ui/HeroActionCard";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { ListItemCard } from "./ui/ListItemCard";
import { FadeInScroll } from "./ui/FadeInScroll";
import { TimelineItem } from "./ui/TimelineItem";
import { InsightSection } from "./ui/InsightSection";
import { PageFooterCTA } from "./ui/PageFooterCTA";

import img2912 from "../assets/images/IMG_2912.jpeg";
import classroomImg from "../assets/images/optimized/classroom-fatigue-900.jpg";
import breathingImg from "../assets/images/optimized/breathing-exercises-900.jpg";
import pediatricianImg from "../assets/images/optimized/pediatrician-questions-900.jpg";

import { PageContainer } from "./ui/PageContainer";

import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";

export default function PrioritiesPage({
  onPageChange,
}: {
  onPageChange: (page: Page) => void;
}) {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const isLiam = isMaintenancePhase(currentChild);
  const isNoahStarting = isPlanNotStarted(currentChild);
  const showParentClarity = isParentClarity && !currentChild.isNew && !isLiam && !isNoahStarting;
  const [activePriorityId, setActivePriorityId] = useState("sleep");

  const newChildConnectionData = useMemo(() => [
    {
      id: "impact",
      label: "First weighting",
      title: "Daily impact",
      description: `A clinician looks for the area that is affecting ${currentChild.name}'s everyday life most often: learning, home routines, emotions, sleep, communication, or participation. High-impact patterns often move closer to Now because easing them can quickly reduce pressure elsewhere.`,
      image: classroomImg,
    },
    {
      id: "timing",
      label: "Developmental timing",
      title: "Timing",
      description: "Some needs can safely be watched for a little longer. Others become harder if support is delayed. Priorities shift when a pattern is starting to affect confidence, access to learning, family stress, or the child's sense of safety.",
      image: pediatricianImg,
    },
    {
      id: "load",
      label: "Family context",
      title: "Family capacity",
      description: "The plan has to fit real life. A clinician weighs what the family can reasonably do now, what support is available from school or services, and which next step will help without adding too much burden.",
      image: breathingImg,
    },
    {
      id: "dependencies",
      label: "Connection check",
      title: "Dependencies",
      description: "Priorities connect. Sleep can affect attention, attention can affect learning, communication can affect behaviour, and sensory load can affect routines. The clinician chooses the first step by asking which support is most likely to unlock progress in the others.",
      image: img2912,
    },
  ], [currentChild.name]);

  const prioritiesData = useMemo(() => [
    {
      id: isLiam ? "review-evidence" : "sleep",
      label: isLiam ? "Review input" : isNoahStarting ? "Watch first" : "On the watchlist",
      title: isLiam ? "Review evidence" : isNoahStarting ? "Settling rhythm" : "Sleep",
      description: isLiam
        ? "The next priority order should start from review evidence: what stayed stable, what changed, and whether any new pattern is strong enough to become the next focus."
        : isNoahStarting
        ? "Noah's day-to-day rhythm is not the Now priority, but it may affect whether the first school support is easy to repeat."
        : showParentClarity
        ? `Sleep is not a ranked priority yet. We are watching it because tired mornings can make ${currentChild.name}'s focus harder at school.`
        : `Not a ranked priority yet — but because sleep can feed into attention, we're keeping an eye on ${currentChild.name}'s patterns. If the signal grows, it may move into Now or Next.`,
      image: img2912
    },
    {
      id: isLiam ? "maintenance" : "attention",
      label: isLiam ? "Current rhythm" : isNoahStarting ? "First focus" : "Current focus",
      title: isLiam ? "Maintenance" : isNoahStarting ? "Classroom starting routine" : "Attention",
      description: isLiam
        ? "Because the quarter is complete, the default rhythm is maintenance. The review decides whether to keep it light or open a new active focus."
        : isNoahStarting
        ? "Noah's first support target is classroom focus, but progress has not started yet. The aim is to make one support routine visible and repeatable."
        : showParentClarity
        ? `This is the main thing to act on now. Helping ${currentChild.name} focus in class should make school feel easier and may reduce knock-on frustration at home.`
        : `Addressing ${currentChild.name}'s classroom focus is our primary objective. Strengthening this foundation is the most effective way to unlock progress in learning and peer socialisation.`,
      image: classroomImg
    },
    {
      id: isLiam ? "capacity" : "regulation",
      label: isLiam ? "Family fit" : isNoahStarting ? "Next support" : "Next phase",
      title: isLiam ? "Capacity" : isNoahStarting ? "After-school reset" : "Emotional regulation",
      description: isLiam
        ? "The next plan should fit family capacity after a completed quarter. A strong result does not automatically mean adding more work."
        : isNoahStarting
        ? "Home regulation matters, but it should not become a second plan before the first school routine has had a chance to settle."
        : showParentClarity
        ? `Frustration at home matters, but it likely gets easier once school focus improves. That is why it is next, not ignored.`
        : `Once attention stability is established, we'll pivot to proactive emotional tools. This sequence prevents 'effort fatigue' by focusing on one core skill set at a time.`,
      image: breathingImg
    },
    {
      id: isLiam ? "decision" : "school",
      label: isLiam ? "After review" : isNoahStarting ? "Keep steady" : "Long-term goal",
      title: isLiam ? "New order" : isNoahStarting ? "Group confidence" : "School participation",
      description: isLiam
        ? "Now, Next, and Later become visible again only after the review. Until then, the page should communicate completion and preparation, not a guessed next sequence."
        : isNoahStarting
        ? "Noah has social strengths to protect. This stays later for now so the first plan can focus on access to learning without overloading the week."
        : showParentClarity
        ? `The bigger goal is for ${currentChild.name} to feel confident and included at school. The current steps are building toward that.`
        : `Meaningful engagement in school life is the ultimate outcome of our current work. Every focus area we tackle today is a building block for this future independence.`,
      image: pediatricianImg
    }
  ], [isLiam, isNoahStarting, showParentClarity, currentChild.name]);

  const connectionData = currentChild.isNew ? newChildConnectionData : prioritiesData;
  const activePriority = connectionData.find(p => p.id === activePriorityId) || connectionData[0];

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
        titleClassName="md:leading-[4.5rem]"
        titleWidthClassName="max-w-[16ch]"
        className={currentChild.isNew ? "mb-12" : "mb-28"}
        description={
          <PageMetaRow
            items={[
              { icon: Clock, children: "Updated 14 June 2026" },
              {
                icon: Info,
                children: currentChild.isNew
                  ? "Draft until clinician review"
                  : `Built from ${currentChild.name}'s understanding profile`,
              },
            ]}
          />
        }
      />

      {currentChild.isNew ? (
        <FadeInScroll className="mb-24">
          <div className="w-full overflow-hidden shadow-none">
            <HeroQuoteCard
              kicker="How we prioritise"
              quote={`We don't hand you a list of everything. We rank what matters by its real impact on ${currentChild.name} — and show the reasoning behind every call.`}
              className="shadow-none"
              rightNode={
                <HeroActionCard
                  icon={<Info className="w-[22px] h-[22px] stroke-[1.7]" />}
                  title="Draft method"
                  subtitle="Clinician-led"
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
          </div>
        </FadeInScroll>
      ) : (
        <FadeInScroll className="mb-24">
          <HeroQuoteCard
            kicker="How we prioritise"
            quote={
              isLiam
                ? "Liam has met the goals for this quarter. The next Now, Next, and Later order will be decided with the clinician after the upcoming review session."
                : isNoahStarting
                ? "Noah's page uses the same priority structure as an assessed profile, but the plan is at the start line: the first focus is ready, and progress evidence is still to come."
                : showParentClarity
                ? `${currentChild.name}'s plan starts with classroom attention because it is the clearest lever. Sleep stays on the watchlist, and home regulation comes next if it does not ease.`
                : `We don't hand you a list of everything. We rank what matters by its real impact on ${currentChild.name} — and show the reasoning behind every call.`
            }
            className="h-full"
            rightNode={
              <HeroActionCard
                icon={<Download className="w-[22px] h-[22px] stroke-[1.7]" />}
                title={isLiam ? "Review prep" : isNoahStarting ? "Priority list" : "Priority list"}
                subtitle={isLiam ? "Next session" : isNoahStarting ? "Starting point" : "Download PDF"}
              />
            }
            action={
              <p className="text-[0.84rem] opacity-70 relative leading-relaxed max-w-[48ch]">
                {isLiam ? (
                  <>
                    The next order will be based on{" "}
                    <strong className="opacity-100">review evidence</strong>,{" "}
                    <strong className="opacity-100">what has stayed stable</strong>,{" "}
                    <strong className="opacity-100">family capacity</strong>, and{" "}
                    <strong className="opacity-100">whether enrichment or maintenance is the right next rhythm</strong>.
                  </>
                ) : isNoahStarting ? (
                  <>
                    Each priority is weighed by{" "}
                    <strong className="opacity-100">day-to-day impact</strong>,{" "}
                    <strong className="opacity-100">what can start cleanly</strong>,{" "}
                    <strong className="opacity-100">family capacity</strong>, and{" "}
                    <strong className="opacity-100">what will create useful first evidence</strong>.
                  </>
                ) : (
                  <>
                    Each priority is weighed by{" "}
                    <strong className="opacity-100">{showParentClarity ? "day-to-day impact" : "functional impact"}</strong>,{" "}
                    <strong className="opacity-100">{showParentClarity ? "what might get harder if we wait" : "developmental risk"}</strong>,{" "}
                    <strong className="opacity-100">{showParentClarity ? "family load" : "family burden"}</strong>,{" "}
                    <strong className="opacity-100">{showParentClarity ? "what feels doable now" : "family capacity"}</strong>, and{" "}
                    <strong className="opacity-100">
                      how priorities depend on one another
                    </strong>
                    .
                  </>
                )}
              </p>
            }
          />
        </FadeInScroll>
      )}

      <FadeInScroll className="mb-24">
        {currentChild.isNew ? (
          <div className="space-y-6">
            <div>
              <SectionLabel>
                How priorities are decided
              </SectionLabel>
              <SectionTitle>
                What Now, Next, and Later mean.
              </SectionTitle>
            </div>

            <div className="mt-6 flex flex-col">
              {[
                {
                  label: "Now",
                  title: "The clearest first lever",
                  description: "This is the area where support is most likely to reduce pressure quickly or prevent something important from getting harder.",
                  active: true,
                  note: "This is where the final plan will start.",
                },
                {
                  label: "Next",
                  title: "Important, but not first",
                  description: "This still matters. It may depend on the Now focus, need more information, or be easier once the first support is in place.",
                  active: false,
                },
                {
                  label: "Later",
                  title: "Safe to monitor",
                  description: "Later does not mean ignored. It means the clinician will keep watching it, but it does not need to carry today's attention.",
                  active: false,
                },
              ].map((item) => (
                <div key={item.label} className="border-t border-black/10">
                  <div className="flex items-start md:items-center justify-between gap-4 py-6 px-2">
                    <div className="flex-1 flex flex-col items-start gap-1.5 md:flex-row md:items-start md:gap-4">
                      <span
                        className={cn(
                          "text-[0.75rem] tracking-[0.15em] font-medium md:w-12 flex-shrink-0 uppercase",
                          item.active
                            ? "text-[var(--color-thread-mid-green)]"
                            : "text-[var(--color-thread-placeholder)]",
                        )}
                      >
                        {item.label}
                      </span>
                      <div className="flex-1">
                        <div
                          className={cn(
                            "text-[1.18rem] font-medium tracking-tight",
                            item.active
                              ? "text-[var(--color-thread-heading)]"
                              : "text-[var(--color-thread-dark-slate)]",
                          )}
                        >
                          {item.title}
                        </div>
                        <p className="mt-2 text-[0.96rem] text-[var(--color-thread-gray)] leading-relaxed max-w-[60ch]">
                          {item.description}
                        </p>
                        {item.note && (
                          <div className="mt-4 text-[0.78rem] font-medium text-[var(--color-thread-mid-green)]">
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-b border-black/10" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <SectionLabel>
                {isLiam ? "Completed quarter" : "Now · Next · Later"}
              </SectionLabel>
              <SectionTitle>
                {isLiam ? "Next priorities will be set after review." : isNoahStarting ? "Three priorities, ready to begin." : showParentClarity ? "What to act on now, next, and later." : "Three priorities, in order."}
              </SectionTitle>
            </div>

            <div className="mt-6 flex flex-col">
              {isLiam ? (
                <>
                  <TimelineItem
                    tag="New"
                    title="This quarter's plan"
                    meta="100% complete · Maintenance active"
                    content="Liam has met the current quarter goals. The routines that helped should stay steady while the review evidence is gathered."
                    facts={{
                      "Plan progress": "100%",
                      "Clinical confidence": "High",
                      "Family burden": "Low",
                      "Current rhythm": "Maintain",
                    }}
                    dependency="This closes the current plan before a new <strong>Now · Next · Later</strong> order is agreed."
                    progress={100}
                    active
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Then"
                    title="Next review session"
                    meta="12 December · Clinician-led decision"
                    content="The clinician will review what stayed stable, what has changed, and whether Liam needs enrichment goals, light maintenance, or a new support focus."
                    facts={{
                      "Decision owner": "Clinician",
                      "Parent role": "Bring observations",
                      "Priority order": "Not set yet",
                    }}
                    dependency="The next <strong>Now</strong>, <strong>Next</strong>, and <strong>Later</strong> priorities are decided after this review."
                    progress={0}
                    isCollapsible={false}
                    hideMetrics
                  />
                  <TimelineItem
                    tag="Later"
                    title="New priority order"
                    meta="After review · Not assumed"
                    content="Threadline should not carry forward old priorities as if they are still active. Once the review is complete, this page can show the new order with evidence and rationale."
                    facts={{
                      "Now": "To be decided",
                      "Next": "To be decided",
                      "Later": "To be decided",
                    }}
                    dependency="Until then, the experience should reinforce <strong>completion</strong>, <strong>maintenance</strong>, and <strong>review preparation</strong>."
                    progress={0}
                    isCollapsible={false}
                    hideMetrics
                  />
                </>
              ) : (
                <>
                  <TimelineItem
                    tag="Now"
                    title={isNoahStarting ? "Classroom starting routine" : "Classroom attention"}
                    meta={isNoahStarting ? "High impact · ready to begin" : "High impact · clearest theme across every source"}
                    content={isNoahStarting
                      ? "Noah's first priority is classroom focus, but this is still a starting point. The useful next signal is whether one routine can be repeated without adding too much pressure."
                      : showParentClarity
                      ? `${currentChild.name}'s classroom focus is the clearest place to act now. If school feels easier, confidence and home routines often get easier too.`
                      : `Trouble staying focused in class is currently the biggest drag on ${currentChild.name}'s learning and self-confidence. Addressing it first tends to make other supports work better too.`}
                    facts={{
                      "Functional impact": "High",
                      "Developmental risk": "Moderate",
                      "Family burden": "Moderate",
                      "Family capacity": "Strong",
                    }}
                    dependency={isNoahStarting ? "First progress here should create cleaner evidence for <strong>home regulation</strong> and <strong>school participation</strong>." : showParentClarity ? "This is expected to help with <strong>home frustration</strong> and <strong>school participation</strong>." : "Progress here should also ease <strong>Emotional regulation</strong> and <strong>school participation</strong>."}
                    progress={isNoahStarting ? 0 : 35}
                    active
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Next"
                    title={isNoahStarting ? "After-school reset" : "Emotional regulation at home"}
                    meta={isNoahStarting ? "Moderate impact · prepare once the first routine starts" : "Moderate impact · prepare over coming months"}
                    content={isNoahStarting
                      ? "After-school emotion and fatigue matter, but they should sit behind the first classroom routine for now. Once the school support is underway, this becomes easier to understand."
                      : showParentClarity
                      ? "Frustration around homework and routine changes is real. We are not ignoring it; we are giving attention-first support a chance to lower the pressure before adding another plan."
                      : "Frustration around homework and changes in routine is real, and it's hard on home life. But it sits downstream of attention — so we expect it to ease as focus improves. That's why it's next, not now: tackling attention first does double duty."}
                    facts={{
                      "Functional impact": "Moderate",
                      "Emotional distress": "Moderate",
                      "Family burden": "High",
                      "Depends on": "Attention",
                    }}
                    dependency={isNoahStarting ? "Linked to <strong>Classroom starting routine</strong> — revisit once the first support has real evidence." : "Linked to <strong>Classroom attention</strong> — we'll revisit this as that improves."}
                    progress={isNoahStarting ? 0 : 15}
                    isCollapsible={false}
                  />
                  <TimelineItem
                    tag="Later"
                    title={isNoahStarting ? "Group confidence" : "Friendships & social connection"}
                    meta={isNoahStarting ? "Safe to protect · not a task today" : "Safe to wait · currently a strength"}
                    content={isNoahStarting ? "Noah's connection with familiar adults and peers is a useful strength. It stays later so the first plan can focus on school access without turning every area into work." : `${currentChild.name} has warm, steady friendships and real empathy — this is going well, so it doesn't need your attention today. Naming it 'later' is deliberate: it means you can set it down without worrying you've missed something.`}
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
          </>
        )}
      </FadeInScroll>

      {/* Connect Section */}
      <FadeInScroll className="mb-12">
        <div>
          <SectionLabel>
            How these connect
          </SectionLabel>
          {!currentChild.isNew && (
            <SectionTitle>
              {isLiam ? "Review factors will shape the next order." : "Priorities aren't independent."}
            </SectionTitle>
          )}
          {currentChild.isNew && (
            <>
              <SectionTitle>
                Each factor changes the others.
              </SectionTitle>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch mb-6 w-full">
          {connectionData.map((priority) => (
            <ListItemCard 
              key={priority.id}
              active={activePriority.id === priority.id}
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
        equalHeight={currentChild.isNew}
        hierarchy={currentChild.isNew ? "supporting" : "default"}
      />

      </PageContainer>

      {/* Forward Button */}
      <PageFooterCTA
        title={currentChild.isNew ? "Priority order will become clearer after review." : isLiam ? "The next priority order will be set in review." : "Now you know what matters most."}
        buttonText={currentChild.isNew ? "Back to understanding" : "See progress reviews"}
        onClick={() => onPageChange(currentChild.isNew ? "understanding" : "reviews")}
      />
    </motion.div>
  );
}
