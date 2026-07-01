import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Camera,
  Check,
  FileText,
  Folder,
  Home,
  PenLine,
  School,
  Stethoscope,
} from 'lucide-react';
import {
  getGrowthDomains,
  getQuestionnaireDomainSignals,
} from '../../lib/reflectionDeck';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';
import { FloatingDiaryEntries } from './reflection-deck/FloatingDiaryEntries';
import { SectionLabel } from './SectionLabel';
import { SectionTitle } from './SectionTitle';
import { SlideFooter } from './reflection-deck/SlideFooter';
import { WholeMindWheel } from './reflection-deck/WholeMindWheel';

export interface ReflectionDeckData {
  childName: string;
  navigatorHelp: string;
  nextStep: string;
  selectedNotices: string[];
  availableInfo: string[];
  questionnaireAnswers?: Record<string, unknown>;
}

interface ReflectionDeckProps extends ReflectionDeckData {
  onBackToSetup: () => void;
  onGoToProfile: () => void;
  onSetUpAnotherChild: () => void;
}

// Shared heading style for completion slides — matches the onboarding flow's
// serif step headings (see AddChildFlow stepHeadingClass) so the whole /setup
// flow reads as one consistent experience.
const SLIDE_HEADING_CLASS =
  'font-serif font-normal text-[2rem] sm:text-[2.35rem] leading-[1.12] tracking-tight text-[var(--color-thread-heading)]';

