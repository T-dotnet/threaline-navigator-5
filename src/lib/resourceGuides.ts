import { Child, GuideCardProps } from "../types";

import img2912 from "../assets/images/IMG_2912.jpeg";
import img2947 from "../assets/images/IMG_2947.jpeg";

export interface ResourceGuide extends GuideCardProps {
  catId: string;
}

const ALL_GUIDES: ResourceGuide[] = [
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

const INTAKE_GUIDES: ResourceGuide[] = [
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

export function getResourceGuides(child: Child): ResourceGuide[] {
  const guides = child.isNew ? INTAKE_GUIDES : ALL_GUIDES;
  return guides.map((guide) => ({
    ...guide,
    description: guide.description.replace(/Maya/g, child.name),
  }));
}
