import { Child } from "../types";
import { QUESTIONNAIRE_SECTIONS, normalizeQuestionnaireSectionName } from "../questionnaire";

export function getChildSessionStatus(child: Child) {
  if (child.intake?.sessionDay && child.intake?.sessionTime) return "booked";
  if (child.intake?.sessionCancelled) return "cancelled";
  return "not-booked";
}

export function isSessionBooked(child: Child) {
  return getChildSessionStatus(child) === "booked";
}

/**
 * Formats the booked session date, e.g. "Thu 26 Jun" (or "Thu 26 June" with
 * month: "long"). Returns undefined when no session is booked, so callers can
 * `?? fallback`. Centralizes the date string that was duplicated across pages.
 */
export function getSessionDate(child: Child, month: "short" | "long" = "short"): string | undefined {
  if (!isSessionBooked(child)) return undefined;
  const day = child.intake?.sessionDay;
  return day ? `Thu ${day} ${month === "long" ? "June" : "Jun"}` : undefined;
}

/**
 * Whether the child is an established profile in the completed-quarter /
 * maintenance phase. Currently keyed off the seeded "Liam" demo profile;
 * centralized here so the name check lives in one place.
 */
export function isMaintenancePhase(child: Child) {
  return child.name === "Liam";
}

export function isPlanNotStarted(child: Child) {
  return child.name === "Noah";
}

export function isNewChildOnboardingComplete(child: Child) {
  if (!child.isNew) return false;

  const completedSections = Array.from(
    new Set((child.intake?.completedQuestionnaireSections || []).map(normalizeQuestionnaireSectionName)),
  );
  const hasCompletedQuestionnaire = completedSections.length >= QUESTIONNAIRE_SECTIONS.length;
  const hasBookedSession = getChildSessionStatus(child) === "booked";

  return hasCompletedQuestionnaire && hasBookedSession;
}

export function getChildSubheading(child: Child) {
  if (!child.isNew) return `Age ${child.age}`;
  if (getChildSessionStatus(child) === "cancelled") return "Session cancelled";
  return isNewChildOnboardingComplete(child) ? "Assessment pending" : "Intake in progress";
}
