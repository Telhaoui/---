import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  Lock, 
  User, 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Globe, 
  ArrowRight,
  GraduationCap,
  MapPin,
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { AuthUser, AuthRole, Institution, Language } from '../types';
import { MOCK_AUTH_USERS } from '../data/mockUsers';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { INITIAL_INSTITUTIONS } from '../data/institutions';

interface MandatoryAuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  institutions?: Institution[];
  language?: Language;
  setLanguage?: (lang: Language) => void;
}

export const MandatoryAuthScreen: React.FC<MandatoryAuthScreenProps> = ({
  onLoginSuccess,
  institutions = INITIAL_INSTITUTIONS,
  language = 'ar',
  setLanguage
}) => {
  const safeInstitutions = institutions && institutions.length > 0 ? institutions : INITIAL_INSTITUTIONS;
  const [authCategory, setAuthCategory] = useState<'ministry' | 'institution' | 'academic'>('ministry');
  
  // Ministry Form State
  const [ministryEmail, setMinistryEmail] = useState('admin.inspection@marw.gov.dz');
  const [ministryPassword, setMinistryPassword] = useState('DZ-MARW-2026');
  const [ministryToken, setMinistryToken] = useState('INSP-001-AUTH');

  // Institution Form State
  const [selectedInstId, setSelectedInstId] = useState<string>(safeInstitutions[0]?.id || 'inst-01');
  const [instRegNumber, setInstRegNumber] = useState(safeInstitutions[0]?.registrationNumber || 'REG-DZ-16-2019-001');
  const [instPassword, setInstPassword] = useState('INST-QURAN-2026');

  // Academic Form State
  const [academicRole, setAcademicRole] = useState<'teacher' | 'student' | 'parent'>('teacher');
  const [academicEmail, setAcademicEmail] = useState('abdelkader@djamaa-eldjazair.dz');
  const [academicPassword, setAcademicPassword] = useState('PASS-QURAN');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When selected institution changes in dropdown, auto-update registration number
  const handleInstitutionChange = (id: string) => {
    setSelectedInstId(id);
    const inst = safeInstitutions.find(i => i.id === id);
    if (inst?.registrationNumber) {
      setInstRegNumber(inst.registrationNumber);
    }
  };

  // Handle Ministry Login Submit
  const handleMinistrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const foundUser = MOCK_AUTH_USERS.find(
        u => u.role === 'ministry_executive' && (u.email === ministryEmail || u.username === ministryEmail)
      ) || MOCK_AUTH_USERS[0];

      if (ministryPassword.length < 4) {
        setErrorMsg('يرجى إدخال كلمة المرور الرسمية للإطار الوزاري.');
        setIsSubmitting(false);
        return;
      }

      onLoginSuccess(foundUser);
      setIsSubmitting(false);
    }, 600);
  };

  // Handle Institution (School / Mosque) Login Submit
  const handleInstitutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const inst = safeInstitutions.find(i => i.id === selectedInstId) || safeInstitutions[0];
      const existingUser = MOCK_AUTH_USERS.find(
        u => u.role === 'institution_admin' && u.institutionId === selectedInstId
      );

      const user: AuthUser = existingUser || {
        id: `usr-${inst.id}`,
        username: `admin_${inst.id}`,
        name: `${inst.imamOrSheikh || 'إدارة الصرح القرآني'}`,
        email: inst.email || `contact@${inst.id}.dz`,
        role: 'institution_admin',
        institutionId: inst.id,
        institutionName: inst.name,
        institutionType: inst.type,
        wilayaCode: inst.wilayaCode,
        wilayaNameAr: inst.wilayaNameAr,
        commune: inst.commune,
        registrationNumber: inst.registrationNumber || 'REG-DZ-2026',
        officialTitle: `مدير ومسير ${inst.name}`,
        phone: inst.phone
      };

      onLoginSuccess(user);
      setIsSubmitting(false);
    }, 600);
  };

  // Handle Academic Login Submit
  const handleAcademicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const found = MOCK_AUTH_USERS.find(
        u => u.role === academicRole
      ) || MOCK_AUTH_USERS.find(u => u.role === 'teacher') || MOCK_AUTH_USERS[0];

      onLoginSuccess(found);
      setIsSubmitting(false);
    }, 600);
  };

  // Quick Switcher helper
  const handleQuickLogin = (user: AuthUser) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(user);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden" dir="rtl">
      {/* Background Islamic Geometric Pattern Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Official State Header */}
      <header className="relative z-10 border-b border-emerald-800/40 bg-slate-950/60 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30 text-slate-950 font-bold border border-amber-300/40">
              <span className="text-xl">🇩🇿</span>
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
                <span className="text-amber-400 text-xs hidden md:inline">•</span>
                <span className="text-emerald-300 text-xs hidden md:inline">وزارة الشؤون الدينية والأوقاف</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                المنظومة الوطنية الرقمية لإدارة ومتابعة المدارس القرآنية والزوايا والمساجد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 px-3 py-1 rounded-full font-medium hidden sm:flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>بوابة الدخول الموحد المشفرة</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/80 overflow-hidden">
          
          {/* Card Header & Emblems */}
          <div className="p-6 sm:p-7 border-b border-emerald-900/60 bg-linear-to-b from-emerald-900/40 to-transparent text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800/60 border border-emerald-400/40 text-amber-400 shadow-inner mb-1">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              تسجيل الدخول الإلزامي المعتمد
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md mx-auto">
              يرجى تحديد صفة الحساب لمطابقة الصلاحيات الرسمية وتطبيق بروتوكول الفصل الأمني للبيانات
            </p>

            {/* Account Category Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-emerald-800/40 mt-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthCategory('ministry');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  authCategory === 'ministry'
                    ? 'bg-linear-to-r from-amber-600 to-amber-700 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-200" />
                <span>إطارات وزارية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthCategory('institution');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  authCategory === 'institution'
                    ? 'bg-linear-to-r from-emerald-600 to-teal-700 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-300" />
                <span>مدرسة أو مسجد</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthCategory('academic');
                  setErrorMsg('');
                }}
                className={`py-2.5 px-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  authCategory === 'academic'
                    ? 'bg-linear-to-r from-blue-600 to-indigo-700 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-300" />
                <span>أساتذة وطلبة</span>
              </button>
            </div>
          </div>

          {/* Form Body based on chosen Tab */}
          <div className="p-6 sm:p-7 space-y-5">
            {errorMsg && (
              <div className="bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: MINISTRY EXECUTIVES (Full Control) */}
            {authCategory === 'ministry' && (
              <form onSubmit={handleMinistrySubmit} className="space-y-4">
                <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300 font-bold mb-0.5">صلاحيات سيادية كاملة (تحكم شامل)</strong>
                    <span>تمنح الإطارات الوزارية والمفتشين الولائيين حق الاطلاع والإدارة الكاملة لجميع المدارس، الزوايا، المساجد، الإحصائيات، والأنشطة عبر التراب الوطني.</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">البريد الإلكتروني الوزاري أو الرمز الوظيفي</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={ministryEmail}
                      onChange={(e) => setMinistryEmail(e.target.value)}
                      placeholder="admin.inspection@marw.gov.dz"
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 ps-10 pe-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">كلمة المرور الرسمية</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={ministryPassword}
                      onChange={(e) => setMinistryPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 ps-10 pe-10 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">رمز المصادقة الثنائية / بطاقة التفتيش</label>
                  <input
                    type="text"
                    value={ministryToken}
                    onChange={(e) => setMinistryToken(e.target.value)}
                    placeholder="INSP-001-AUTH"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-linear-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري التحقق من الاعتماد الوزاري...' : 'تسجيل الدخول كإطار وزاري (تحكم كامل)'}</span>
                </button>

                {/* Fast One-Click Demo Profiles for Ministry */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">حسابات وزارية سريعة للاختبار المباشر:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MOCK_AUTH_USERS.filter(u => u.role === 'ministry_executive').map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className="bg-slate-950/60 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 p-2 rounded-xl text-start transition cursor-pointer flex items-center gap-2 text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                          🏛️
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-200 truncate">{u.name}</div>
                          <div className="text-[10px] text-amber-400/80 truncate">{u.officialTitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: INSTITUTION / MOSQUE (Strict Isolation, No Mixing) */}
            {authCategory === 'institution' && (
              <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-2xl text-xs text-emerald-200 flex items-start gap-2.5">
                  <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300 font-bold mb-0.5">نطاق خاص ومعزول بالصرح القرآني (بدون خلط)</strong>
                    <span>يقتصر الدخول حصراً على القسم الخاص بالمدرسة أو المسجد المختار؛ لإدارة طلبته، حلقاته، أساتذته، دون الوصول إلى بيانات المؤسسات الأخرى.</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">اختر المدرسة القرآنية أو المسجد المسجل</label>
                  <div className="relative">
                    <select
                      value={selectedInstId}
                      onChange={(e) => handleInstitutionChange(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-100 transition cursor-pointer"
                    >
                      {safeInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.id} className="bg-slate-900 text-slate-100 py-1">
                          {inst.name} ({inst.wilayaNameAr}) - {inst.registrationNumber || 'معتمد'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">رقم القيد والاعتماد الوطني</label>
                    <input
                      type="text"
                      readOnly
                      value={instRegNumber}
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-emerald-400 font-mono transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">رمز المرور المؤسساتي</label>
                    <input
                      type="password"
                      required
                      value={instPassword}
                      onChange={(e) => setInstPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'جاري عزل وتأمين النطاق...' : 'دخول إلى بوابة المدرسة / المسجد (نطاق معزول)'}</span>
                </button>

                {/* Fast One-Click Demo Profiles for Schools/Mosques */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">نماذج صروح قرآنية مسجلة للاختبار الفوري:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MOCK_AUTH_USERS.filter(u => u.role === 'institution_admin').slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className="bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 p-2 rounded-xl text-start transition cursor-pointer flex items-center gap-2 text-xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.institutionType === 'zawiya' ? '📿' : u.institutionType === 'mosque' ? '🕌' : '📖'}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-200 truncate">{u.institutionName}</div>
                          <div className="text-[10px] text-emerald-400 truncate">{u.wilayaNameAr} • {u.registrationNumber}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* TAB 3: TEACHERS, STUDENTS & PARENTS */}
            {authCategory === 'academic' && (
              <form onSubmit={handleAcademicSubmit} className="space-y-4">
                <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-2xl text-xs text-blue-200 flex items-start gap-2.5">
                  <GraduationCap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-blue-300 font-bold mb-0.5">فضاء التعليم القرآني والتسميع الذكي</strong>
                    <span>متابعة الورد اليومي برواية ورش، الحلقات، التقييمات التراكمية، والاختبارات القرآنية التكيفية.</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">الصفة الأكاديمية</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'teacher' as const, label: 'أستاذ مقرئ', icon: GraduationCap },
                      { id: 'student' as const, label: 'طالب حافظ', icon: BookOpen },
                      { id: 'parent' as const, label: 'ولي أمر', icon: User }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAcademicRole(item.id)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          academicRole === item.id
                            ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">البريد الإلكتروني أو رقم القيد الطلابي</label>
                  <input
                    type="text"
                    required
                    value={academicEmail}
                    onChange={(e) => setAcademicEmail(e.target.value)}
                    placeholder="student@quran.dz"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-950/80 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري تسجيل الدخول...' : 'الدخول إلى فضاء الطالب والحلقات'}</span>
                </button>

                {/* Quick Academic Demo Buttons */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">حسابات سريعة للتجربة:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {MOCK_AUTH_USERS.filter(u => u.role === 'teacher' || u.role === 'student' || u.role === 'parent').map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className="bg-slate-950/60 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/50 p-2 rounded-xl text-start transition cursor-pointer text-xs"
                      >
                        <div className="font-bold text-slate-200 truncate">{u.name}</div>
                        <div className="text-[10px] text-blue-400 truncate">
                          {u.role === 'teacher' ? 'مقرئ' : u.role === 'student' ? 'طالب خاتم' : 'ولي أمر'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Card Footer Notes */}
          <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>نظام تسجيل دخول مشفر يخضع للمرسوم التنفيذي لوزارة الشؤون الدينية والأوقاف</span>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="relative z-10 border-t border-emerald-900/40 bg-slate-950/80 backdrop-blur-md px-4 py-3 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>الجمهورية الجزائرية الديمقراطية الشعبية © 2026 • كافة الحقوق محفوظة لوزارة الشؤون الدينية والأوقاف</span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>المرجعية الدينية الوطنية</span>
            <span>•</span>
            <span>رواية ورش عن نافع</span>
            <span>•</span>
            <span>بوابة المدارس والمساجد 58 ولاية</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
