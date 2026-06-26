import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, X, User, Calendar, Clock, UploadCloud, FileText, Activity, Users, Settings, ArrowRight, ArrowLeft, Upload, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useCurrentChild } from '../context/ChildContext';
import { useLocker } from '../context/LockerContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { HeroQuoteCard } from './ui/HeroQuoteCard';
import { TimelineStep } from './ui/TimelineStep';
import { PageIcon } from './ui/PageIcon';
import { getCompletedQuestionnaireSections } from '../questionnaire';
import watercolorBg from '../assets/images/watercolor_bg_1782427011739.jpg';

interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: 'choice' | 'multiple-choice' | 'text';
  options?: string[];
  placeholder?: string;
}

const QUESTIONS: Record<string, Question[]> = {
  'Home & family': [
    {
      id: 'family_live_with',
      text: 'Who does ${childName} live with at home?',
      subtext: 'Select all that apply.',
      type: 'multiple-choice',
      options: ['Both parents', 'Mother', 'Father', 'Step-parent', 'Grandparents', 'Siblings', 'Other relatives'],
    },
    {
      id: 'family_relationship',
      text: 'How would you describe their relationship with their primary caregivers?',
      subtext: 'Choose the option that fits best.',
      type: 'choice',
      options: [
        'Very close and supportive',
        'Mostly positive with occasional conflict',
        'Can be challenging or strained',
        'Varies significantly day-to-day'
      ],
    },
    {
      id: 'family_transitions',
      text: 'Have there been any major family transitions or stressors recently?',
      subtext: 'Select any that apply.',
      type: 'multiple-choice',
      options: [
        'None',
        'Moving home or school',
        'New sibling',
        'Separation or divorce',
        'Loss or illness in the family',
        'Change in parent employment'
      ],
    },
    {
      id: 'family_interests',
      text: "What are ${childName}'s favorite activities or special interests?",
      subtext: 'Tell us what brings them joy or keeps them highly engaged.',
      type: 'text',
      placeholder: 'e.g., Building Lego, drawing dinosaurs, playing outside, reading books...'
    }
  ],
  'Daily routines': [
    {
      id: 'routines_bedtime',
      text: 'How often is bedtime a struggle?',
      type: 'choice',
      options: ['Never', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'routines_sleep',
      text: 'How many hours of sleep does ${childName} usually get per night?',
      type: 'choice',
      options: ['Less than 6 hours', '6 to 8 hours', '8 to 10 hours', '10+ hours']
    },
    {
      id: 'routines_morning',
      text: 'How does ${childName} handle morning routines and getting ready?',
      type: 'choice',
      options: [
        'Very independent and cooperative',
        'Needs occasional reminders or prompting',
        'Frequently resists or gets distracted',
        'A significant daily challenge for the family'
      ]
    },
    {
      id: 'routines_eating',
      text: 'How would you describe their eating habits and mealtimes?',
      type: 'choice',
      options: [
        'Enjoys a wide variety of foods',
        'Somewhat selective or picky',
        'Extremely selective / sensitive to textures',
        'Often refuses meals or struggles to sit'
      ]
    }
  ],
  'At school': [
    {
      id: 'school_type',
      text: 'What is ${childName}\'s current school or learning environment?',
      type: 'choice',
      options: [
        'Preschool / Kindergarten',
        'Primary school (Prep to Year 6)',
        'High school (Year 7 to 12)',
        'Homeschooled',
        'Not yet in structured education'
      ]
    },
    {
      id: 'school_feeling',
      text: 'How does ${childName} feel about going to school?',
      type: 'choice',
      options: [
        'Excited and looks forward to it',
        'Content but neutral',
        'Anxious or reluctant at times',
        'Strongly resists or refuses to go'
      ]
    },
    {
      id: 'school_social',
      text: 'How does ${childName} interact with peers or friends?',
      type: 'choice',
      options: [
        'Has close friends and socializes easily',
        'Enjoys playing but has occasional conflicts',
        'Prefers solo play or struggles to make friends',
        'Often feels left out or overwhelmed socially'
      ]
    },
    {
      id: 'school_support',
      text: 'Does ${childName} receive any additional learning support or modifications?',
      type: 'choice',
      options: [
        'No additional support needed',
        'Informal adjustments by the teacher',
        'Individual Education Plan (IEP / ILP)',
        'Full-time support aide or special education'
      ]
    }
  ],
  'Development & history': [
    {
      id: 'dev_sensory',
      text: 'Have you noticed any specific sensory sensitivities?',
      subtext: 'Select all that apply.',
      type: 'multiple-choice',
      options: [
        'Loud noises or sudden sounds',
        'Bright or flickering lights',
        'Certain clothing tags or fabric textures',
        'Picky eating / food textures',
        'Smells or physical touch',
        'None of the above'
      ]
    },
    {
      id: 'dev_communication',
      text: 'How would you describe ${childName}\'s communication style?',
      type: 'choice',
      options: [
        'Highly verbal and expressive',
        'Communicates well but speaks less in public',
        'Uses short sentences or gets frustrated expressing ideas',
        'Uses non-verbal methods or alternative communication'
      ]
    },
    {
      id: 'dev_regulation',
      text: 'Does ${childName} find it easy to self-regulate when upset or overwhelmed?',
      type: 'choice',
      options: [
        'Calms down quickly with some support',
        'Takes time but eventually self-soothes',
        'Frequently has intense or long meltdowns',
        'Struggles significantly to regulate emotions'
      ]
    },
    {
      id: 'dev_strengths',
      text: 'What are the primary strengths you see in ${childName}?',
      subtext: 'We love to hear about what they do best.',
      type: 'text',
      placeholder: 'e.g., Kind and empathetic, highly creative, great memory, excellent puzzle solver...'
    }
  ]
};

interface AddChildFlowProps {
  onComplete: () => void;
  onCancel: () => void;
  asModal?: boolean;
}

type StepType = 'welcome' | 1 | 2 | 3 | 4 | 5 | 'done';

export default function AddChildFlow({ onComplete, onCancel, asModal }: AddChildFlowProps) {
  const [step, setStep] = useState<StepType>(() => {
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
      const validSections = ['Home & family', 'Daily routines', 'At school', 'Development & history'];
      if (sectionParam && validSections.includes(sectionParam)) {
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

  // Detect user's timezone on load or default to Sydney/Melbourne (AEST)
  const detectTimezone = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Sydney') || tz.includes('Melbourne') || tz.includes('Brisbane') || tz.includes('Hobart') || tz.includes('Canberra')) {
        return 'AEST';
      } else if (tz.includes('Adelaide') || tz.includes('Darwin')) {
        return 'ACST';
      } else if (tz.includes('Perth')) {
        return 'AWST';
      }
      // If outside Australia, check offset
      const offset = -new Date().getTimezoneOffset() / 60;
      if (offset === 10 || offset === 11) return 'AEST';
      if (offset === 9.5 || offset === 10.5) return 'ACST';
      if (offset === 8) return 'AWST';
      return 'AEST'; // default to AEST
    } catch (e) {
      return 'AEST';
    }
  };

  const [selectedTz, setSelectedTz] = useState(detectTimezone());

  const getConvertedTime = (baseTimeStr: string, targetTz: string) => {
    if (targetTz === 'AEST') return baseTimeStr;
    
    // Parse base time (assuming AEST)
    const [time, modifier] = baseTimeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'pm' && hours < 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    
    // Subtract offset difference relative to AEST (AEST is UTC+10)
    let diff = 0; // in hours
    if (targetTz === 'AWST') diff = -2; // Perth is UTC+8
    if (targetTz === 'ACST') diff = -0.5; // Adelaide is UTC+9.5
    
    let totalMinutes = hours * 60 + minutes + (diff * 60);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // wrap around
    
    const targetHours = Math.floor(totalMinutes / 60) % 24;
    const targetMinutes = Math.round(totalMinutes % 60);
    
    const finalHours = targetHours % 12 === 0 ? 12 : targetHours % 12;
    const finalMinutes = String(targetMinutes).padStart(2, '0');
    const finalModifier = targetHours >= 12 ? 'pm' : 'am';
    
    return `${finalHours}:${finalMinutes} ${finalModifier}`;
  };

  const getDobParts = () => {
    if (!formData.dob) return { day: '', month: '', year: '' };
    const parts = formData.dob.split(' / ');
    return {
      day: parts[0] || '',
      month: parts[1] || '',
      year: parts[2] || ''
    };
  };

  const handleDobChange = (part: 'day' | 'month' | 'year', value: string) => {
    const { day, month, year } = getDobParts();
    const newParts = { day, month, year, [part]: value };
    
    if (newParts.day || newParts.month || newParts.year) {
      setFormData({
        ...formData,
        dob: `${newParts.day} / ${newParts.month} / ${newParts.year}`
      });
    } else {
      setFormData({ ...formData, dob: '' });
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFile } = useLocker();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFiles = useCallback((filesList: FileList) => {
    const newFiles: { name: string; size: string }[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      newFiles.push({ name: file.name, size: sizeStr });
    }
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

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
        const updated = current.includes(option)
          ? current.filter((o: string) => o !== option)
          : [...current, option];
        return { ...prev, [qId]: updated };
      });
    }
  }, [qSection]);

  const handleTextChange = useCallback((qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

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
    notices: currentChild.isNew ? currentChild.intake?.notices || [] as string[] : [] as string[],
    notes: currentChild.isNew ? currentChild.intake?.notes || '' : '',
    sessionDay: currentChild.isNew ? currentChild.intake?.sessionDay || '' : '',
    sessionTime: currentChild.isNew ? currentChild.intake?.sessionTime || '' : '',
  }));

  const buildIntake = (nextAnswers = answers) => ({
    relation: formData.relation,
    notices: formData.notices,
    notes: formData.notes,
    sessionDay: formData.sessionDay,
    sessionTime: formData.sessionTime,
    questionnaireAnswers: nextAnswers,
    completedQuestionnaireSections: getCompletedQuestionnaireSections(nextAnswers),
  });

  const saveCurrentChildIntake = (nextAnswers = answers) => {
    if (!currentChild.isNew) return;
    const name = formData.firstName || currentChild.name || 'New Child';
    updateChild({
      ...currentChild,
      name,
      initial: name.charAt(0).toUpperCase(),
      intake: buildIntake(nextAnswers),
    });
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
      // Add files to Locker
      uploadedFiles.forEach(f => {
        addFile({
          typeId: "report",
          typeName: "Report",
          name: f.name,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          shared: false,
          icon: FileText
        });
      });

      const name = formData.firstName || currentChild.name || 'New Child';
      const child = {
        ...(currentChild.isNew ? currentChild : {}),
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
    if (step === 1) setStep('welcome');
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  const steps = [
    { num: 1, title: 'Your child', desc: 'Name & date of birth' },
    { num: 2, title: 'What you notice', desc: 'Concerns & notes' },
    { num: 3, title: 'Your session', desc: 'Book a video call' },
    { num: 4, title: 'Questionnaire', desc: 'Everyday life' },
    { num: 5, title: 'Documents', desc: 'Optional uploads' },
  ];

  const relations = ['Parent', 'Guardian', 'Carer'];
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

  return (
    <>
      {asModal && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      )}
      <div className={cn(
        "font-sans flex flex-col",
        asModal
          ? "fixed inset-0 z-50 overflow-hidden"
          : "min-h-screen bg-watercolor bg-fixed relative"
      )}>
      {/* Top Bar */}
      <div className={cn(
        "bg-white/95 backdrop-blur-md border-b border-black/5",
        !asModal && "sticky top-0 z-50"
      )}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-serif font-medium text-lg text-[var(--color-thread-heading)]">
            <div className="w-8 h-8 rounded-full bg-[var(--color-thread-heading)] text-white flex items-center justify-center">
              <span className="text-sm">T</span>
            </div>
            Threadline
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-500 font-medium">
              {step === 'welcome' && 'Welcome'}
              {step === 'done' && 'Setup complete'}
              {typeof step === 'number' && `Step ${step} of 5`}
            </span>
            <button 
              onClick={onCancel} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close setup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-black/5">
          <div 
            className="h-full bg-[var(--color-thread-mid-green)] transition-all duration-500"
            style={{ width: step === 'welcome' ? '0%' : step === 'done' ? '100%' : `${(step as number) / 5 * 100}%` }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className={cn(
        "flex-1 w-full bg-transparent px-4 sm:px-6 md:px-8 flex items-start justify-center",
        asModal ? "overflow-y-auto py-8" : "py-8 sm:py-12 md:py-16"
      )}>
        <div className="max-w-5xl w-full bg-white rounded-3xl md:rounded-none md:rounded-tr-[48px] shadow-premium border border-black/5 flex flex-col md:flex-row overflow-hidden min-h-[640px]">
          
          {/* WELCOME STATE */}
          {step === 'welcome' && (
            <>
              {/* Left Column: Welcome messaging */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 md:p-14 flex flex-col justify-between gap-10">
                <div className="space-y-8">
                  <div>
                    <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-4 block">Welcome to Threadline</span>
                    <h1 className="font-serif font-normal text-3xl md:text-4xl leading-[1.15] tracking-tight mb-4 text-[var(--color-thread-heading)]">Let's set up Threadline for your family.</h1>
                    <p className="text-slate-500 text-[1.05rem] leading-relaxed max-w-[42ch]">A few short steps to get ready for your first session. It takes about ten minutes, and you can pause and pick up anytime — your progress is saved.</p>
                  </div>
                  
                  <div className="bg-[var(--color-thread-off-white)] p-5 rounded-2xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-thread-light-green)] flex items-center justify-center flex-shrink-0 text-[var(--color-thread-mid-green)]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">A clinician leads everything</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Your session is led by a registered clinician, and they review every result before you see it. Threadline does the structured work behind the scenes — a person is always accountable for your care.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Button onClick={handleNext} variant="forest" className="text-[0.95rem] px-8 py-4 shadow-none w-full sm:w-auto">
                    Begin setup <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Timeline Step Overview */}
              <div className="w-full md:w-2/5 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex flex-col justify-center">
                <span className="text-[0.75rem] font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-6 block">What we'll do together</span>
                <div className="relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black/5">
                  <TimelineStep
                    title="Add your child"
                    meta="Basic details"
                    metaTag="Step 1"
                    description="Their name and date of birth."
                    active
                  />
                  <TimelineStep
                    title="Share what you've noticed"
                    meta="Areas on your mind"
                    metaTag="Step 2"
                    description="The areas on your mind, in your own words."
                    todo
                  />
                  <TimelineStep
                    title="Book your session"
                    meta="Schedule"
                    metaTag="Step 3"
                    description="A clinician-led video call that suits you."
                    todo
                  />
                  <TimelineStep
                    title="Answer the questionnaire"
                    meta="Guided questions"
                    metaTag="Step 4"
                    description="Guided questions about everyday life."
                    todo
                  />
                  <TimelineStep
                    title="Add helpful documents"
                    meta="Optional"
                    metaTag="Step 5"
                    description="Reports or notes, if you have them."
                    todo
                  />
                </div>
              </div>
            </>
          )}

          {/* ACTIVE STEPS 1-5 */}
          {typeof step === 'number' && (
            <>
              {/* Left Column: Interactive Sidebar Progress */}
              {true && (
                <aside className="w-full md:w-72 bg-transparent p-8 sm:p-10 border-b md:border-b-0 md:border-r border-black/5 flex-shrink-0 flex flex-col">
                  <div className="font-sans font-semibold text-lg text-[var(--color-thread-heading)] tracking-tight mb-8">
                    {formData.firstName || 'Your child'}'s setup
                  </div>
                  <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/5">
                    {steps.map((s) => {
                      const isPast = step > s.num;
                      const isCurrent = step === s.num;
                      return (
                        <div key={s.num} className="flex gap-4 relative z-10">
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors bg-[var(--color-thread-off-white)]",
                            isPast ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white" :
                            isCurrent ? "border-[var(--color-thread-mid-green)] text-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)] shadow-[0_0_0_4px_var(--color-thread-light-green)]" :
                            "border-slate-200 text-slate-400 bg-white"
                          )}>
                            {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                          </div>
                          <div>
                            <div className={cn(
                              "text-sm font-semibold mb-0.5 transition-colors",
                              isCurrent || isPast ? "text-[var(--color-thread-heading)]" : "text-slate-400"
                            )}>{s.title}</div>
                            <div className={cn(
                              "text-xs transition-colors",
                              isCurrent ? "text-slate-500" : "text-slate-400"
                            )}>{s.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              )}

              {/* Right Column: Step content & in-card action buttons */}
              <main className="flex-1 p-8 sm:p-12 md:p-14 flex flex-col justify-between min-h-[500px]">
                <div className="w-full">
                  
                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className="text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-3 block">Step 1 of 5 · Your child</span>
                        <h1 className="font-serif font-normal text-3xl text-[var(--color-thread-heading)] mb-2">Add your child</h1>
                        <p className="text-slate-500 text-[0.95rem]">Start with the basics — who we're supporting and how you're related to them.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <Label>Child's first name</Label>
                          <Input 
                            placeholder="e.g. Maya" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="max-w-md py-3 bg-white"
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">Date of birth</Label>
                          <div className="flex gap-3 max-w-md">
                            <div className="flex-[1]">
                              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">Day</span>
                              <div className="relative">
                                <select
                                  value={getDobParts().day}
                                  onChange={(e) => handleDobChange('day', e.target.value)}
                                  className="w-full py-2.5 pl-3 pr-8 bg-white border border-black/15 rounded-xl text-sm text-[var(--color-thread-dark-slate)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)] transition-all appearance-none cursor-pointer"
                                >
                                  <option value="">DD</option>
                                  {daysArray.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            </div>
                            <div className="flex-[2]">
                              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">Month</span>
                              <div className="relative">
                                <select
                                  value={getDobParts().month}
                                  onChange={(e) => handleDobChange('month', e.target.value)}
                                  className="w-full py-2.5 pl-3 pr-8 bg-white border border-black/15 rounded-xl text-sm text-[var(--color-thread-dark-slate)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)] transition-all appearance-none cursor-pointer"
                                >
                                  <option value="">Month</option>
                                  {monthsArray.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                  ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                              </div>
                            </div>
                            <div className="flex-[1.5]">
                              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5 block">Year</span>
                              <div className="relative">
                                <select
                                  value={getDobParts().year}
                                  onChange={(e) => handleDobChange('year', e.target.value)}
                                  className="w-full py-2.5 pl-3 pr-8 bg-white border border-black/15 rounded-xl text-sm text-[var(--color-thread-dark-slate)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)] transition-all appearance-none cursor-pointer"
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
                        </div>
                        <div>
                          <Label>I'm the child's…</Label>
                          <div className="flex flex-wrap gap-2">
                            {relations.map(rel => (
                              <button
                                key={rel}
                                onClick={() => setFormData({...formData, relation: rel})}
                                className={cn(
                                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all border shadow-none cursor-pointer",
                                  formData.relation === rel 
                                    ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)] font-semibold"
                                    : "bg-white border-black/10 text-slate-600 hover:border-black/20"
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

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className="text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-3 block">Step 2 of 5 · What you notice</span>
                        <h1 className="font-serif font-normal text-3xl text-[var(--color-thread-heading)] mb-2">What you're noticing</h1>
                        <p className="text-slate-500 text-[0.95rem]">There are no wrong answers — the areas you flag and anything you add in your own words help your clinician prepare for {formData.firstName || 'your child'}'s session.</p>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <Label className="mb-3">What are you noticing? <span className="text-slate-400 font-normal ml-2">choose any that fit</span></Label>
                          <div className="flex flex-wrap gap-2.5">
                            {noticeOptions.map(opt => {
                              const isSelected = formData.notices.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    const newNotices = isSelected 
                                      ? formData.notices.filter(n => n !== opt)
                                      : [...formData.notices, opt];
                                    setFormData({...formData, notices: newNotices});
                                  }}
                                  className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2 shadow-none cursor-pointer",
                                    isSelected 
                                      ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)] font-semibold"
                                      : "bg-white border-black/10 text-slate-600 hover:border-black/20"
                                  )}
                                >
                                  {opt}
                                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-thread-mid-green)]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-3">Anything in your own words? <span className="text-slate-400 font-normal ml-2">optional</span></Label>
                          <textarea 
                            className="w-full min-h-[120px] p-4 rounded-xl border border-black/10 bg-white text-[0.95rem] text-[var(--color-thread-dark-slate)] placeholder:text-[var(--color-thread-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)]/30 transition-all resize-y shadow-none"
                            placeholder="Write as much or as little as you like..."
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className="text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-3 block">Step 3 of 5 · Your session</span>
                        <h1 className="font-serif font-normal text-3xl text-[var(--color-thread-heading)] mb-2">Book your session</h1>
                        <p className="text-slate-500 text-[0.95rem]">One structured video call with a clinician. Pick a time that works — you can reschedule later if you need to.</p>
                      </div>

                      <div className="bg-[var(--color-thread-off-white)] p-5 rounded-2xl shadow-none flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--color-thread-heading)] flex items-center justify-center flex-shrink-0 text-white font-serif text-lg">
                          NC
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Dr. Naomi Clark</h4>
                          <p className="text-xs text-slate-400 mb-2">Consultant Child Psychologist · PhD, MAPS</p>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-md">Dr Clark specializes in developmental profiles and child-centered environments. She leads the review of {formData.firstName || 'your child'}'s profile and works with your family.</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <Label className="mb-3">Choose a day</Label>
                          <div className="flex flex-wrap gap-2.5">
                            {days.map(d => (
                              <button
                                key={d.num}
                                onClick={() => setFormData({...formData, sessionDay: d.num, sessionTime: ''})}
                                className={cn(
                                  "w-[4.5rem] py-3 rounded-xl flex flex-col items-center justify-center border transition-all shadow-none cursor-pointer hover:scale-[1.02]",
                                  formData.sessionDay === d.num
                                    ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)] font-semibold scale-[1.02]"
                                    : "bg-white border-black/10 text-slate-600 hover:border-black/20"
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
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <Label className="mb-0">Choose a time</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Your Timezone:</span>
                                <div className="relative">
                                  <select
                                    value={selectedTz}
                                    onChange={(e) => setSelectedTz(e.target.value)}
                                    className="text-xs font-semibold py-1.5 pl-2.5 pr-8 bg-white border border-black/10 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-[var(--color-thread-mid-green)] focus:border-[var(--color-thread-mid-green)] transition-all appearance-none cursor-pointer"
                                  >
                                    <option value="AEST">AEST / AEDT</option>
                                    <option value="ACST">ACST / ACDT</option>
                                    <option value="AWST">AWST</option>
                                  </select>
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                              {times.map(t => {
                                const converted = getConvertedTime(t, selectedTz);
                                return (
                                  <button
                                    key={t}
                                    onClick={() => setFormData({...formData, sessionTime: t})}
                                    className={cn(
                                      "px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border shadow-none cursor-pointer flex flex-col items-center justify-center gap-0.5 min-w-[5.5rem]",
                                      formData.sessionTime === t
                                        ? "bg-[var(--color-thread-light-green)] border-transparent text-[var(--color-thread-heading)] font-semibold"
                                        : "bg-white border-black/10 text-slate-600 hover:border-black/20"
                                    )}
                                  >
                                    <span className="font-semibold text-[0.92rem]">{converted}</span>
                                    {converted !== t && (
                                      <span className="text-[9px] text-slate-400 font-normal">({t} AEST)</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-[var(--color-thread-off-white)] p-5 rounded-xl text-slate-600 text-sm flex gap-3.5">
                        <Clock className="w-5 h-5 text-[var(--color-thread-mid-green)] flex-shrink-0 mt-0.5" />
                        <div>A <span className="font-semibold">45-minute telehealth session</span> — a structured interview, some gentle observation, and a few short tasks for {formData.firstName || 'Maya'}. Join from home.</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4 */}
                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      {true && (
                        <div>
                          <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-4 block">Step 4 of 5 · Questionnaire</span>
                          <h1 className="font-sans font-medium text-3xl text-[var(--color-thread-heading)] mb-2">Everyday life & environment</h1>
                          <p className="text-slate-500 text-[1.05rem] leading-relaxed max-w-[42ch]">A comprehensive view of {formData.firstName || 'Maya'}'s world — from routines to school life. A clinician reviews every answer before your session.</p>
                        </div>
                      )}

                      {(
                        <div className="space-y-3">
                          {(() => {
                            const completedSectionsCount = ['Home & family', 'Daily routines', 'At school', 'Development & history'].filter(
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
                              <div className="bg-[var(--color-thread-off-white)] p-5 rounded-2xl shadow-none flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full border-4 border-[var(--color-thread-mid-green)]/15 bg-white flex items-center justify-center relative flex-shrink-0">
                                  {/* Beautiful dynamic progress percentage visual indicator */}
                                  <svg className="w-full h-full transform -rotate-90 absolute">
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="18"
                                      stroke="var(--color-thread-mid-green)"
                                      strokeWidth="3.5"
                                      fill="transparent"
                                      strokeDasharray={2 * Math.PI * 18}
                                      strokeDashoffset={2 * Math.PI * 18 * (1 - (progressPercent || 1) / 100)}
                                      className="transition-all duration-500"
                                    />
                                  </svg>
                                  <span className="text-[11px] font-bold text-slate-700 z-10">{progressPercent}%</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900 text-sm mb-0.5">{completedSectionsCount} of 4 sections completed</div>
                                  <div className="text-xs text-slate-400">{answeredQuestionsCount} of {totalQuestionsCount} questions answered. Progress is saved.</div>
                                </div>
                              </div>
                            );
                          })()}

                          {['Home & family', 'Daily routines', 'At school', 'Development & history'].map((sec, i) => {
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
                                  "w-full bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-5 text-left transition-all group",
                                  isLocked
                                    ? "border-black/5 opacity-50 cursor-not-allowed"
                                    : "border-black/5 hover:border-[var(--color-thread-mid-green)] hover:shadow-premium-hover hover:bg-slate-50/50 cursor-pointer"
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
                                  <div className="flex-1">
                                    <div className={cn("font-sans font-medium text-lg leading-tight", isLocked ? "text-slate-400" : "text-slate-900")}>{sec}</div>
                                    <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                      {isLocked
                                        ? `Complete "${['Home & family', 'Daily routines', 'At school', 'Development & history'][i - 1]}" to unlock`
                                        : `Tell us about ${formData.firstName || 'Maya'}'s everyday life · ${qCount} questions`}
                                    </div>
                                    {!isLocked && (
                                      <div className={cn(
                                        "text-[10px] font-bold mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full uppercase tracking-wider",
                                        isDone ? "bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)]" : status === 'Not started' ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-600"
                                      )}>
                                        {isDone && <Check className="w-3 h-3" />}
                                        {isDone ? 'Completed' : isInProgress ? status : 'Start section →'}
                                      </div>
                                    )}
                                  </div>
                                {!isLocked && <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />}
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
                        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] border border-black/5 flex flex-col max-h-[90vh] overflow-hidden"
                      >
                        <div className="flex flex-col h-full justify-between min-h-[480px]">
                          {/* Header / Nav-back */}
                          <div className="flex items-center justify-between p-6 pb-5 border-b border-black/5">
                            <button
                              onClick={() => {
                                saveCurrentChildIntake();
                                setQSection(null);
                                setIsModalOpen(false);
                              }}
                              className="text-xs font-bold uppercase tracking-wider text-[var(--color-thread-mid-green)] hover:text-[var(--color-thread-heading)] flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <ArrowLeft className="w-4 h-4" /> Save & Exit Section
                            </button>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">
                              {qSection}
                            </span>
                          </div>

                          {/* Main Body */}
                          <div className="flex-1 py-8 px-6 sm:px-10 flex flex-col justify-center overflow-y-auto">
                            <AnimatePresence mode="wait">
                              {!isReviewing ? (
                                <motion.div
                                  key={activeQuestionIndex}
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
                                        <div className="space-y-2">
                                          <div className="flex items-start gap-3">
                                            <span className="text-sm font-bold text-[var(--color-thread-mid-green)] mt-1.5">{String(activeQuestionIndex + 1).padStart(2, '0')} →</span>
                                            <h2 className="font-serif font-normal text-2xl md:text-3xl text-[var(--color-thread-heading)] leading-snug">
                                              {qText}
                                            </h2>
                                          </div>
                                          {qSub && (
                                            <p className="text-slate-400 text-[0.92rem] ml-8">{qSub}</p>
                                          )}
                                        </div>

                                        <div className="ml-8">
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
                                                      "w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-none",
                                                      isSelected
                                                        ? "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)] text-[var(--color-thread-heading)] font-semibold"
                                                        : "bg-white border-black/10 text-slate-700 hover:border-black/20 hover:bg-slate-50/50"
                                                    )}
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <span className={cn(
                                                        "w-6 h-6 rounded-md border text-[10px] font-mono font-bold flex items-center justify-center transition-colors",
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
                                                      "w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all duration-200 cursor-pointer shadow-none",
                                                      isSelected
                                                        ? "bg-[var(--color-thread-light-green)] border-[var(--color-thread-mid-green)] text-[var(--color-thread-heading)] font-semibold"
                                                        : "bg-white border-black/10 text-slate-700 hover:border-black/20 hover:bg-slate-50/50"
                                                    )}
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <span className={cn(
                                                        "w-6 h-6 rounded-md border text-[10px] font-mono font-bold flex items-center justify-center transition-colors",
                                                        isSelected
                                                          ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                                          : "bg-white border-black/10 text-slate-400 group-hover:border-black/20 group-hover:text-slate-600"
                                                      )}>
                                                        {letter}
                                                      </span>
                                                      <span className="text-[0.95rem]">{opt}</span>
                                                    </div>
                                                    <div className={cn(
                                                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                                      isSelected
                                                        ? "bg-[var(--color-thread-mid-green)] border-[var(--color-thread-mid-green)] text-white"
                                                        : "border-black/10 group-hover:border-black/20 bg-white"
                                                    )}>
                                                      {isSelected && <Check className="w-3.5 h-3.5" />}
                                                    </div>
                                                  </button>
                                                );
                                              })}

                                              {/* Navigation OK button */}
                                              <div className="pt-4 flex items-center gap-3">
                                                <button
                                                  onClick={handleNextQuestion}
                                                  className="bg-[var(--color-thread-mid-green)] text-white px-6 py-2.5 rounded-xl font-semibold shadow-none hover:bg-[var(--color-thread-heading)] transition-all flex items-center gap-2 cursor-pointer text-sm"
                                                >
                                                  OK <Check className="w-4 h-4" />
                                                </button>
                                                <span className="text-[10px] font-mono text-slate-400">press Enter ↵</span>
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
                                                className="w-full bg-white border border-black/15 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-thread-mid-green)]/20 focus:border-[var(--color-thread-mid-green)] transition-all font-sans text-base resize-none"
                                              />
                                              {/* Navigation OK button */}
                                              <div className="flex items-center gap-3">
                                                <button
                                                  onClick={handleNextQuestion}
                                                  className="bg-[var(--color-thread-mid-green)] text-white px-6 py-2.5 rounded-xl font-semibold shadow-none hover:bg-[var(--color-thread-heading)] transition-all flex items-center gap-2 cursor-pointer text-sm"
                                                >
                                                  OK <Check className="w-4 h-4" />
                                                </button>
                                                <span className="text-[10px] font-mono text-slate-400">press Enter ↵ or Ctrl+Enter</span>
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
                                    <h3 className="font-serif font-normal text-2xl text-[var(--color-thread-heading)] mb-1.5">Review your answers</h3>
                                    <p className="text-slate-500 text-sm">Click on any question to change your answer before saving.</p>
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
                                          className="w-full text-left p-3.5 rounded-xl border border-black/5 hover:border-[var(--color-thread-mid-green)] hover:bg-slate-50/50 transition-all flex justify-between items-start gap-4 cursor-pointer group"
                                        >
                                          <div className="space-y-1.5">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[var(--color-thread-mid-green)] transition-colors">Question {idx + 1}</div>
                                            <div className="text-[0.95rem] font-medium text-slate-800 leading-snug">{q.text.replace(/\$\{childName\}/g, formData.firstName || 'your child')}</div>
                                            <div className="text-sm text-[var(--color-thread-mid-green)] font-semibold bg-[var(--color-thread-light-green)] inline-block px-3 py-1 rounded-lg mt-2">{displayAns}</div>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => {
                                        saveCurrentChildIntake();
                                        setQSection(null);
                                        setIsReviewing(false);
                                        setIsModalOpen(false);
                                      }}
                                      className="bg-[var(--color-thread-mid-green)] text-white px-6 py-2.5 rounded-xl font-semibold shadow-none hover:bg-[var(--color-thread-heading)] transition-all flex items-center gap-2 cursor-pointer text-sm"
                                    >
                                      Confirm & Save Section
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIsReviewing(false);
                                        setActiveQuestionIndex(0);
                                      }}
                                      className="bg-white border border-black/10 hover:border-black/20 text-slate-600 px-5 py-2.5 rounded-xl font-semibold shadow-none transition-all text-sm cursor-pointer"
                                    >
                                      Back to start
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Footer Navigation */}
                          <div className="pt-5 pb-6 px-6 sm:px-10 border-t border-black/5 flex items-center justify-between">
                            {/* Progress bar / index indicator */}
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono font-bold text-slate-400">
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
                              <span className="text-[10px] text-slate-400 hidden sm:inline-block font-medium animate-pulse">Use Arrow Keys ↑↓ to navigate</span>
                              <div className="flex border border-black/10 rounded-xl overflow-hidden bg-white">
                                <button
                                  onClick={handlePrevQuestion}
                                  disabled={activeQuestionIndex === 0 && !isReviewing}
                                  className={cn(
                                    "p-2.5 hover:bg-slate-50 transition-all border-r border-black/10 cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                  )}
                                  title="Previous (Arrow Up)"
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleNextQuestion}
                                  disabled={isReviewing}
                                  className={cn(
                                    "p-2.5 hover:bg-slate-50 transition-all cursor-pointer text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
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

                  {/* Step 5 */}
                  {step === 5 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div>
                        <span className="text-xs font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-3 block">Step 5 of 5 · Helpful documents</span>
                        <h1 className="font-serif font-normal text-3xl text-[var(--color-thread-heading)] mb-2">Add any helpful documents</h1>
                        <p className="text-slate-500 text-[0.95rem]">Anything that helps your clinician understand {formData.firstName || 'Maya'} — all optional, and you can add more after your session.</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-baseline mb-3">
                            <Label className="mb-0">Reports & Notes</Label>
                            <span className="text-xs text-slate-400">optional</span>
                          </div>
                          
                          <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileInput}
                            className={cn(
                              "border-1.5 border-dashed rounded-tr-[24px] p-10 text-center cursor-pointer transition-all group relative",
                              isDragging 
                                ? "border-[var(--color-thread-mid-green)] bg-[var(--color-thread-light-green)]/60" 
                                : "border-black/10 bg-[var(--color-thread-light-green)]/30 hover:border-[var(--color-thread-mid-green)] hover:bg-[var(--color-thread-light-green)]/50"
                            )}
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileSelect} 
                              className="hidden" 
                              multiple 
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                            />
                            <PageIcon variant="white" icon={<Upload className="w-[22px] h-[22px] stroke-[1.7]" />} className="mx-auto" />
                            <div className="text-[1rem] font-medium tracking-tight text-slate-900">
                              Drag and drop a file here, or click to upload manually
                            </div>
                            <div className="text-[0.82rem] text-slate-500 mt-2">
                              PDF, DOC, DOCX, XLS or PNG. Max size 25MB.
                            </div>
                          </div>
                        </div>

                        {/* List of uploaded files */}
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Uploaded files ({uploadedFiles.length})</span>
                            <div className="flex flex-col gap-2">
                              {uploadedFiles.map((file, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center justify-between p-3.5 bg-white border border-black/5 rounded-xl hover:shadow-xs transition-shadow"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[var(--color-thread-light-green)] text-[var(--color-thread-mid-green)] flex items-center justify-center">
                                      <FileText className="w-5 h-5 stroke-[1.7]" />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-sm font-medium text-slate-800 line-clamp-1">{file.name}</div>
                                      <div className="text-xs text-slate-400 font-mono">{file.size}</div>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(idx);
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                                    title="Remove file"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Unified In-Card navigation footer inside the card container */}
                {true && (
                  <div className="flex items-center justify-between pt-8 border-t border-black/5 mt-12 w-full">
                    <button 
                      onClick={handleBack} 
                      className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-5">
                      {step === 5 && (
                        <button 
                          onClick={handleNext} 
                          className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          Skip for now
                        </button>
                      )}
                      <Button onClick={handleNext} variant="forest" className="px-6 shadow-none">
                        {step === 5 ? 'Finish setup' : 'Continue'} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
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
                    <span className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-4 block">Setup complete</span>
                    <h1 className="font-serif font-normal text-3xl md:text-4xl leading-[1.15] tracking-tight mb-4 text-[var(--color-thread-heading)]">You're all set.</h1>
                    <p className="text-slate-500 text-[1.05rem] leading-relaxed max-w-[42ch]">{formData.firstName || 'Your child'}'s space is ready and your session is booked. Here's what we have, and what happens next.</p>
                  </div>
                  
                  <div className="bg-[var(--color-thread-off-white)] p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-thread-heading)] flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400 mb-0.5">Your child</div>
                        <div className="font-medium text-slate-900">{formData.firstName || 'Child'} · {formData.dob ? 'Added' : '9 years old'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t border-black/5 pt-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-thread-heading)] flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400 mb-0.5">Session booked</div>
                        <div className="font-medium text-slate-900">{formData.sessionDay ? `Thu ${formData.sessionDay} Jun, ${formData.sessionTime || '4:00 pm'}` : 'Thu 26 Jun, 4:00 pm'} · Dr. Naomi Clark</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-black/5 pt-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-500">
                          <span className="text-xs font-bold">!</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400 mb-0.5">Questionnaire</div>
                          <div className="font-medium text-slate-900">
                            {remainingQuestionnaireSections === 0
                              ? 'All sections complete'
                              : `${remainingQuestionnaireSections} of ${Object.keys(QUESTIONS).length} sections left`}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setStep(4)}
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/70 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Finish <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 w-full">
                  <Button onClick={onComplete} variant="forest" className="px-8 shadow-none w-full sm:w-auto">
                    Go to your family home <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Next steps timeline & setup another child */}
              <div className="w-full md:w-2/5 bg-transparent p-8 sm:p-10 border-t md:border-t-0 md:border-l border-black/5 flex flex-col justify-start space-y-8 overflow-y-auto">
                <div>
                  <span className="text-[0.75rem] font-bold tracking-[0.1em] uppercase text-[var(--color-thread-mid-green)] mb-6 block">What happens next</span>
                  <div className="relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black/5">
                    <TimelineStep
                      title="Before your session"
                      meta="Questionnaire"
                      metaTag="Step 1"
                      description="Finish the questionnaire so Dr. Clark has the full picture."
                      active
                    />
                    <TimelineStep
                      title={`Your session — ${formData.sessionDay ? `Thu ${formData.sessionDay} Jun` : 'Thu 26 Jun'}`}
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

                <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-none">
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">Setting up another child?</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">Each child has their own session, assessment and documents.</p>
                  <Button variant="muted" className="w-full text-xs py-2" onClick={() => {
                    setFormData({
                      firstName: '', dob: '', relation: 'Parent', notices: [], notes: '', sessionDay: '', sessionTime: ''
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
