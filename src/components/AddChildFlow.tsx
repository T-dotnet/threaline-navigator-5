import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, FileText, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrentChild } from '../context/ChildContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { QUESTIONS, QUESTIONNAIRE_SECTIONS, getCompletedQuestionnaireSections } from '../questionnaire';
import { getJourneyReflectionCopy, getJourneySetupCopy } from '../lib/journeyCopy';
import { getAnswerCue, getAnswersAfterOptionSelect, getConversationLead } from '../lib/questionnaireFlow';
import { SetupCompleteStep } from './setup/SetupCompleteStep';
import { SetupStepper } from './setup/SetupStepper';
import {
  SetupChildDetailsStep,
  SetupJourneyStep,
  SetupNoticesStep,
  SetupWelcomeStep,
} from './setup/SetupInitialSteps';
import { SetupQuestionnaireStep } from './setup/SetupQuestionnaireStep';
import { SetupSessionStep } from './setup/SetupSessionStep';
import type { ReflectionDeckData } from './ui/ReflectionDeck';
import watercolorBg from '../assets/images/optimized/watercolor-bg-900.jpg';

interface AddChildFlowProps {
  onComplete: () => void;
  onCancel: () => void;
  asModal?: boolean;
  initialStep?: StepType;
  onShowReflection?: (data: ReflectionDeckData) => void;
}

type StepType = 'welcome' | 1 | 2 | 3 | 4 | 5 | 'done';

