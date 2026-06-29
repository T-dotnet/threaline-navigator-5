import { motion } from "motion/react";
import {
  Search,
  ChevronRight,
  Download,
  Play,
  Printer,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState, useMemo, useCallback, useEffect } from "react";
import { ActionLink } from "./ui/ActionLink";
import { PageHeader } from "./ui/PageHeader";
import { SectionTitle } from "./ui/SectionTitle";
import { SectionLabel } from "./ui/SectionLabel";
import { SectionDescription } from "./ui/SectionDescription";
import { ListItemCard } from "./ui/ListItemCard";
import { FadeInScroll } from "./ui/FadeInScroll";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FilterTab } from "./ui/FilterTab";
import { GuideCard } from "./ui/GuideCard";
import { LockerItem } from "./ui/LockerItem";
import { HeroQuoteCard } from "./ui/HeroQuoteCard";
import { PageContainer } from "./ui/PageContainer";
import { useCurrentChild } from "../context/ChildContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import { isMaintenancePhase, isPlanNotStarted } from "../lib/childStatus";

import img2912 from "../assets/images/IMG_2912.jpeg";
import img2947 from "../assets/images/IMG_2947.jpeg";

const ALL_GUIDES = [
  {
    category: "Tools & Templates",
    catId: "tools",
    title: "Developing a Calming Bedtime Wind-Down",
    description:
      "A visual template with calming colour shifts — steps to swap screen time for sensory, hands-on cues that help Maya settle.",
    readTime: "8 min read",
    image: img2912,
  },
  {
    category: "Health & Clinical",
    catId: "health",
    title: "How Sleep and ADHD Interact in Growing Brains",
    description:
      "Clear, reassuring neuroscience on why dopamine profiles affect circadian rhythms — and how to work with Maya's natural bedtime schedule rather than against it.",
    readTime: "6 min read",
    image: img2947,
  },
  {
    category: "Tools & Templates",
    catId: "tools",
    title: "Questions to Discuss With Your Pediatrician",
    description:
      "A simple printable question list to bring to your next check-up, prompting useful conversations about the biological factors affecting Maya's sleep.",
    readTime: "5 min read",
    image: img2912,
  },
  {
    category: "Classroom Strategies",
    catId: "classroom",
    title: "Classroom Accommodation Strategies for ADHD Fatigue",
    description:
      "Creative, respectful options the school can use to help Maya restabilise — without feeling singled out — when fatigue spikes around 10:30 AM.",
    readTime: "10 min read",
    image: img2947,
  },
  {
    category: "Emotional Regulation",
    catId: "emotional",
    title: "Deep Breathing & Co-Regulation for Bedtime Resistance",
    description:
      "Short audio prompts and play-based breathing — like blowing out imaginary stars — for a calm, cooperative parent-child bedtime ritual.",
    readTime: "7 min read",
    image: img2912,
  },
];

const INTAKE_GUIDES = [
  {
    category: "Session Prep",
    catId: "prep",
    title: "Questions to Bring to the First Session",
    description:
      "A short planning guide for the concerns, hopes, and examples worth bringing into the first conversation.",
    readTime: "5 min read",
    image: img2912,
  },
  {
    category: "Documents",
    catId: "documents",
    title: "What to Upload Before Assessment",
    description:
      "Reports, teacher notes, work samples, and parent observations that can help the clinician understand the full picture.",
    readTime: "4 min read",
    image: img2947,
  },
  {
    category: "Observation",
    catId: "observation",
    title: "What to Notice This Week",
    description:
      "Simple prompts for spotting patterns around routines, transitions, sleep, school, and friendships before the call.",
    readTime: "6 min read",
    image: img2912,
  },
  {
    category: "Family Notes",
    catId: "prep",
    title: "Turning Concerns Into Useful Examples",
    description:
      "How to describe what you are seeing without needing clinical language or a finished explanation.",
    readTime: "7 min read",
    image: img2947,
  },
];