export function ReflectionDeck({
  childName,
  navigatorHelp,
  nextStep,
  selectedNotices,
  availableInfo,
  questionnaireAnswers,
  onBackToSetup,
  onGoToProfile,
  onSetUpAnotherChild,
}: ReflectionDeckProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const questionnaireSignals = useMemo(
    () => getQuestionnaireDomainSignals(selectedNotices, questionnaireAnswers),
    [questionnaireAnswers, selectedNotices],
  );
  const selectedDomains = useMemo(() => questionnaireSignals.map((signal) => signal.key), [questionnaireSignals]);
  const growthDomains = useMemo(() => getGrowthDomains(selectedDomains, availableInfo), [availableInfo, selectedDomains]);
  const cleanedInfo = useMemo(() => availableInfo.filter((item) => item !== 'Nothing yet'), [availableInfo]);
  const hasSchoolContext = cleanedInfo.some((item) => item === 'School reports' || item === 'Teacher observations');
  const hasClinicianContext = cleanedInfo.some(
    (item) =>
      item === 'GP or paediatrician reports' ||
      item === 'Psychology reports' ||
      item === 'Speech reports' ||
      item === 'OT reports' ||
      item === 'Previous assessments',
  );

  const slides = [
    {
      id: 'whole-mind-profile',
      content: (
        <div className="grid xl:grid-cols-[0.82fr_1.18fr] gap-8 items-stretch">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <SectionLabel>Your Whole Mind Profile</SectionLabel>
                <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
                  Meet {childName}&apos;s Whole Mind Profile
                </SectionTitle>
              </div>

              <div className="space-y-2">
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  You&apos;ve helped us begin building {childName}&apos;s Whole Mind Profile.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Every conversation, questionnaire, report and clinician review adds another piece to the
                  picture. Today you&apos;ve taken the very first step.
                </p>
              </div>
            </div>

            <div className="space-y-5 pt-1">
              <div>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)] mb-5">
                  Here&apos;s where the picture is beginning to take shape.
                </p>
                {questionnaireSignals.length > 0 ? (
                  <div className="space-y-3">
                    {questionnaireSignals.map((signal, index) => (
                      <motion.div
                        key={signal.key}
                        className="flex items-start gap-3 text-[0.98rem] text-[var(--color-thread-heading)]"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 + index * 0.05 }}
                      >
                        <span className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center text-[var(--color-thread-mid-green)] flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block">{signal.label}</span>
                          <span className="mt-1 block text-[0.78rem] leading-relaxed text-[var(--color-thread-gray)]">
                            {signal.sources.slice(0, 2).join(' · ')}
                          </span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                    The profile will start showing domains once answers are added.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <p className="text-[1rem] font-medium leading-snug text-[var(--color-thread-heading)] mb-1.5">
                  This isn&apos;t a diagnosis or a final answer.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  It&apos;s an early, living picture that will grow clearer as we learn more about {childName}.
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-[var(--color-thread-off-white)] h-full">
            <CardContent className="p-5 sm:p-6 h-full flex items-center justify-center">
              <WholeMindWheel childName={childName} activeKeys={selectedDomains} variant="intro" />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: 'story-grows',
      content: (
        <div className="grid xl:grid-cols-[0.82fr_1.18fr] gap-8 items-stretch">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <SectionLabel>How {childName}&apos;s profile grows</SectionLabel>
                <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
                  Your child&apos;s story grows over time
                </SectionTitle>
              </div>

              <div className="space-y-2">
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  The more we learn, the clearer the picture becomes.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Today&apos;s answers were just the beginning. {childName}&apos;s Whole Mind Profile grows as new
                  information is added, from home, school, clinicians and everyday life.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {[
                {
                  icon: Home,
                  title: 'Everyday observations',
                  description: 'From you and your family.',
                },
                {
                  icon: FileText,
                  title: 'Reports',
                  description: 'School reports, assessments and letters can be added whenever you have them.',
                },
                {
                  icon: School,
                  title: 'School information',
                  description: hasSchoolContext
                    ? 'Teachers, observations and feedback are already shaping the picture.'
                    : 'Teachers, observations and feedback can be added as they become useful.',
                },
                {
                  icon: Stethoscope,
                  title: 'Clinician insights',
                  description: hasClinicianContext
                    ? 'Conversations, reviews and expert input will add depth without losing your context.'
                    : 'Conversations, reviews and expert input will layer in as the assessment moves forward.',
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 + index * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-medium leading-snug text-[var(--color-thread-heading)] mb-1.5">
                      {title}
                    </h3>
                    <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="bg-[var(--color-thread-off-white)] h-full">
            <CardContent className="p-5 sm:p-6 h-full flex items-center justify-center">
              <WholeMindWheel childName={childName} activeKeys={growthDomains} variant="growth" />
            </CardContent>
          </Card>
          </div>
      ),
    },
    {
      id: 'navigator-help',
      content: (
        <div className="grid xl:grid-cols-[0.82fr_1.18fr] gap-8 items-stretch">
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <SectionLabel>How Navigator can help</SectionLabel>
                <SectionTitle className={cn(SLIDE_HEADING_CLASS, 'mb-0')}>
                  Keep everything in one place, without rushing the picture.
                </SectionTitle>
              </div>

              <div className="space-y-2">
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  Navigator is built to hold everything in one place, help you notice what matters, and guide the next
                  gentle step.
                </p>
                <p className="text-[0.98rem] leading-relaxed text-[var(--color-thread-gray)]">
                  From your workspace, you can keep adding the small pieces that help {childName}&apos;s story become clearer.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {[
                {
                  icon: FileText,
                  title: 'Add reports and documents',
                  description: 'Upload school reports, clinician letters, assessments and more.',
                },
                {
                  icon: Camera,
                  title: 'Save photos and documents',
                  description: `Anything that helps tell ${childName}'s story belongs here.`,
                },
                {
                  icon: PenLine,
                  title: 'Record everyday observations',
                  description: 'Quick notes about wins, challenges, moods and routines.',
                },
                {
                  icon: Folder,
                  title: 'Keep everything together',
                  description: 'Securely organised and always easy to find.',
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut', delay: 0.08 + index * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[1rem] font-medium leading-snug text-[var(--color-thread-heading)] mb-1.5">
                      {title}
                    </h3>
                    <p className="text-[0.92rem] leading-relaxed text-[var(--color-thread-gray)]">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Card className="bg-[var(--color-thread-off-white)] h-full">
            <CardContent className="p-5 sm:p-6 h-full flex items-center justify-center">
              <FloatingDiaryEntries childName={childName} />
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  const isLastSlide = slideIndex === slides.length - 1;
  const previousLabel = slideIndex === 0 ? 'Back' : 'Previous slide';
  const nextLabel = isLastSlide ? `See ${childName} profile` : 'Next slide';

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 px-8 pb-6 pt-8 sm:px-10 sm:pb-8 sm:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[slideIndex].id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="min-h-[27rem]"
          >
            {slides[slideIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <SlideFooter
        slides={slides}
        slideIndex={slideIndex}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        onPrevious={() => {
          if (slideIndex === 0) {
            onBackToSetup();
            return;
          }
          setSlideIndex((current) => current - 1);
        }}
        onNext={() => {
          if (isLastSlide) {
            onGoToProfile();
            return;
          }
          setSlideIndex((current) => current + 1);
        }}
        onSelectSlide={setSlideIndex}
      />
    </div>
  );
}
