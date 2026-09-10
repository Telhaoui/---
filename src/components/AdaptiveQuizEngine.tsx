import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Sparkles, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  Volume2, 
  FileText, 
  Printer, 
  Share2, 
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { QuizQuestion, Language } from '../types';
import { ADAPTIVE_QUIZ_QUESTIONS } from '../data/adaptiveQuestions';
import { TRANSLATIONS } from '../data/translations';
import confetti from 'canvas-confetti';

interface AdaptiveQuizEngineProps {
  language: Language;
  studentName?: string;
}

export const AdaptiveQuizEngine: React.FC<AdaptiveQuizEngineProps> = ({
  language,
  studentName = 'الطالب القرآني المتفوق'
}) => {
  const t = TRANSLATIONS[language];

  // Quiz state
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [learnerName, setLearnerName] = useState(studentName);
  const [adaptiveStreaks, setAdaptiveStreaks] = useState(0);

  // Filter questions by level
  const questionsList = ADAPTIVE_QUIZ_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);
  const currentQuestion = questionsList[currentQuestionIdx] || questionsList[0] || ADAPTIVE_QUIZ_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setAnsweredCount(prev => prev + 1);

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setAdaptiveStreaks(prev => prev + 1);
    } else {
      setAdaptiveStreaks(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < questionsList.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (score + (selectedOption === currentQuestion.correctAnswerIndex ? 1 : 0) >= Math.ceil(questionsList.length * 0.7)) {
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore in environments without canvas
        }
      }
    }
  };

  const handleRestartQuiz = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnsweredCount(0);
    setQuizCompleted(false);
  };

  const scorePercentage = Math.round((score / (questionsList.length || 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <BrainCircuit className="w-4 h-4" />
            <span>نظام التقييم والاختبارات التكيفي الذكي</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif">
            منظومة الاختبارات القرآنية وتجويد رواية ورش
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            اختبارات تفاعلية تتكيف مع مستوى الطالب، تغطي استكمال الآيات، وضبط المتشابهات، وأحكام التجويد والرواية مع شروحات تعليمية فورية.
          </p>
        </div>
        <div className="absolute end-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <BookOpen className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Difficulty Level Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-slate-700 block mb-2">اختر المستوى الدراسي المناسب:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'easy' as const,
              title: 'مبتدئ: قصار السور والتجويد الأساسي',
              desc: 'أحكام النون الساكنة والتنوين والميم والقلقلة',
              badge: 'المستوى 1',
              color: 'border-emerald-500 bg-emerald-50/60 text-emerald-900'
            },
            {
              id: 'medium' as const,
              title: 'متوسط: المدود ورواية ورش والأجزاء (1-15)',
              desc: 'تطبيقات مد البدل، اللامات، وإبدال الهمز',
              badge: 'المستوى 2',
              color: 'border-blue-500 bg-blue-50/60 text-blue-900'
            },
            {
              id: 'hard' as const,
              title: 'متقدم: المتشابهات ودقائق التحريرات',
              desc: 'ضبط الفروق بين الآيات، تحريرات الأزرق، والإجازة',
              badge: 'المستوى 3',
              color: 'border-purple-500 bg-purple-50/60 text-purple-900'
            }
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => handleRestartQuiz(lvl.id)}
              className={`p-4 rounded-xl border-2 text-start transition cursor-pointer ${
                selectedDifficulty === lvl.id
                  ? `${lvl.color} shadow-sm ring-2 ring-emerald-500/20`
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  {lvl.badge}
                </span>
                {selectedDifficulty === lvl.id && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{lvl.title}</h4>
              <p className="text-[11px] text-slate-700">{lvl.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {!quizCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          {/* Progress Bar & Question Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="font-bold text-emerald-800">
                السؤال {currentQuestionIdx + 1} من {questionsList.length}
              </span>
              <span className="font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                النقاط الحالية: {score} / {currentQuestionIdx + (isAnswerSubmitted ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIdx + (isAnswerSubmitted ? 1 : 0)) / questionsList.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {currentQuestion.type === 'complete_verse' ? 'إكمال آية كريمة' :
                 currentQuestion.type === 'tajweed_rule' ? 'حكم تجويدي' :
                 currentQuestion.type === 'mutashabihat' ? 'متشابهات قرآنية' : 'رواية ورش عن نافع'}
              </span>
              {currentQuestion.surahReference && (
                <span className="text-xs text-slate-700 font-serif">
                  📖 {currentQuestion.surahReference}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50';

              if (isAnswerSubmitted) {
                if (idx === currentQuestion.correctAnswerIndex) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  optionStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                } else {
                  optionStyle = 'border-slate-200 opacity-50';
                }
              } else if (isSelected) {
                optionStyle = 'border-emerald-600 bg-emerald-50/70 font-semibold ring-2 ring-emerald-500/20';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-start flex items-center justify-between transition cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-900 font-serif leading-relaxed">
                      {option}
                    </span>
                  </div>

                  {isAnswerSubmitted && idx === currentQuestion.correctAnswerIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && idx !== currentQuestion.correctAnswerIndex && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Box */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl border animate-in fade-in space-y-1.5 ${
              selectedOption === currentQuestion.correctAnswerIndex
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-amber-50/90 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>
                  {selectedOption === currentQuestion.correctAnswerIndex
                    ? 'إجابة صحيحة وموفقة!'
                    : 'توضيح الحكم والإجابة الصحيحة:'}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-700">
              {isAnswerSubmitted ? 'اضغط للمتابعة إلى السؤال التالي' : 'اختر الإجابة ثم اضغط تأكيد'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleCheckAnswer}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>{currentQuestionIdx + 1 === questionsList.length ? 'عرض النتيجة والشهادة' : 'السؤال التالي'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ COMPLETED / CERTIFICATE VIEW */
        <div className="space-y-6 animate-in zoom-in-95">
          {/* Certificate Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400/60 shadow-2xl relative overflow-hidden text-center space-y-6 bg-[radial-gradient(#f8fafc_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-700 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                شهادة تميز في الاختبار القرآني الإلكتروني
              </h3>
              <p className="text-xs text-slate-700">
                منارة الجزائر للقرآن الكريم والعلوم الشرعية
              </p>
            </div>

            <div className="max-w-md mx-auto py-4 border-y-2 border-amber-200 space-y-2">
              <p className="text-xs text-slate-700">تُمنح هذه الشهادة التقديرية إلى:</p>
              <input
                type="text"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                className="w-full text-center text-lg sm:text-xl font-bold text-emerald-800 border-b border-dashed border-emerald-400 focus:outline-hidden bg-transparent"
                title="اضغط لتعديل اسمك على الشهادة"
              />
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                لاختباره بنجاح في المستوى <strong className="text-slate-900">{selectedDifficulty === 'easy' ? 'المبتدئ' : selectedDifficulty === 'medium' ? 'المتوسط' : 'المتقدم'}</strong> محققاً نتيجة إتقان بلغت:
              </p>
              <div className="text-3xl font-black text-emerald-700 font-sans">
                {scorePercentage}%
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700 pt-2 px-6">
              <div>
                <span>التاريخ: </span>
                <strong className="text-slate-800">{new Date().toLocaleDateString('ar-DZ')}</strong>
              </div>
              <div>
                <span>الرقم المرجعي: </span>
                <strong className="text-slate-800 font-sans">DZ-QRN-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </div>
            </div>

            {/* Actions for Certificate */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 no-print">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة أو حفظ الشهادة (PDF)</span>
              </button>

              <button
                onClick={() => handleRestartQuiz(selectedDifficulty)}
                className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-900 transition cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة الاختبار أو تغيير المستوى</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