export default function AddChildFlow({ onComplete, onCancel, asModal, initialStep, onShowReflection }: AddChildFlowProps) {
  const navigate = useNavigate();
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
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  const { currentChild, addChild, updateChild } = useCurrentChild();
  const [answers, setAnswers] = useState<Record<string, any>>(() => (
    currentChild.isNew ? currentChild.intake?.questionnaireAnswers || {} : {}
  ));

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

  const handleDobChange = (value: string) => {
    if (value) {
      setFormData({ ...formData, dob: value });
    } else {
      setFormData({ ...formData, dob: '' });
    }
  };

  const handleSelectOption = useCallback((qId: string, option: string, type: 'choice' | 'multiple-choice' | 'text') => {
    if (type === 'choice') {
      setAnswers(prev => getAnswersAfterOptionSelect(prev, qId, option, type));
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
      setAnswers(prev => getAnswersAfterOptionSelect(prev, qId, option, type));
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

  const handleGoToProfile = () => {
    navigate('/understanding');
    if (asModal) {
      onComplete();
    }
  };

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
  const meaningfulAvailableInfo = reflectedAvailableInfo.filter((item) => item !== 'Nothing yet');
  const mirroredHardestAreasSentence = formData.notices.length > 0
    ? `The things you'd most like help with are ${formatMirrorList(formData.notices)}.`
    : "What you'd most like help with can become clearer as we go.";
  const mirroredAvailableInfoSentence = meaningfulAvailableInfo.length > 0
    ? `The information you already have includes ${formatMirrorList(meaningfulAvailableInfo)}.`
    : 'You do not need reports or documents to begin.';
  const reflectedChildName = formData.firstName.trim() || currentChild.name || 'Your child';
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
          {step !== 'done' && (
            <div
              className="absolute left-0 top-0 h-1 bg-[var(--color-thread-mid-green)] transition-all duration-500 z-10"
              style={{ width: step === 'welcome' ? '0%' : `${(step as number) / 5 * 100}%` }}
            />
          )}
          
          {/* WELCOME STATE */}
          {step === 'welcome' && (
            <>
              <SetupWelcomeStep
                sectionKickerClass={sectionKickerClass}
                stepHeadingClass={stepHeadingClass}
                stepLeadClass={stepLeadClass}
                onCancel={onCancel}
                onBegin={handleNext}
              />

              {/* Right Column: Setup Stepper */}
              <aside className="order-2 w-full md:w-72 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex-shrink-0 flex flex-col justify-start">
                <SetupStepper activeStep={1} heading="What we'll do together" />
              </aside>
            </>
          )}

          {/* ACTIVE STEPS 1-5 */}
          {typeof step === 'number' && (
            <>
              {/* Right Column: Interactive Sidebar Progress */}
              {!hideStepperForDirectModalStep && (
                <aside className="order-1 md:order-2 w-full md:w-72 bg-transparent p-5 sm:p-8 md:p-10 border-b md:border-b-0 md:border-l border-black/5 flex-shrink-0 flex flex-col">
                  <SetupStepper activeStep={step} heading={`${formData.firstName || 'Your child'}'s setup`} />
                </aside>
              )}

              {/* Step content & in-card action buttons */}
              <main className="order-2 md:order-1 flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-between min-h-[500px]">
                <div className="w-full">
                  
                  {/* Step 1 */}
                  {step === 1 && (
                    <SetupJourneyStep
                      journeyStage={formData.journeyStage}
                      sectionKickerClass={sectionKickerClass}
                      stepHeadingClass={stepHeadingClass}
                      stepLeadClass={stepLeadClass}
                      questionOptionClass={questionOptionClass}
                      onJourneyStageChange={(journeyStage) => setFormData({ ...formData, journeyStage })}
                    />
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <SetupChildDetailsStep
                      firstName={formData.firstName}
                      yearOfBirth={formData.dob || ''}
                      relation={formData.relation}
                      years={yearsArray}
                      sectionKickerClass={sectionKickerClass}
                      stepHeadingClass={stepHeadingClass}
                      stepLeadClass={stepLeadClass}
                      selectClass={selectClass}
                      choiceClass={choiceClass}
                      onFirstNameChange={(firstName) => setFormData({ ...formData, firstName })}
                      onYearOfBirthChange={handleDobChange}
                      onRelationChange={(relation) => setFormData({ ...formData, relation })}
                    />
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <SetupNoticesStep
                      firstName={formData.firstName}
                      notices={formData.notices}
                      sectionKickerClass={sectionKickerClass}
                      stepHeadingClass={stepHeadingClass}
                      stepLeadClass={stepLeadClass}
                      choiceClass={choiceClass}
                      onNoticesChange={(notices) => setFormData({ ...formData, notices })}
                    />
                  )}

                  {/* Step 5 */}
                  {step === 5 && (
                    <SetupSessionStep
                      firstName={formData.firstName}
                      sessionDay={formData.sessionDay}
                      sessionTime={formData.sessionTime}
                      isDirectSessionModal={isDirectSessionModal}
                      isAppointmentCancelled={isAppointmentCancelled}
                      isCancelConfirmOpen={isCancelConfirmOpen}
                      isReadyToBook={isReadyToBook}
                      hasCurrentAppointment={hasCurrentAppointment}
                      currentAppointmentDate={currentAppointmentDate}
                      currentAppointmentTime={currentAppointmentTime}
                      sectionKickerClass={sectionKickerClass}
                      stepHeadingClass={stepHeadingClass}
                      stepLeadClass={stepLeadClass}
                      onReadyToBookChange={setIsReadyToBook}
                      onSessionDaySelect={(sessionDay) => {
                        setIsAppointmentCancelled(false);
                        setIsCancelConfirmOpen(false);
                        setFormData((prev) => ({ ...prev, sessionDay, sessionTime: '' }));
                      }}
                      onSessionTimeSelect={(sessionTime) => {
                        setFormData((prev) => ({ ...prev, sessionTime }));
                      }}
                      onCancelConfirmOpenChange={setIsCancelConfirmOpen}
                      onCancelAppointment={handleCancelAppointment}
                      onConfirmBooking={() => {
                        saveCurrentChildIntake();
                        if (isDirectSessionModal) {
                          handleDirectSessionConfirm();
                          return;
                        }
                        handleNext();
                      }}
                      onBack={handleBack}
                    />
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <SetupQuestionnaireStep
                      title={journeySetupCopy.title}
                      description={journeySetupCopy.description}
                      answers={answers}
                      sectionKickerClass={sectionKickerClass}
                      stepHeadingClass={stepHeadingClass}
                      stepLeadClass={stepLeadClass}
                      getSectionStatus={getSectionStatus}
                      onOpenSection={(sectionName) => {
                        setQSection(sectionName);
                        setActiveQuestionIndex(0);
                        setIsReviewing(false);
                        setIsModalOpen(true);
                      }}
                    />
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
                        <Button
                          type="button"
                          onClick={handleBack}
                          variant="link"
                          className="text-sm font-medium text-slate-500 hover:text-slate-900 border-b-0 pb-0"
                          leftIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                          Back
                        </Button>
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
            <SetupCompleteStep
              reflectedChildName={reflectedChildName}
              mirroredJourneyStage={mirroredJourneyStage}
              mirroredHardestAreasSentence={mirroredHardestAreasSentence}
              mirroredAvailableInfoSentence={mirroredAvailableInfoSentence}
              navigatorHelp={journeyReflectionCopy.navigatorHelp}
              nextStep={journeyReflectionCopy.nextStep}
              sessionDay={formData.sessionDay}
              isAppointmentCancelled={isAppointmentCancelled}
              sectionKickerClass={sectionKickerClass}
              stepHeadingClass={stepHeadingClass}
              stepLeadClass={stepLeadClass}
              onBack={handleBack}
              onViewProfile={() => {
                onShowReflection?.({
                  childName: reflectedChildName,
                  navigatorHelp: journeyReflectionCopy.navigatorHelp,
                  nextStep: journeyReflectionCopy.nextStep,
                  selectedNotices: formData.notices,
                  availableInfo: reflectedAvailableInfo,
                  questionnaireAnswers: answers,
                });
                handleGoToProfile();
              }}
              onSetupAnotherChild={() => {
                setFormData({
                  firstName: '',
                  dob: '',
                  relation: 'Parent',
                  journeyStage: '',
                  availableInfo: [],
                  notices: [],
                  notes: '',
                  sessionDay: '',
                  sessionTime: '',
                });
                setStep(1);
              }}
            />
          )}

        </div>
      </div>
    </div>
    </>
  );
}
