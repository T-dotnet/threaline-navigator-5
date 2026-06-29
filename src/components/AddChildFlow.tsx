import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, User, Clock, FileText, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useCurrentChild } from '../context/ChildContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { HeroQuoteCard } from './ui/HeroQuoteCard';
import { TimelineStep } from './ui/TimelineStep';
import { Question, QUESTIONS, QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from '../questionnaire';
import { getJourneyReflectionCopy, getJourneySetupCopy } from '../lib/journeyCopy';
import watercolorBg from '../assets/images/optimized/watercolor-bg-900.jpg';
import clinicianPhoto from '../assets/images/optimized/dr-naomi-clark-720.jpg';

interface AddChildFlowProps {
  onComplete: () => void;
  onCancel: () => void;
  asModal?: boolean;
  initialStep?: StepType;
}

type StepType = 'welcome' | 1 | 2 | 3 | 4 | 5 | 'done';

export default function AddChildFlow({ onComplete, onCancel, asModal, initialStep }: AddChildFlowProps) {
  const isDirectSessionEntry = initialStep === 5 || (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('step') === '5' && params.get('directSession') === '1';
    } catch {
      return false;
    }
  })();
  const [step, setStep] = useState<StepType>(() => {
    if (initialStep) return initialStep;
    try {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get('step');
      if (stepParam) {
        const num = parseInt(stepParam, 10);
        if (num >= 1 && num <= 5) return num as StepType;
        if (stepParam === 'welcome' || stepParam === 'done') return stepParam as StepType;
      }
      if (params.get('section')) return 4;
    } catch (e) {
      console.error(e);
    }
    return 'welcome';
  });
  const [qSection, setQSection] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get('section');
      if (sectionParam && QUESTIONNAIRE_SECTIONS.includes(sectionParam)) {
        return sectionParam;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bedtimeStruggle, setBedtimeStruggle] = useState<string>('Sometimes');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  const { currentChild, addChild, updateChild } = useCurrentChild();
  const [answers, setAnswers] = useState<Record<string, any>>(() => (
    currentChild.isNew ? currentChild.intake?.questionnaireAnswers || {} : {}
  ));

  const daysArray = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const monthsArray = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: 18 }, (_, i) => String(currentYear - i));

  const [isAppointmentCancelled, setIsAppointmentCancelled] = useState(
    Boolean(currentChild.intake?.sessionCancelled && !currentChild.intake?.sessionDay && !currentChild.intake?.sessionTime)
  );
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isReadyToBook, setIsReadyToBook] = useState<boolean | null>(isDirectSessionEntry ? true : null);

  useEffect(() => {
    if (step === 5) {
      setIsReadyToBook(isDirectSessionEntry ? true : null);
    }
  }, [isDirectSessionEntry, step]);

  const getDobParts = () => {
    return { year: formData.dob || '' };
  };

  const handleDobChange = (value: string) => {
    if (value) {
      setFormData({ ...formData, dob: value });
    } else {
      setFormData({ ...formData, dob: '' });
    }
  };

  const handleSelectOption = useCallback((qId: string, option: string, type: 'choice' | 'multiple-choice' | 'text') => {
    if (type === 'choice') {
      setAnswers(prev => ({ ...prev, [qId]: option }));
      // Auto-advance with a slight delay for pleasant visual feedback
      setTimeout(() => {
        setActiveQuestionIndex(prev => {
          const currentQuestions = QUESTIONS[qSection || ''] || [];
          if (prev < currentQuestions.length - 1) {
            return prev + 1;
          } else {
            setIsReviewing(true);
            return prev;
          }
        });
      }, 350);
    } else if (type === 'multiple-choice') {
      setAnswers(prev => {
        const current = prev[qId] || [];
        if (option === 'Nothing yet') {
          return { ...prev, [qId]: current.includes(option) ? [] : ['Nothing yet'] };
        }
        const currentWithoutNone = current.filter((o: string) => o !== 'Nothing yet');
        const updated = current.includes(option)
          ? currentWithoutNone.filter((o: string) => o !== option)
          : [...currentWithoutNone, option];
        return { ...prev, [qId]: updated };
      });
    }
  }, [qSection]);

  const currentQuestionRef = useRef<HTMLDivElement | null>(null);
  const prevListRef = useRef<HTMLDivElement | null>(null);

  const handleTextChange = useCallback((qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

  useEffect(() => {
    if (!qSection || isReviewing) return;
    currentQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (prevListRef.current) {
      prevListRef.current.scrollTo({ top: prevListRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeQuestionIndex, qSection, isReviewing]);

  const getConversationLead = (sectionName: string, questionIndex: number) => {
    if (questionIndex === 0) {
      if (sectionName === "What's going well") return 'Let’s start with what already helps.';
      if (sectionName === "What you're seeing") return 'Now let’s look at what feels harder right now.';
      if (sectionName === 'At school') return 'Next, a little about learning and school life.';
      if (sectionName === 'Development & history') return 'Finally, a few background details that may help later.';
    }
    if (questionIndex === 1) return 'That helps. Here’s the next piece.';
    if (questionIndex === 2) return 'A little more context, then we’re nearly there.';
    return 'One last thing for this part.';
  };

  const getAnswerCue = (type: Question['type']) => {
    if (type === 'multiple-choice') return 'Choose any that fit. If none feel right, you can just move on.';
    if (type === 'choice') return 'Choose the closest fit. It does not need to be perfect.';
    return 'Use your own words. A few words is enough.';
  };

  const handlePrevQuestion = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
      const currentQuestions = QUESTIONS[qSection || ''] || [];
      setActiveQuestionIndex(currentQuestions.length - 1);
    } else if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    }
  }, [isReviewing, activeQuestionIndex, qSection]);

  const handleNextQuestion = useCallback(() => {
    const currentQuestions = QUESTIONS[qSection || ''] || [];
    if (activeQuestionIndex < currentQuestions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else {
      setIsReviewing(true);
    }
  }, [activeQuestionIndex, qSection]);

  const getSectionStatus = useCallback((secName: string) => {
    const qs = QUESTIONS[secName] || [];
    if (qs.length === 0) return 'Not started';
    
    const answeredCount = qs.filter(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) return false;
      if (Array.isArray(ans)) return ans.length > 0;
      if (typeof ans === 'string') return ans.trim() !== '';
      return true;
    }).length;

    if (answeredCount === 0) return 'Not started';
    if (answeredCount === qs.length) return 'Completed';
    return `${answeredCount} of ${qs.length} answered`;
  }, [answers]);

  // Handle Typeform keyboard shortcuts
  useEffect(() => {
    if (!qSection) return;
    
    const currentQuestions = QUESTIONS[qSection] || [];
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in a textarea or input, do not capture single keys like A/B/C
      const isTyping = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevQuestion();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'Enter') {
        if (isTyping && document.activeElement instanceof HTMLTextAreaElement) {
          // Allow multiline textareas, unless Cmd/Ctrl+Enter is pressed
          if (!e.metaKey && !e.ctrlKey) return;
        }
        e.preventDefault();
        handleNextQuestion();
      } else if (!isTyping) {
        const key = e.key.toLowerCase();
        const code = key.charCodeAt(0) - 97; // 'a' code is 97
        const activeQ = currentQuestions[activeQuestionIndex];
        if (activeQ && activeQ.options && code >= 0 && code < activeQ.options.length) {
          e.preventDefault();
          handleSelectOption(activeQ.id, activeQ.options[code], activeQ.type);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [qSection, activeQuestionIndex, handlePrevQuestion, handleNextQuestion, handleSelectOption]);

  const [formData, setFormData] = useState(() => ({
    firstName: currentChild.isNew ? currentChild.name : '',
    dob: '',
    relation: currentChild.isNew ? currentChild.intake?.relation || 'Parent' : 'Parent',
    journeyStage: currentChild.isNew ? currentChild.intake?.journeyStage || '' : '',
    availableInfo: currentChild.isNew ? currentChild.intake?.availableInfo || [] as string[] : [] as string[],
    notices: currentChild.isNew ? currentChild.intake?.notices || [] as string[] : [] as string[],
    notes: currentChild.isNew ? currentChild.intake?.notes || '' : '',
    sessionDay: currentChild.isNew ? currentChild.intake?.sessionDay || '' : '',
    sessionTime: currentChild.isNew ? currentChild.intake?.sessionTime || '' : '',
  }));

  const buildIntake = (nextAnswers = answers) => {
    const questionnaireAvailableInfo = Array.isArray(nextAnswers.dev_available_information)
      ? nextAnswers.dev_available_information
      : formData.availableInfo;

    return {
      relation: formData.relation,
      journeyStage: formData.journeyStage,
      availableInfo: questionnaireAvailableInfo,
      notices: formData.notices,
      notes: formData.notes,
      sessionDay: formData.sessionDay,
      sessionTime: formData.sessionTime,
      sessionCancelled: formData.sessionDay && formData.sessionTime ? false : Boolean(currentChild.intake?.sessionCancelled),
      questionnaireAnswers: nextAnswers,
      completedQuestionnaireSections: getCompletedQuestionnaireSections(nextAnswers),
    };
  };

  const saveCurrentChildIntake = (nextAnswers = answers) => {
    if (!currentChild.isNew) return;
    const name = formData.firstName.trim() || currentChild.name || 'New child';
    updateChild({
      ...currentChild,
      name,
      initial: name.charAt(0).toUpperCase(),
      intake: buildIntake(nextAnswers),
    });
  };

  const handleDirectSessionConfirm = () => {
    setIsCancelConfirmOpen(false);
    saveCurrentChildIntake();
    onComplete();
  };

  const handleCancelAppointment = () => {
    setIsCancelConfirmOpen(false);
    if (!currentChild.isNew) {
      setFormData((prev) => ({ ...prev, sessionDay: '', sessionTime: '' }));
      setIsAppointmentCancelled(true);
      return;
    }
    const clearedIntake = {
      ...buildIntake(),
      sessionDay: '',
      sessionTime: '',
      sessionCancelled: true,
    };
    const name = formData.firstName.trim() || currentChild.name || 'New child';
    updateChild({
      ...currentChild,
      name,
      initial: name.charAt(0).toUpperCase(),
      intake: clearedIntake,
    });
    setFormData((prev) => ({ ...prev, sessionDay: '', sessionTime: '' }));
    setIsAppointmentCancelled(true);
  };

  const handleNext = () => {
    if (step === 'welcome') setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) {
      saveCurrentChildIntake();
      setStep(5);
    }
    else if (step === 5) {
      const name = formData.firstName.trim() || (currentChild.isNew ? currentChild.name : 'New child');
      const child = {
        ...(currentChild.isNew ? currentChild : {}),
        id: currentChild.isNew ? currentChild.id : undefined,
        name,
        age: currentChild.isNew ? currentChild.age : 9,
        initial: name.charAt(0).toUpperCase(),
        isNew: true,
        intake: buildIntake(),
      };
      if (currentChild.isNew) {
        updateChild(child);
      } else {
        addChild(child);
      }
      setStep('done');
    }
    else if (step === 'done') {
      onComplete();
    }
  };

  const handleBack = () => {
    if (hideStepperForDirectModalStep) {
      onCancel();
      return;
    }
    if (step === 'done') setStep(5);
    else if (step === 1) setStep('welcome');
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  const steps = [
    { num: 1, title: 'Journey', desc: 'Where you are now' },
    { num: 2, title: 'Your child', desc: 'Name & date of birth' },
    { num: 3, title: 'Hardest right now', desc: 'Top areas' },
    { num: 4, title: 'Questionnaire', desc: 'Everyday life' },
    { num: 5, title: 'Your session', desc: 'Book a video call' },
  ];

  const relations = ['Parent', 'Guardian', 'Carer'];
  const journeyStageOptions = [
    'Noticing concerns',
    'Waiting for assessment',
    'Diagnosed, need next steps',
  ];
  const noticeOptions = [
    'Attention & focus', 'Behaviour & emotions', 'Sleep', 'Learning', 
    'Movement & coordination', 'Speech & communication', 'Friendships'
  ];
  const days = [
    { dow: 'Tue', num: '24', mon: 'Jun' },
    { dow: 'Wed', num: '25', mon: 'Jun' },
    { dow: 'Thu', num: '26', mon: 'Jun' },
    { dow: 'Fri', num: '27', mon: 'Jun' },
    { dow: 'Mon', num: '30', mon: 'Jun' },
  ];
  const times = ['9:00 am', '10:30 am', '1:00 pm', '4:00 pm'];
  const completedQuestionnaireSections = getCompletedQuestionnaireSections(answers);
  const remainingQuestionnaireSections = Math.max(0, Object.keys(QUESTIONS).length - completedQuestionnaireSections.length);
  const isDirectObservationModal = asModal && initialStep === 3;
  const isDirectSessionModal = step === 5 && isDirectSessionEntry;
  const hideStepperForDirectModalStep = isDirectObservationModal || isDirectSessionModal;
  const hasCurrentAppointment = Boolean(currentChild.intake?.sessionDay && currentChild.intake?.sessionTime);
  const currentAppointmentDay = currentChild.intake?.sessionDay || '26';
  const currentAppointmentTime = currentChild.intake?.sessionTime || '4:00 pm';
  const currentAppointmentDate = `Thu ${currentAppointmentDay} Jun`;
  const handleDirectObservationConfirm = () => {
    saveCurrentChildIntake();
    onCancel();
  };
  const questionnaireAvailableInfo = Array.isArray(answers.dev_available_information) ? answers.dev_available_information : [];
  const reflectedAvailableInfo = questionnaireAvailableInfo.length > 0 ? questionnaireAvailableInfo : formData.availableInfo;
  const selectedInfoSummary = reflectedAvailableInfo.length > 0 ? reflectedAvailableInfo.join(', ') : 'Nothing selected yet';
  const journeyReflectionCopy = getJourneyReflectionCopy(formData.journeyStage);
  const journeySetupCopy = getJourneySetupCopy(formData.journeyStage);
  const formatMirrorList = (items: string[]) => {
    if (items.length === 0) return 'not sure yet';
    const normalized = items.map((item) => item.toLowerCase());
    if (normalized.length === 1) return normalized[0];
    if (normalized.length === 2) return `${normalized[0]} and ${normalized[1]}`;
    return `${normalized.slice(0, -1).join(', ')}, and ${normalized[normalized.length - 1]}`;
  };
  const mirroredJourneyStage = journeyReflectionCopy.stage;
  const mirroredHardestAreas = formData.notices.length > 0 ? formatMirrorList(formData.notices) : 'not clear yet';
  const mirroredAvailableInfo = reflectedAvailableInfo.length > 0 ? selectedInfoSummary.toLowerCase() : 'nothing yet';
  const sectionKickerClass = "text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-3 block";
  const stepHeadingClass = "font-serif font-normal text-[2rem] sm:text-[2.35rem] leading-[1.12] tracking-tight text-[var(--color-thread-heading)] mb-3 max-w-[14ch]";
  const stepLeadClass = "text-[0.98rem] text-[var(--color-thread-gray)] leading-relaxed max-w-[55ch]";
  const selectClass = "w-full py-3 px-4 pr-9 bg-[var(--color-thread-off-white)]/50 border border-black/10 rounded-xl text-[0.95rem] font-medium text-[var(--color-thread-dark-slate)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)]/30 transition-all appearance-none cursor-pointer";
  const smallFieldLabelClass = "text-[0.66rem] tracking-[0.12em] uppercase text-[var(--color-thread-gray)] font-medium mb-1.5 block";
  const choiceClass = (selected: boolean) => cn(
    "px-5 py-2.5 rounded-full text-[0.84rem] font-medium transition-all border shadow-none cursor-pointer inline-flex items-center gap-2 min-h-[40px]",
    selected
      ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)]"
      : "bg-white border-black/10 text-[var(--color-thread-gray)] hover:border-black/20 hover:text-[var(--color-thread-heading)]"
  );
  const questionOptionClass = (selected: boolean) => cn(
    "w-full p-4 rounded-tr-[20px] border text-left flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-none",
    selected
      ? "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)]/30 text-[var(--color-thread-heading)] font-medium"
      : "bg-white border-black/10 text-[var(--color-thread-dark-slate)] hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60"
  );
  const renderSetupStepper = (activeStep: number, heading: string) => (
    <>
      <div className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-8">
        {heading}
      </div>
      <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/5">
        {steps.map((s) => {
          const isPast = activeStep > s.num;
          const isCurrent = activeStep === s.num;
          return (
            <div key={s.num} className="flex gap-4 relative z-10">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-medium border-2 transition-colors bg-[var(--color-thread-off-white)]",
                isPast ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white" :
                isCurrent ? "border-[var(--color-thread-mid-green)] text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)] shadow-[0_0_0_4px_var(--color-thread-light-green)]" :
                "border-slate-200 text-slate-400 bg-white"
              )}>
                {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <div>
                <div className={cn(
                  "text-[0.92rem] font-medium mb-0.5 transition-colors",
                  isCurrent || isPast ? "text-[var(--color-thread-heading)]" : "text-slate-400"
                )}>{s.title}</div>
                <div className={cn(
                  "text-[0.78rem] transition-colors",
                  isCurrent ? "text-slate-500" : "text-slate-400"
                )}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {asModal && (
        <div className="fixed inset-0 z-40 bg-watercolor bg-fixed" onClick={onCancel} />
      )}
      <div className={cn(
        "font-sans flex flex-col",
        asModal
          ? "fixed inset-0 z-50 overflow-hidden bg-watercolor bg-fixed"
          : "min-h-screen bg-watercolor bg-fixed relative"
      )}>
      {/* Main Container */}
      <div className={cn(
        "flex-1 w-full bg-transparent px-4 sm:px-6 md:px-8 flex items-start justify-center",
        asModal ? "overflow-y-auto py-8" : "py-8 sm:py-12 md:py-16"
      )}>
        <div className="max-w-5xl w-full bg-white rounded-tr-[36px] shadow-premium border border-black/5 flex flex-col md:flex-row overflow-hidden min-h-[640px] relative">
          <div
            className="absolute left-0 top-0 h-1 bg-[var(--color-thread-mid-green)] transition-all duration-500 z-10"
            style={{ width: step === 'welcome' ? '0%' : step === 'done' ? '100%' : `${(step as number) / 5 * 100}%` }}
          />
          
          {/* WELCOME STATE */}
          {step === 'welcome' && (
            <>
              {/* Left Column: Welcome messaging */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 md:p-14 flex flex-col justify-between gap-10">
                <div className="space-y-8">
                  <div>
                    <span className={sectionKickerClass}>Welcome to Threadline</span>
                    <h1 className={stepHeadingClass}>Let's set up Threadline for your family.</h1>
                    <p className={stepLeadClass}>A few short steps to get ready for your first session. It takes about ten minutes, and you can pause and pick up anytime — your progress is saved.</p>
                  </div>
                  
                  <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-tr-[24px] flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center flex-shrink-0 text-[var(--color-thread-mid-green)]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--color-thread-heading)] mb-1">A clinician leads everything</h4>
                      <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">Your session is led by a registered clinician, and they review every result before you see it. Threadline does the structured work behind the scenes — a person is always accountable for your care.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Button
                    onClick={onCancel}
                    variant="muted"
                    className="text-[0.95rem] px-8 py-4 shadow-none w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNext}
                    variant="forest"
                    className="text-[0.95rem] px-8 py-4 shadow-none w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Begin setup
                  </Button>
                </div>
              </div>

              {/* Right Column: Setup Stepper */}
              <aside className="order-2 w-full md:w-72 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex-shrink-0 flex flex-col justify-start">
                {renderSetupStepper(1, "What we'll do together")}
              </aside>
            </>
          )}

          {/* ACTIVE STEPS 1-5 */}
          {typeof step === 'number' && (
            <>
              {/* Right Column: Interactive Sidebar Progress */}
              {!hideStepperForDirectModalStep && (
                <aside className="order-2 w-full md:w-72 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex-shrink-0 flex flex-col">
                  {renderSetupStepper(step, `${formData.firstName || 'Your child'}'s setup`)}
                </aside>
              )}

              {/* Step content & in-card action buttons */}
              <main className="order-1 flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-between min-h-[500px]">
                <div className="w-full">
                  
                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className={sectionKickerClass}>Step 1 of 5 · Your journey</span>
                        <h1 className={stepHeadingClass}>Where are you in your journey?</h1>
                        <p className={stepLeadClass}>Choose the option that fits best right now. This helps Navigator set the right tone for your family from the start.</p>
                      </div>

                      <div className="space-y-2.5 max-w-xl">
                        {journeyStageOptions.map((stage, index) => {
                          const isSelected = formData.journeyStage === stage;
                          return (
                            <button
                              key={stage}
                              type="button"
                              onClick={() => setFormData({ ...formData, journeyStage: stage })}
                              className={questionOptionClass(isSelected)}
                            >
                              <div className="flex items-center gap-3">
                                <span className={cn(
                                  "w-6 h-6 rounded-full border text-[0.66rem] font-medium flex items-center justify-center transition-colors",
                                  isSelected
                                    ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                    : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                )}>
                                  {index + 1}
                                </span>
                                <span className="text-[0.95rem] leading-snug">{stage}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[var(--color-thread-mid-green)]" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className={sectionKickerClass}>Step 2 of 5 · Your child</span>
                        <h1 className={stepHeadingClass}>Add your child</h1>
                        <p className={stepLeadClass}>Start with the basics — who we're supporting and how you're related to them.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <Label>Child's first name</Label>
                          <Input 
                            placeholder="e.g. Alex"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="max-w-md py-3 bg-white"
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">Year of birth</Label>
                          <div className="max-w-md">
                            <div className="relative">
                              <select
                                value={getDobParts().year}
                                onChange={(e) => handleDobChange(e.target.value)}
                                className={selectClass}
                              >
                                <option value="">YYYY</option>
                                {yearsArray.map(y => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>I'm the child's…</Label>
                          <div className="flex flex-wrap gap-2">
                            {relations.map(rel => (
                              <button
                                key={rel}
                                onClick={() => setFormData({...formData, relation: rel})}
                                className={cn(
                                  choiceClass(formData.relation === rel)
                                )}
                              >
                                {rel}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className={sectionKickerClass}>Step 3 of 5 · Hardest right now</span>
                        <h1 className={stepHeadingClass}>Which of these feels hardest right now?</h1>
                        <p className={stepLeadClass}>Choose up to three areas. There are no wrong answers — this helps your clinician start with what feels most important for {formData.firstName || 'your child'} today.</p>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <Label className="mb-3">Which of these feels hardest right now? <span className="text-slate-400 font-normal ml-2">select up to three</span></Label>
                          <div className="flex flex-wrap gap-2.5">
                            {noticeOptions.map(opt => {
                              const isSelected = formData.notices.includes(opt);
                              const isAtLimit = formData.notices.length >= 3 && !isSelected;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    if (isAtLimit) return;
                                    const newNotices = isSelected 
                                      ? formData.notices.filter(n => n !== opt)
                                      : [...formData.notices, opt];
                                    setFormData({...formData, notices: newNotices});
                                  }}
                                  className={cn(
                                    choiceClass(isSelected),
                                    isAtLimit && "opacity-45 cursor-not-allowed hover:border-black/10 hover:text-[var(--color-thread-gray)]"
                                  )}
                                >
                                  {opt}
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-thread-mid-green)]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* Step 5 */}
                  {step === 5 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        {!isDirectSessionModal && (
                          <span className={sectionKickerClass}>Step 5 of 5 · Your session</span>
                        )}
                        <h1 className={stepHeadingClass}>{isDirectSessionModal ? "Reschedule your session" : "Book your session"}</h1>
                        <p className={stepLeadClass}>
                          {isDirectSessionModal
                            ? "Choose a new time for the first clinician session. Your intake details stay saved."
                            : "A clinician session helps us use your information in the right way. Are you ready to choose a time now?"}
                        </p>
                      </div>

                      {isDirectSessionModal && isAppointmentCancelled && (
                        <div className="rounded-tr-[24px] bg-[var(--color-thread-light-green)]/60 p-4 text-sm text-[var(--color-thread-heading)]">
                          Appointment cancelled. You can choose a new time below, or close this window.
                        </div>
                      )}

                      {isDirectSessionModal && !isAppointmentCancelled && hasCurrentAppointment && (
                        <div className="border-b border-black/10 pb-6">
                          <span className="text-[0.66rem] uppercase tracking-[0.14em] text-[var(--color-thread-mid-green)] font-medium">
                            Current appointment
                          </span>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                            <div>
                              <div className="font-serif text-[1.6rem] leading-tight tracking-tight text-[var(--color-thread-heading)]">
                                {currentAppointmentDate}
                              </div>
                              <div className="mt-1 text-sm text-slate-500">
                                {currentAppointmentTime} · Telehealth with Dr. Naomi Clark
                              </div>
                            </div>
                            <span className="text-[0.78rem] text-slate-400">
                              Choose a new slot below to replace this time.
                            </span>
                          </div>
                        </div>
                      )}

                      {isReadyToBook === null ? (
                        <div className="space-y-6 bg-[var(--color-thread-off-white)]/70 p-8 rounded-[24px]">
                          <div className="space-y-4">
                            <p className="text-[1rem] text-[var(--color-thread-dark-slate)]">If you’d like, we can book your session now. Otherwise, we’ll save your progress and send an email reminder so you can book it later.</p>
                            <p className="text-sm text-slate-500">You can still finish the setup now and return to booking anytime.</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="mint"
                              onClick={() => setIsReadyToBook(true)}
                              className="px-6 py-3"
                            >
                              Yes, book now
                            </Button>
                            <Button
                              variant="muted"
                              onClick={() => setIsReadyToBook(false)}
                              className="px-6 py-3"
                            >
                              Not ready yet
                            </Button>
                          </div>
                        </div>
                      ) : isReadyToBook === true ? (
                        <>
                          {!isDirectSessionModal && (
                            <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-tr-[24px] shadow-none flex items-start gap-4">
                              <img
                                src={clinicianPhoto}
                                alt="Dr. Naomi Clark"
                                className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-black/5 shadow-sm"
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="font-medium text-[var(--color-thread-heading)]">Dr. Naomi Clark</h4>
                                <p className="text-xs text-slate-400 mb-2">Consultant Child Psychologist · PhD, MAPS</p>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-md">Dr Clark specializes in developmental profiles and child-centered environments. She leads the review of {formData.firstName || 'your child'}'s profile and works with your family.</p>
                              </div>
                            </div>
                          )}

                          <div className="space-y-6">
                            <div>
                              <Label className="mb-3">Choose a day</Label>
                              <div className="flex flex-wrap gap-2.5">
                                {days.map(d => (
                                  <button
                                    key={d.num}
                                  onClick={() => {
                                    setIsAppointmentCancelled(false);
                                    setIsCancelConfirmOpen(false);
                                    setFormData({...formData, sessionDay: d.num, sessionTime: ''});
                                  }}
                                    className={cn(
                                      "w-[4.5rem] py-3 rounded-tr-[20px] flex flex-col items-center justify-center border transition-all shadow-none cursor-pointer",
                                      formData.sessionDay === d.num
                                        ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)] font-semibold scale-[1.02]"
                                        : "bg-white border-black/10 text-slate-600 hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60"
                                    )}
                                  >
                                    <span className={cn("text-[0.66rem] uppercase tracking-wider mb-1 transition-colors", formData.sessionDay === d.num ? "text-[var(--color-thread-mid-green)] font-semibold" : "text-slate-400")}>{d.dow}</span>
                                    <span className={cn("text-xl font-serif transition-colors", formData.sessionDay === d.num ? "text-[var(--color-thread-heading)] font-semibold" : "text-slate-800")}>{d.num}</span>
                                    <span className={cn("text-[0.66rem] transition-colors", formData.sessionDay === d.num ? "text-[var(--color-thread-mid-green)] font-semibold" : "text-slate-400")}>{d.mon}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {formData.sessionDay && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                                <div>
                                  <Label className="mb-3">Choose a time</Label>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                  {times.map(t => (
                                      <button
                                        key={t}
                                        onClick={() => setFormData({...formData, sessionTime: t})}
                                        className={cn(
                                          "px-5 py-2.5 rounded-tr-[20px] text-sm font-medium transition-all border shadow-none cursor-pointer flex flex-col items-center justify-center gap-0.5 min-w-[5.5rem]",
                                          formData.sessionTime === t
                                            ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)] font-semibold"
                                            : "bg-white border-black/10 text-slate-600 hover:border-black/20 hover:bg-[var(--color-thread-off-white)]/60"
                                        )}
                                      >
                                        <span className="font-semibold text-[0.92rem]">{t}</span>
                                      </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>

                          <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-br-[24px] text-slate-600 text-sm flex gap-3.5">
                            <Clock className="w-5 h-5 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-0.5" />
                            <div>A <span className="font-semibold">45-minute telehealth session</span> — a structured interview, some gentle observation, and a few short tasks for {formData.firstName || 'your child'}. Join from home.</div>
                          </div>

                          {isDirectSessionModal && isCancelConfirmOpen && !isAppointmentCancelled && (
                            <div className="rounded-tr-[24px] border border-rose-200 bg-rose-50 p-5">
                              <h4 className="font-medium text-rose-800">Cancel this appointment?</h4>
                              <p className="mt-2 text-sm leading-relaxed text-rose-700/80">
                                This will cancel {currentAppointmentDate} at {currentAppointmentTime}. You can book a new time later.
                              </p>
                              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Button
                                  variant="muted"
                                  onClick={() => setIsCancelConfirmOpen(false)}
                                  className="px-5 py-2.5"
                                >
                                  Keep appointment
                                </Button>
                                <button
                                  type="button"
                                  onClick={handleCancelAppointment}
                                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
                                >
                                  Yes, cancel appointment
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                              variant="mint"
                              onClick={() => {
                                saveCurrentChildIntake();
                                if (isDirectSessionModal) {
                                  handleDirectSessionConfirm();
                                  return;
                                }
                                handleNext();
                              }}
                              className="px-6 py-3"
                            >
                              {isDirectSessionModal ? "Confirm appointment" : "Continue to confirm"}
                            </Button>
                            {isDirectSessionModal ? (
                              <>
                                <Button
                                  variant="muted"
                                  onClick={handleBack}
                                  className="px-6 py-3"
                                >
                                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                {hasCurrentAppointment && !isAppointmentCancelled && (
                                  <button
                                    type="button"
                                    onClick={() => setIsCancelConfirmOpen(true)}
                                    className="sm:ml-auto inline-flex min-h-[44px] items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-800"
                                  >
                                    Cancel appointment
                                  </button>
                                )}
                              </>
                            ) : (
                              <Button
                                variant="muted"
                                onClick={() => setIsReadyToBook(false)}
                                className="px-6 py-3"
                              >
                                I’ll book later
                              </Button>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6 bg-[var(--color-thread-off-white)]/70 p-8 rounded-[24px]">
                          <div className="space-y-4">
                            <p className="text-[1rem] text-[var(--color-thread-dark-slate)]">No problem — we’ll save your progress and send an email reminder so you can book the session later when it suits you.</p>
                            <p className="text-sm text-slate-500">Your intake is saved and the clinician can still review what you have shared.</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      {true && (
                        <div>
                          <span className={sectionKickerClass}>Step 4 of 5 · Questionnaire</span>
                          <h1 className={stepHeadingClass}>{journeySetupCopy.title}</h1>
                          <p className={stepLeadClass}>{journeySetupCopy.description}</p>
                        </div>
                      )}

                      {(
                        <div className="space-y-3">
                          {(() => {
                            const completedSectionsCount = QUESTIONNAIRE_SECTIONS.filter(
                              sec => getSectionStatus(sec) === 'Completed'
                            ).length;
                            const totalQuestionsCount = Object.values(QUESTIONS).flat().length;
                            const answeredQuestionsCount = Object.values(QUESTIONS).flat().filter(q => {
                              const ans = answers[q.id];
                              if (ans === undefined || ans === null) return false;
                              if (Array.isArray(ans)) return ans.length > 0;
                              if (typeof ans === 'string') return ans.trim() !== '';
                              return true;
                            }).length;
                            const progressPercent = Math.round((answeredQuestionsCount / totalQuestionsCount) * 100);

                            return (
                              <div className="bg-[var(--color-thread-off-white)]/70 p-5 rounded-tr-[24px] shadow-none flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative flex-shrink-0">
                                  <svg
                                    className="w-full h-full -rotate-90 absolute inset-0"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                  >
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="18"
                                      stroke="var(--color-thread-mid-green)"
                                      strokeOpacity="0.15"
                                      strokeWidth="4"
                                      fill="transparent"
                                    />
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="18"
                                      stroke="var(--color-thread-mid-green)"
                                      strokeWidth="4"
                                      fill="transparent"
                                      strokeLinecap="round"
                                      strokeDasharray={2 * Math.PI * 18}
                                      strokeDashoffset={2 * Math.PI * 18 * (1 - progressPercent / 100)}
                                      className="transition-all duration-500"
                                    />
                                  </svg>
                                  <span className="text-[0.72rem] font-medium text-[var(--color-thread-heading)] z-10">{progressPercent}%</span>
                                </div>
                                <div>
                                  <div className="font-medium text-[var(--color-thread-heading)] text-[0.92rem] mb-0.5">{completedSectionsCount} of 4 sections completed</div>
                                  <div className="text-[0.78rem] text-[var(--color-thread-gray)]">{answeredQuestionsCount} of {totalQuestionsCount} questions answered. Progress is saved.</div>
                                </div>
                              </div>
                            );
                          })()}

                          {QUESTIONNAIRE_SECTIONS.map((sec, i) => {
                            const status = getSectionStatus(sec);
                            const isDone = status === 'Completed';
                            const qCount = (QUESTIONS[sec] || []).length;
                            const isLocked = false;
                            const isInProgress = !isDone && status !== 'Not started';
                            return (
                              <button
                                key={sec}
                                onClick={() => {
                                  if (isLocked) return;
                                  setQSection(sec);
                                  setActiveQuestionIndex(0);
                                  setIsReviewing(false);
                                  setIsModalOpen(true);
                                }}
                                disabled={isLocked}
                                className={cn(
                                  "w-full bg-white p-6 rounded-tr-[24px] flex items-center gap-5 text-left transition-all group",
                                  isLocked
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[var(--color-thread-off-white)]/40 cursor-pointer"
                                )}
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shrink-0",
                                  isDone
                                    ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                    : isLocked
                                    ? "border-slate-200 text-slate-300 bg-slate-50"
                                    : "border-slate-200 text-slate-400 bg-[var(--color-thread-off-white)] group-hover:bg-white group-hover:border-[var(--color-thread-mid-green)] group-hover:text-[var(--color-thread-mid-green)]"
                                )}>
                                  {isDone ? <Check className="w-4 h-4" /> : isLocked ? <span className="text-slate-300">🔒</span> : i + 1}
                                </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={cn("font-sans font-medium text-[1.12rem] tracking-tight leading-[1.3]", isLocked ? "text-slate-400" : "text-[var(--color-thread-dark-slate)]")}>{sec}</div>
                                    <div className="text-[0.78rem] text-[var(--color-thread-gray)] mt-1.5 leading-relaxed">
                                      {isLocked
                                        ? `Complete "${QUESTIONNAIRE_SECTIONS[i - 1]}" to unlock`
                                        : `${qCount} questions`}
                                    </div>
                                  </div>
                                {!isLocked && (
                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className={cn(
                                      "text-[0.6rem] font-medium inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-[0.12em] whitespace-nowrap",
                                      isDone ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]" : status === 'Not started' ? "bg-[var(--color-thread-off-white)] text-slate-400" : "bg-[var(--color-thread-cream)] text-[var(--color-thread-heading)]"
                                    )}>
                                      {isDone && <Check className="w-3 h-3" />}
                                      {isDone ? 'Completed' : isInProgress ? status : 'Start section'}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* QUESTIONNAIRE MODAL */}
                  <AnimatePresence>
                  {isModalOpen && qSection && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
                      style={{ backgroundImage: `url(${watercolorBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 w-full max-w-2xl bg-white rounded-tr-[36px] shadow-modal border border-black/5 flex flex-col max-h-[90vh] overflow-hidden"
                      >
                        <div className="flex flex-col h-full justify-between min-h-[480px]">
                          {/* Header / Nav-back */}
                          <div className="flex items-center justify-between p-6 pb-5 border-b border-black/5">
                            {!isReviewing ? (
                              <button
                                onClick={() => {
                                  saveCurrentChildIntake();
                                  setQSection(null);
                                  setIsModalOpen(false);
                                }}
                                className="text-[0.84rem] text-[var(--color-thread-dark-slate)] font-medium border-b border-[var(--color-thread-dark-slate)] pb-0.5 hover:opacity-70 transition-all min-h-[32px] inline-flex items-center cursor-pointer"
                              >
                                Save & exit section
                              </button>
                            ) : (
                              <div className="min-h-[32px] w-[140px]" />
                            )}
                            <span className="text-[0.75rem] font-medium text-slate-400 uppercase tracking-[0.1em]">
                              One question at a time
                            </span>
                          </div>

                          {/* Main Body */}
                          <div className="flex-1 py-8 px-6 sm:px-10 flex flex-col justify-start overflow-y-auto space-y-6">
                            <div ref={prevListRef} className="space-y-4 overflow-y-auto">
                              {(() => {
                                const currentQuestions = QUESTIONS[qSection || ''] || [];
                                return currentQuestions.slice(0, activeQuestionIndex).map((q, idx) => {
                                  const ansVal = answers[q.id];
                                  const displayAns = Array.isArray(ansVal)
                                    ? ansVal.join(', ')
                                    : ansVal || <span className="text-rose-500 italic font-normal">Not answered</span>;
                                  return (
                                    <div key={q.id} className="rounded-[28px] border border-black/5 bg-slate-50 p-5">
                                      <div className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-400 mb-2">Question {idx + 1}</div>
                                      <div className="font-medium text-[1rem] text-[var(--color-thread-heading)] leading-snug mb-3">
                                        {q.text.replace(/\$\{childName\}/g, formData.firstName || 'your child')}
                                      </div>
                                      <div className="rounded-3xl bg-white border border-black/10 p-4 text-[0.95rem] text-slate-700">
                                        {displayAns}
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                            <AnimatePresence mode="wait">
                              {!isReviewing ? (
                                <motion.div
                                  ref={currentQuestionRef}
                                  key={`question-${activeQuestionIndex}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-8"
                                >
                                  {/* Active Question */}
                                  {(() => {
                                    const currentQuestions = QUESTIONS[qSection || ''] || [];
                                    const q = currentQuestions[activeQuestionIndex];
                                    if (!q) return null;
                                    const qText = q.text.replace(/\$\{childName\}/g, formData.firstName || 'your child');
                                    const qSub = q.subtext?.replace(/\$\{childName\}/g, formData.firstName || 'your child');
                                    
                                    return (
                                      <div className="space-y-6">
                                        <div className="space-y-3">
                                          <div className="inline-flex rounded-tr-[18px] rounded-bl-[18px] bg-[var(--color-thread-light-green)]/70 px-4 py-2 text-[0.86rem] font-medium text-[var(--color-thread-heading)]">
                                            {getConversationLead(qSection || '', activeQuestionIndex)}
                                          </div>
                                          <div className="flex items-start gap-3">
                                            <span className="mt-2 h-7 min-w-7 rounded-full bg-[var(--color-thread-off-white)] text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-thread-mid-green)] flex items-center justify-center">{activeQuestionIndex + 1}</span>
                                            <div>
                                              <h2 className="font-serif font-normal text-2xl md:text-3xl text-[var(--color-thread-heading)] leading-snug">
                                                {qText}
                                              </h2>
                                              <p className="text-[0.84rem] text-[var(--color-thread-gray)] leading-relaxed mt-2">
                                                {getAnswerCue(q.type)}
                                              </p>
                                            </div>
                                          </div>
                                          {qSub && (
                                            <p className="text-[var(--color-thread-gray)] text-[0.92rem] leading-relaxed ml-10">{qSub}</p>
                                          )}
                                        </div>

                                        <div className="ml-0 sm:ml-10">
                                          {/* CHOICE TYPE */}
                                          {q.type === 'choice' && q.options && (
                                            <div className="space-y-2.5 max-w-lg">
                                              {q.options.map((opt, oIdx) => {
                                                const isSelected = answers[q.id] === opt;
                                                const letter = String.fromCharCode(65 + oIdx); // A, B, C, D...
                                                return (
                                                  <button
                                                    key={opt}
                                                    onClick={() => handleSelectOption(q.id, opt, 'choice')}
                                                    className={cn(
                                                      questionOptionClass(isSelected)
                                                    )}
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <span className={cn(
                                                        "w-6 h-6 rounded-full border text-[0.66rem] font-medium flex items-center justify-center transition-colors",
                                                        isSelected
                                                          ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                                          : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                                      )}>
                                                        {letter}
                                                      </span>
                                                      <span className="text-[0.95rem]">{opt}</span>
                                                    </div>
                                                    {isSelected && <Check className="w-4 h-4 text-[var(--color-thread-mid-green)]" />}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          )}

                                          {/* MULTIPLE CHOICE TYPE */}
                                          {q.type === 'multiple-choice' && q.options && (
                                            <div className="space-y-2.5 max-w-lg">
                                              {q.options.map((opt, oIdx) => {
                                                const selectedList = answers[q.id] || [];
                                                const isSelected = selectedList.includes(opt);
                                                const letter = String.fromCharCode(65 + oIdx); // A, B, C, D...
                                                return (
                                                  <button
                                                    key={opt}
                                                    onClick={() => handleSelectOption(q.id, opt, 'multiple-choice')}
                                                    className={cn(
                                                      questionOptionClass(isSelected)
                                                    )}
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <span className={cn(
                                                        "w-6 h-6 rounded-full border text-[0.66rem] font-medium flex items-center justify-center transition-colors",
                                                        isSelected
                                                          ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                                          : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                                      )}>
                                                        {letter}
                                                      </span>
                                                      <span className="text-[0.95rem]">{opt}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                                                      isSelected
                                                        ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                                        : "border-black/10 group-hover:border-black/20 bg-white"
                                                    )}>
                                                      {isSelected && <Check className="w-3.5 h-3.5" />}
                                                    </div>
                                                  </button>
                                                );
                                              })}

                                              {/* Continue button */}
                                              <div className="pt-4 flex items-center gap-3">
                                                <Button
                                                  onClick={handleNextQuestion}
                                                  variant="mint"
                                                  className="px-5 py-2.5 min-h-[40px] shadow-none"
                                                  rightIcon={<Check className="w-4 h-4" />}
                                                >
                                                  That feels right
                                                </Button>
                                                <span className="text-[0.74rem] text-slate-400">then we’ll move on</span>
                                              </div>
                                            </div>
                                          )}

                                          {/* TEXT TYPE */}
                                          {q.type === 'text' && (
                                            <div className="max-w-xl space-y-4">
                                              <textarea
                                                value={answers[q.id] || ''}
                                                onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                placeholder={q.placeholder || "Type your answer here..."}
                                                rows={3}
                                                className="w-full bg-[var(--color-thread-off-white)]/50 border border-black/10 rounded-tr-[24px] p-4 text-[var(--color-thread-dark-slate)] placeholder:text-[var(--color-thread-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)]/30 transition-all font-sans text-[0.95rem] resize-none"
                                              />
                                              {/* Continue button */}
                                              <div className="flex items-center gap-3">
                                                <Button
                                                  onClick={handleNextQuestion}
                                                  variant="mint"
                                                  className="px-5 py-2.5 min-h-[40px] shadow-none"
                                                  rightIcon={<Check className="w-4 h-4" />}
                                                >
                                                  That feels right
                                                </Button>
                                                <span className="text-[0.74rem] text-slate-400">press Enter or Ctrl+Enter</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="review"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-6"
                                >
                                  <div>
                                    <h3 className="font-serif font-normal text-2xl text-[var(--color-thread-heading)] mb-1.5">Quick check before we save this part</h3>
                                    <p className="text-[var(--color-thread-gray)] text-[0.92rem] leading-relaxed">If something does not feel quite right, tap it and choose again.</p>
                                  </div>

                                  <div className="space-y-3 max-w-xl border-t border-b border-black/5 py-4 my-2 max-h-[300px] overflow-y-auto pr-1">
                                    {(QUESTIONS[qSection || ''] || []).map((q, idx) => {
                                      const ansVal = answers[q.id];
                                      const displayAns = Array.isArray(ansVal) 
                                        ? ansVal.join(', ') 
                                        : ansVal || <span className="text-rose-500 italic font-normal">Not answered</span>;
                                      return (
                                        <button
                                          key={q.id}
                                          onClick={() => {
                                            setActiveQuestionIndex(idx);
                                            setIsReviewing(false);
                                          }}
                                          className="w-full text-left p-4 rounded-tr-[20px] border border-black/5 hover:border-[var(--color-thread-mid-green)]/40 hover:bg-[var(--color-thread-off-white)]/50 transition-all flex justify-between items-start gap-4 cursor-pointer group"
                                        >
                                          <div className="space-y-1.5">
                                            <div className="text-[0.6rem] font-medium text-slate-400 uppercase tracking-[0.12em] group-hover:text-[var(--color-thread-mid-green)] transition-colors">Question {idx + 1}</div>
                                            <div className="text-[0.95rem] font-medium text-slate-800 leading-snug">{q.text.replace(/\$\{childName\}/g, formData.firstName || 'your child')}</div>
                                            <div className="text-sm text-[var(--color-thread-mid-green)] font-semibold bg-[var(--color-thread-light-green)] inline-block px-3 py-1 rounded-lg mt-2">{displayAns}</div>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => {
                                        // Save current answers
                                        saveCurrentChildIntake();
                                        const completed = getCompletedQuestionnaireSections(answers);
                                        // Find next incomplete section
                                        const next = QUESTIONNAIRE_SECTIONS.find((s) => !completed.includes(s)) || null;
                                        if (next) {
                                          setQSection(next);
                                          setActiveQuestionIndex(0);
                                          setIsReviewing(false);
                                          setIsModalOpen(true);
                                        } else {
                                          // No more sections — close modal
                                          setQSection(null);
                                          setIsReviewing(false);
                                          setIsModalOpen(false);
                                        }
                                      }}
                                      variant="mint"
                                      className="px-5 py-2.5 min-h-[40px] shadow-none"
                                    >
                                      Save this part
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setIsReviewing(false);
                                        setActiveQuestionIndex(0);
                                      }}
                                      variant="muted"
                                      className="px-5 py-2.5 min-h-[40px] shadow-none"
                                    >
                                      Look again
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Footer Navigation */}
                          <div className="pt-5 pb-6 px-6 sm:px-10 border-t border-black/5 flex items-center justify-between">
                            {/* Progress bar / index indicator */}
                            <div className="flex items-center gap-4">
                              <span className="text-[0.78rem] font-medium text-slate-400">
                                {!isReviewing 
                                  ? `${activeQuestionIndex + 1} of ${(QUESTIONS[qSection || ''] || []).length}`
                                  : 'Review screen'
                                }
                              </span>
                              {!isReviewing && (
                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[var(--color-thread-mid-green)] transition-all duration-300"
                                    style={{ width: `${((activeQuestionIndex + 1) / (QUESTIONS[qSection || ''] || []).length) * 100}%` }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Up/Down buttons and navigation guides */}
                            <div className="flex items-center gap-2">
                              <span className="text-[0.74rem] text-slate-400 hidden sm:inline-block font-medium">Move back or forward</span>
                              <div className="flex border border-black/10 rounded-full overflow-hidden bg-white">
                                <button
                                  onClick={handlePrevQuestion}
                                  disabled={activeQuestionIndex === 0 && !isReviewing}
                                  className={cn(
                                    "p-2.5 hover:bg-[var(--color-thread-off-white)] transition-all border-r border-black/10 cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                  )}
                                  title="Previous (Arrow Up)"
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleNextQuestion}
                                  disabled={isReviewing}
                                  className={cn(
                                    "p-2.5 hover:bg-[var(--color-thread-off-white)] transition-all cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                  )}
                                  title="Next (Arrow Down)"
                                >
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                  </AnimatePresence>

                </div>

                {/* Unified In-Card navigation footer inside the card container */}
                {!isDirectSessionModal && (
                  <div className="flex items-center justify-between pt-8 border-t border-black/5 mt-12 w-full">
                    {isDirectObservationModal && step === 3 ? (
                      <>
                        <Button onClick={onCancel} variant="muted" className="px-6 shadow-none">
                          Cancel
                        </Button>
                        <div className="flex items-center gap-5">
                          <Button onClick={handleDirectObservationConfirm} variant="mint" className="px-6 shadow-none">
                            Confirm <Check className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={handleBack} 
                          className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="flex items-center gap-5">
                          <Button onClick={handleNext} variant={step === 5 ? "forest" : "mint"} className="px-6 shadow-none">
                            {step === 5 ? 'Finish setup' : 'Continue'} <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </main>
            </>
          )}

          {/* SETUP COMPLETE DONE SCREEN */}
          {step === 'done' && (
            <>
              {/* Left Column: Completion congratulations */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 md:p-14 flex flex-col justify-between gap-10">
                <div className="space-y-8">
                  <div>
                    <span className={sectionKickerClass}>Reflection</span>
                    <h1 className={stepHeadingClass}>Thank you. We've got enough to get started.</h1>
                    <p className={stepLeadClass}>Here's what we've understood so far, based only on what you shared.</p>
                  </div>
                  
                  <div className="bg-[var(--color-thread-off-white)]/70 p-6 rounded-tr-[24px] flex flex-col gap-5">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                        <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                          {mirroredJourneyStage}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                        <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                          The things you'd most like help with are {mirroredHardestAreas}.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-1" />
                        <p className="text-[0.96rem] text-[var(--color-thread-dark-slate)] leading-relaxed">
                          You've told us the information available is: {mirroredAvailableInfo}.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-black/5 pt-5">
                      <div className="text-[0.6rem] tracking-[0.12em] uppercase text-slate-400 font-medium mb-2">How Navigator can help</div>
                      <p className="text-[0.92rem] text-[var(--color-thread-gray)] leading-relaxed">
                        {journeyReflectionCopy.navigatorHelp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 w-full flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button
                    onClick={handleBack}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <Button onClick={onComplete} variant="mint" className="px-8 shadow-none w-full sm:w-auto">
                    Go to your family home <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Next steps timeline & setup another child */}
              <div className="w-full md:w-2/5 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex flex-col justify-start space-y-8 overflow-y-auto">
                <div>
                  <span className="text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] font-medium mb-6 block">What happens next</span>
                  <div className="relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black/5">
                    <TimelineStep
                      title="Before your session"
                      meta="Questionnaire"
                      metaTag="Step 1"
                      description={journeyReflectionCopy.nextStep}
                      active
                    />
                    <TimelineStep
                      title={`Your session — ${formData.sessionDay ? `Thu ${formData.sessionDay} Jun` : isAppointmentCancelled ? 'Session cancelled' : 'Session not booked'}`}
                      meta="Telehealth"
                      metaTag="Step 2"
                      description="Meet Dr. Clark on a video call from home."
                      todo
                    />
                    <TimelineStep
                      title="After your session"
                      meta="Results"
                      metaTag="Step 3"
                      description="She reviews everything, then your result and first priorities appear."
                      todo
                    />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-tr-[24px] border border-black/5 shadow-none">
                  <h4 className="font-medium text-[var(--color-thread-heading)] text-sm mb-1">Setting up another child?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">Each child has their own session, context, and next steps.</p>
                  <Button variant="muted" className="w-full text-xs py-2" onClick={() => {
                    setFormData({
                      firstName: '', dob: '', relation: 'Parent', journeyStage: '', availableInfo: [], notices: [], notes: '', sessionDay: '', sessionTime: ''
                    });
                    setStep(1);
                  }}>
                    Set up another child
                  </Button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
    </>
  );
}
