import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Award, 
  Phone, 
  Send, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  Heart,
  MessageSquare
} from 'lucide-react';
import { StudentRecord, Language, UserRole, AuthUser } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface StudentParentPortalProps {
  students: StudentRecord[];
  currentRole: UserRole;
  language: Language;
  onOpenQuiz: () => void;
  authUser?: AuthUser | null;
}

export const StudentParentPortal: React.FC<StudentParentPortalProps> = ({
  students = [],
  currentRole,
  language,
  onOpenQuiz,
  authUser
}) => {
  const t = TRANSLATIONS[language];

  // Active student selection
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (authUser?.role === 'student') {
      const match = students.find(s => s.studentCode === authUser.studentCode || s.name === authUser.name);
      if (match) return match.id;
    }
    return students[0]?.id || '';
  });
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0] || {
    id: 'default-std',
    name: 'طالب قرآني',
    studentCode: 'QRN-2026-001',
    institutionId: 'inst-01',
    teacherName: 'الشيخ المشرف',
    parentName: 'ولي الأمر',
    parentPhone: '0550000000',
    totalJuzMemorized: 15,
    currentHifzTarget: 'سورة الكهف',
    dailyRevision: 'حزب واحد يومياً',
    tajweedLevel: 'متقدم',
    attendanceRate: 98,
    lastExamScore: 95,
    lastEvaluationDate: new Date().toISOString().split('T')[0],
    notes: 'مواظب ومتميز في أحكام التجويد ورواية ورش',
    quizzesTaken: 5,
    averageQuizScore: 92
  };

  // Revision Stopwatch Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [messageToTeacher, setMessageToTeacher] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageToTeacher.trim()) return;
    setMessageSent(true);
    setMessageToTeacher('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  const hifzPercentage = Math.round(((activeStudent?.totalJuzMemorized || 0) / 60) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Header Profile Switcher */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-bold font-serif text-2xl flex items-center justify-center shadow-lg shrink-0">
            {activeStudent?.name?.charAt(0) || 'ق'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                {currentRole === 'parent' ? 'لوحة متابعة ولي الأمر' : 'فضاء الطالب القرآني'}
              </span>
              <span className="text-xs text-emerald-200">رقم القيد: {activeStudent?.studentCode}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              {activeStudent?.name}
            </h2>
            <p className="text-xs text-slate-300">
              المقرئ المشرف: <strong className="text-white">{activeStudent?.teacherName}</strong>
            </p>
          </div>
        </div>

        {/* Student Selector Dropdown */}
        <div className="w-full md:w-72 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <label className="text-[11px] text-emerald-200 block mb-1 font-medium">
            {currentRole === 'parent' ? 'اختر الابن/الابنة للمتابعة:' : 'حساب الطالب القرآني:'}
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full bg-slate-900/90 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.totalJuzMemorized} حزباً)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Overview: Hifz Progress, Daily Target, Revision Timer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Hifz Progress (الأحزاب المحفوظة) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>معدل حفظ القرآن الكريم</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {hifzPercentage}% من المصحف
            </span>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl font-extrabold text-slate-900 font-sans">
              {activeStudent?.totalJuzMemorized} <span className="text-sm font-normal text-slate-700">/ 60 حزباً</span>
            </div>
            <span className="text-xs text-slate-700 block mt-1">
              مستوى التجويد: <strong className="text-amber-600 font-semibold">{activeStudent?.tajweedLevel}</strong>
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${hifzPercentage}%` }}
            />
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenQuiz}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>خوض الاختبار القرآني الإلكتروني</span>
            </button>
          </div>
        </div>

        {/* Card 2: Daily Target & Revision (الورد والمراجعة) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>الورد اليومي والمراجعة المقررة</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">الورد الجديد للحفظ:</span>
              <strong className="text-slate-900 text-xs sm:text-sm font-serif">{activeStudent?.currentHifzTarget}</strong>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-900 block mb-0.5">المراجعة والتثبيت اليومي:</span>
              <strong className="text-slate-900 text-xs sm:text-sm font-serif">{activeStudent?.dailyRevision}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-700">نسبة الالتزام بالحضور:</span>
            <span className="font-bold text-emerald-700">{activeStudent?.attendanceRate}%</span>
          </div>
        </div>

        {/* Card 3: Interactive Revision Stopwatch (مؤقت ورد التلاوة) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-center">
          <h3 className="font-bold text-slate-900 text-sm flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>مؤقت جلسة التلاوة والمراجعة</span>
          </h3>

          <div className="py-2">
            <div className="text-4xl font-mono font-bold text-slate-800 tracking-wider">
              {formatTimer(timerSeconds)}
            </div>
            <span className="text-[11px] text-slate-700 block mt-1">
              {isTimerRunning ? 'جلسة المراجعة نشطة الآن...' : 'اضغط لبدء احتساب وقت وردك'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'إيقاف مؤقت' : 'بدء الورد'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="إعادة تعيين المؤقت"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Notes & Direct Message Channel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teacher Notes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>ملاحظات المقرئ والتوجيهات التربوية</span>
          </h3>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-2">
            <p className="font-serif text-sm">
              "{activeStudent?.notes}"
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-700 pt-2 border-t border-slate-200">
              <span>تاريخ التقييم الأخير: {activeStudent?.lastEvaluationDate}</span>
              <span className="font-bold text-emerald-800">العلامة: {activeStudent?.lastExamScore}%</span>
            </div>
          </div>
        </div>

        {/* Direct Message to Teacher */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>التواصل المباشر مع الشيخ / المقرئ المشرف</span>
          </h3>

          {messageSent && (
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>تم إرسال رسالتك إلى الشيخ المشرف وسيصلك رده فوراً.</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-2 text-xs">
            <textarea
              rows={3}
              required
              value={messageToTeacher}
              onChange={(e) => setMessageToTeacher(e.target.value)}
              placeholder="اكتب استفسارك، عذراً للتغيب، أو طلباً لتحديد موعد تسميع إضافي..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال الرسالة للشيخ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