export default function ResourcesPage() {
  const { currentChild } = useCurrentChild();
  const { isParentClarity } = useDisplayMode();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const isLiam = isMaintenancePhase(currentChild);
  const isNoahStarting = isPlanNotStarted(currentChild);
  const isNew = Boolean(currentChild.isNew);
  const showParentClarity = isParentClarity && !isNew && !isLiam && !isNoahStarting;

  useEffect(() => {
    setFilter("all");
  }, [currentChild.name, isNew]);

  const handleClear = useCallback(() => {
    setSearch("");
    setFilter("all");
  }, []);

  const guidesWithDynamicName = useMemo(() => {
    const guides = isNew ? INTAKE_GUIDES : ALL_GUIDES;
    return guides.map(g => ({
      ...g,
      description: g.description.replace(/Maya/g, currentChild.name)
    }));
  }, [currentChild.name, isNew]);

  const filteredGuides = useMemo(() => {
    return guidesWithDynamicName.filter((g) => {
      const matchSearch =
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || g.catId === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter, guidesWithDynamicName]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-16 pb-16"
    >
      <PageContainer>
        <PageHeader
        kicker="Resource library · Clinical-grade guidance"
        title="Personalised resources."
        titleClassName="text-[2.2rem] xs:text-[2.6rem] sm:text-[3.2rem] md:text-[4rem] leading-[1.15] md:leading-[4.5rem] max-w-[16ch]"
        description={
          <>
            <SectionDescription>
              {isNew
                ? `Practical guides to help you prepare for ${currentChild.name}'s first session and assessment.`
                : `Short, practical, clinical-grade guides — tailored to ${currentChild.name}'s current focus areas, so what you see first is what's most useful right now.`}
            </SectionDescription>
            <div className="flex items-center gap-2 text-[0.8rem] text-[var(--color-thread-gray)] mt-6">
              <Check className="w-3.5 h-3.5 text-[var(--color-thread-mid-green)] stroke-[1.8]" /> {isNew ? "Sorted by intake preparation" : "Sorted by clinical focus matching"}
            </div>
          </>
        }
        className="mb-24"
      />

      <FadeInScroll className="mb-24">
        <div className="relative rounded-br-[36px] p-12 bg-watercolor">
          <HeroQuoteCard
            kicker="Featured guide"
            quote={isNew ? "Preparing for the first session." : isLiam ? "Fostering long-term developmental velocity." : isNoahStarting ? "Starting the first support plan." : showParentClarity ? "Start with the school support pack." : "Starting the upcoming school term with confidence."}
            showQuotes={false}
            className="mb-0 shadow-premium"
            description={
              isNew ? (
                `A simple way to gather notes, examples, and questions before ${currentChild.name}'s first assessment.`
              ) : isLiam ? (
                `Advanced strategies for ${currentChild.name} to generalise his social integration wins into diverse, unstructured environments.`
              ) : isNoahStarting ? (
                `Simple starter resources for ${currentChild.name}'s first support routine, focused on getting to the first useful progress signal.`
              ) : showParentClarity ? (
                `The most useful resource right now is the teacher-facing pack: a plain summary of what helps ${currentChild.name} focus, plus small classroom changes to try first.`
              ) : (
                `Strategies to manage ADHD-linked morning fatigue and prepare sensory transitions before ${currentChild.name} steps into the new classroom.`
              )
            }
            action={
              <Button
                variant="mint"
                className="relative"
                rightIcon={<ChevronRight className="w-3.5 h-3.5 stroke-[2]" />}
              >
                {showParentClarity ? "Preview teacher pack" : "Read article"}
              </Button>
            }
          />
        </div>
      </FadeInScroll>

      {/* Modules Section */}
      <FadeInScroll className="mb-24">
        <div className="mb-8">
          <span className="text-[0.68rem] tracking-[0.12em] uppercase font-medium text-[var(--color-thread-mid-green)] mb-3 block">
            AVAILABLE MODULES
          </span>
          <SectionTitle className="mb-0">
            {isNew ? `Prepare for ${currentChild.name}'s assessment.` : `Personalised to ${currentChild.name}'s focus.`}
          </SectionTitle>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-slate-400 stroke-[1.8]" />
          <Input
            type="text"
            placeholder="Search guides…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="search"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <FilterTab
            active={filter === "all"}
            label="All guides"
            onClick={() => setFilter("all")}
          />
          <FilterTab
            active={filter === (isNew ? "prep" : "tools")}
            label={isNew ? "Session Prep" : "Tools & Templates"}
            onClick={() => setFilter(isNew ? "prep" : "tools")}
          />
          <FilterTab
            active={filter === (isNew ? "documents" : "health")}
            label={isNew ? "Documents" : "Health & Clinical"}
            onClick={() => setFilter(isNew ? "documents" : "health")}
          />
          <FilterTab
            active={filter === (isNew ? "observation" : "classroom")}
            label={isNew ? "Observation" : "Classroom Strategies"}
            onClick={() => setFilter(isNew ? "observation" : "classroom")}
          />
          {!isNew && (
            <FilterTab
              active={filter === "emotional"}
              label="Emotional Regulation"
              onClick={() => setFilter("emotional")}
            />
          )}
        </div>

        <span className="text-[0.66rem] tracking-[0.16em] uppercase text-slate-400 font-medium mb-6 block">
          {filteredGuides.length}{" "}
          {filteredGuides.length === 1 ? "article" : "articles"} found
        </span>

        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {filteredGuides.map((guide, i) => {
              const cornerClasses = [
                "rounded-tr-[32px]",
                "rounded-tl-[32px]",
                "rounded-br-[32px]",
                "rounded-bl-[32px]",
              ];
              const cornerClass = cornerClasses[i % cornerClasses.length];
              return <GuideCard key={i} {...guide} cornerClass={cornerClass} />;
            })}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-black/10 rounded-2xl text-slate-500">
            No guides match your search.
            <ActionLink
              variant="default"
              as="button"
              onClick={handleClear}
              className="mt-3 block mx-auto font-medium"
            >
              Clear search
            </ActionLink>
          </div>
        )}
      </FadeInScroll>

      {/* Directory Section */}
      <FadeInScroll className="mb-24">
        <div className="mb-6">
          <SectionLabel>
            Browse directory
          </SectionLabel>
          <SectionTitle>
            Browse by topic.
          </SectionTitle>
        </div>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {(isNew ? [
            "First session preparation",
            "Documents to gather",
            "Home observations",
            "School notes",
            "Daily routines",
            "Questions for clinicians",
          ] : [
            "Understanding ADHD",
            "Emotional Regulation",
            "School Support",
            "Learning & Cognition",
            "Daily Routines",
            "Working with Professionals",
          ]).map((t, i) => (
            <ListItemCard key={i} className="bg-white border-white/5 transition-all">
              {t}
            </ListItemCard>
          ))}
        </div>
      </FadeInScroll>

      {/* Locker Section */}
      <FadeInScroll className="mb-24">
        <div>
          <SectionLabel>
            Aids & exercises locker
          </SectionLabel>
          <SectionTitle>
            Quick activities locker.
          </SectionTitle>
        </div>

        <div className="relative rounded-br-[36px] p-12 bg-watercolor">
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            <LockerItem
              icon={<Download className="w-[19px] h-[19px] stroke-[1.8]" />}
              title="Download templates"
              description="Editable letter templates, transition checklists and customisable behaviour journals."
              action="Download printable PDFs"
              cornerClass="rounded-tl-[32px]"
              className="shadow-premium border border-black/[0.03]"
            />
            <LockerItem
              icon={<Play className="w-[19px] h-[19px] stroke-[1.8]" />}
              title="Watch short videos"
              description="5-minute play-based co-regulation tactics designed for real parents."
              action="Launch video player"
              cornerClass="rounded-tr-[32px]"
              className="shadow-premium border border-black/[0.03]"
            />
            <LockerItem
              icon={<Printer className="w-[19px] h-[19px] stroke-[1.8]" />}
              title="Print classroom guides"
              description="Double-sided sheets designed for teachers, tutors and clinical aides."
              action="Generate print format"
              cornerClass="rounded-br-[32px]"
              className="shadow-premium border border-black/[0.03]"
            />
          </div>
        </div>
      </FadeInScroll>
      </PageContainer>
    </motion.div>
  );
}
