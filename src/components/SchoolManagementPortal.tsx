import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Bell, 
  Send, 
  FileText, 
  TrendingUp, 
  Award, 
  Clock, 
  Save, 
  Phone, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  Lock,
  Globe2,
  Filter,
  CheckCheck,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Institution, StudentRecord, UserRole, Language, SmartNotification, AuthUser } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { INITIAL_INSTITUTIONS } from '../data/institutions';

interface SchoolManagementPortalProps {
  institutions?: Institution[];
  students?: StudentRecord[];
  onUpdateInstitution: (updated: Institution) => void;
  onAddInstitution: (newInst: Institution) => void;
  onUpdateStudent: (updated: StudentRecord) => void;
  onAddStudent: (newStudent: StudentRecord) => void;
  onSendNotification: (notif: SmartNotification) => void;
  currentRole: UserRole;
  language: Language;
  authUser?: AuthUser | null;
}

export const SchoolManagementPortal: React.FC<SchoolManagementPortalProps> = ({
  institutions = INITIAL_INSTITUTIONS,
  students = [],
  onUpdateInstitution,
  onAddInstitution,
  onUpdateStudent,
  onAddStudent,
  onSendNotification,
  currentRole,
  language,
  authUser
}) => {
  const safeInstitutions = institutions && institutions.length > 0 ? institutions : INITIAL_INSTITUTIONS;
  const t = TRANSLATIONS[language];
  const isMinistryExecutive = authUser?.role === 'ministry_executive' || currentRole === 'admin';
  const isInstitutionAdmin = authUser?.role === 'institution_admin';

  // If user is a school/mosque admin, lock strictly to their assigned institution ID
  const lockedInstitutionId = isInstitutionAdmin && authUser?.institutionId ? authUser.institutionId : null;

  // Active School Selection (Locked if institution admin)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(() => {
    if (lockedInstitutionId) return lockedInstitutionId;
    return safeInstitutions[0]?.id || '';
  });

  // Keep synced if locked institution changes
  useEffect(() => {
    if (lockedInstitutionId) {
      setSelectedSchoolId(lockedInstitutionId);
    }
  }, [lockedInstitutionId]);

  const currentSchool = safeInstitutions.find(i => i.id === selectedSchoolId) || safeInstitutions[0];

  // Active sub-tab in management portal
  const [activeTab, setActiveTab] = useState<'students' | 'school_profile' | 'broadcast' | 'reports' | 'ministry_audit'>('students');

  // Search & Filters for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedWilayaFilter, setSelectedWilayaFilter] = useState<string>('all');
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Broadcast Message State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastRole, setBroadcastRole] = useState<UserRole | 'all'>('all');
  const [broadcastTargetScope, setBroadcastTargetScope] = useState<'school_only' | 'national_all'>('school_only');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Filter students strictly according to authorization
  // If school admin: STRICTLY filtered to this school
  // If ministry: Can view by current selected school or national view
  const schoolStudents = students.filter(s => {
    const matchesSchool = s.institutionId === selectedSchoolId;
    const matchesSearch = !studentSearch.trim() || 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
      s.studentCode.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesSchool && matchesSearch;
  });

  // Filtered institutions for ministry switcher
  const filteredInstitutions = institutions.filter(i => {
    if (selectedWilayaFilter === 'all') return true;
    return i.wilayaCode === selectedWilayaFilter;
  });

  // Handle Save Student Evaluation
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  // Handle Send Notification Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    const notif: SmartNotification = {
      id: `notif-${Date.now()}`,
      title: isMinistryExecutive && broadcastTargetScope === 'national_all' 
        ? `[تعميم وزاري مركزي] ${broadcastTitle.trim()}`
        : `[${currentSchool?.name || 'إدارة الصرح'}] ${broadcastTitle.trim()}`,
      message: broadcastMessage.trim(),
      timestamp: 'الآن',
      type: 'message',
      read: false,
      targetRole: broadcastRole,
      linkInstitutionId: broadcastTargetScope === 'national_all' ? undefined : selectedSchoolId
    };

    onSendNotification(notif);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      
      {/* SECURITY & ISOLATION BANNER */}
      {isInstitutionAdmin && (
        <div className="bg-linear-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-5 border border-emerald-500/40 shadow-lg shadow-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  🔒 نطاق مشفر ومعزول حصرياً (حساب مدرسة / مسجد)
                </span>
                <span className="text-xs text-amber-300 font-mono font-bold">
                  {authUser?.registrationNumber || currentSchool?.registrationNumber || 'معتمد رسمياً'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                بوابة الإدارة الخاصة بـ: {currentSchool?.name}
              </h2>
              <p className="text-xs text-emerald-200/90">
                ولاية {currentSchool?.wilayaNameAr} • بلدية {currentSchool?.commune} • تم قفل الوصول للبيانات الخاصة بهذا الصرح فقط لمنع أي خلط.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/50 px-3.5 py-2 rounded-2xl text-xs text-emerald-200">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>حساب مسيّر معتمد من وزارة الشؤون الدينية</span>
          </div>
        </div>
      )}

      {/* MINISTRY EXECUTIVE OVERVIEW BANNER */}
      {isMinistryExecutive && (
        <div className="bg-linear-to-r from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl p-5 border border-amber-500/40 shadow-xl shadow-amber-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black">
                  🏛️ ديوان الوزارة • تحكم وإشراف وطني شامل
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {authUser?.name || 'إطار مركزي معتمد'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
                لوحة الرقابة والمتابعة الشاملة لجميع المدارس والمساجد والزوايا (58 ولاية)
              </h2>
              <p className="text-xs text-slate-300">
                {authUser?.officialTitle || 'المفتشية العامة للتعليم القرآني وتسيير المساجد'} • صلاحيات سيادية كاملة للتفتيش والاعتماد وإصدار التعاميم.
              </p>
            </div>
          </div>

          {/* Ministry Fast Metrics */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-amber-500/30 p-2.5 rounded-2xl text-xs text-amber-200">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <span>{institutions.length} صرح مسجل</span>
            <span className="text-slate-600">|</span>
            <span>{students.length} طالب مدخل</span>
          </div>
        </div>
      )}

      {/* Top Header with School Switcher (Visible and searchable for Ministry, Locked for School) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {isMinistryExecutive ? 'المعاينة والإدارة الوزارية' : 'لوحة القيادة والمتابعة اليومية'}
              </span>
              <span className="text-xs text-slate-700 font-medium">
                {currentSchool?.type === 'mosque' ? 'مسجد وجامع' : currentSchool?.type === 'zawiya' ? 'زاوية عريقة' : 'مدرسة قرآنية'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {currentSchool?.name || 'إدارة الصرح القرآني'}
            </h2>
          </div>
        </div>

        {/* Institution Switcher: Only interactive for Ministry Executives */}
        <div className="w-full md:w-96 space-y-1.5">
          {isMinistryExecutive ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>تصفح واختيار المؤسسة (تحكم وطني):</span>
                <span className="text-amber-700 font-mono text-[10px]">متاح للوزارة</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={selectedWilayaFilter}
                  onChange={(e) => setSelectedWilayaFilter(e.target.value)}
                  className="col-span-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">كل الولايات</option>
                  <option value="16">16 - الجزائر</option>
                  <option value="31">31 - وهران</option>
                  <option value="25">25 - قسنطينة</option>
                  <option value="47">47 - غرداية</option>
                  <option value="05">05 - باتنة</option>
                  <option value="15">15 - تيزي وزو</option>
                </select>

                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer truncate"
                >
                  {filteredInstitutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.wilayaNameAr})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-700 flex items-center justify-between">
              <div className="truncate">
                <span className="text-[10px] text-slate-700 block font-semibold">الصرح المرتبط بالحساب:</span>
                <strong className="text-slate-900 truncate block">{currentSchool?.name}</strong>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                🔒 معزول ومقيد
              </span>
            </div>
          )}
        </div>
      </div>

      {/* School Matrix Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-semibold">طلبة هذا الصرح</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{currentSchool?.studentCount || schoolStudents.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">سجلات معتمدة ومقيدة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-semibold">هيئة المقرئين</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{currentSchool?.teachersCount || 0}</div>
          <span className="text-[11px] text-blue-700 font-medium">مقرئون مجازون بالسند</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-semibold">نسبة النجاح والالتزام</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">96.4%</div>
          <span className="text-[11px] text-amber-700 font-medium">معدل الحضور اليومي</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-semibold">رقم القيد والاعتماد</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 font-mono truncate">
            {currentSchool?.registrationNumber || 'REG-DZ-2026'}
          </div>
          <span className="text-[10px] text-purple-700 font-medium">وزارة الشؤون الدينية</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm overflow-x-auto no-scrollbar">
        {[
          { id: 'students', label: `سجل الطلبة والأوراد (${schoolStudents.length})`, icon: Users },
          { id: 'school_profile', label: 'تحديث بيانات الصرح والبرامج', icon: Building2 },
          { id: 'broadcast', label: isMinistryExecutive ? 'التعميم والبلاغات الوزارية' : 'مركز الإشعارات والرسائل الذكية', icon: Bell },
          { id: 'reports', label: 'التقارير الدورية والإحصاءات', icon: FileText },
          ...(isMinistryExecutive ? [{ id: 'ministry_audit', label: 'التفتيش والمطابقة الوزارية', icon: ShieldCheck }] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: STUDENTS & HIFZ RECORD (STRICTLY ISOLATED TO THIS INSTITUTION) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="ابحث بالاسم أو رقم القيد القرآني..."
                className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={() => {
                const newCode = `QRN-2026-${Math.floor(100 + Math.random() * 900)}`;
                const newSt: StudentRecord = {
                  id: `std-${Date.now()}`,
                  name: 'طالب قرآني جديد',
                  studentCode: newCode,
                  institutionId: selectedSchoolId,
                  teacherName: currentSchool?.imamOrSheikh || 'الشيخ المشرف',
                  parentName: 'ولي الأمر',
                  parentPhone: '0550000000',
                  totalJuzMemorized: 1,
                  currentHifzTarget: 'سورة الملك',
                  dailyRevision: 'حزب واحد',
                  tajweedLevel: 'مبتدئ',
                  attendanceRate: 100,
                  lastExamScore: 90,
                  lastEvaluationDate: new Date().toISOString().split('T')[0],
                  notes: `تسجيل جديد في حلقات ${currentSchool?.name}`,
                  quizzesTaken: 0,
                  averageQuizScore: 0
                };
                onAddStudent(newSt);
              }}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل طالب في هذا الصرح</span>
            </button>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            {schoolStudents.length === 0 ? (
              <div className="text-center py-12 text-slate-700 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">لا يوجد طلبة مسجلون حالياً بهذا الاسم في {currentSchool?.name}.</p>
              </div>
            ) : (
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-start">الطالب ورقم القيد</th>
                    <th className="py-3 px-3 text-start">المقرئ المؤطر</th>
                    <th className="py-3 px-3 text-start">الأجزاء المحفوظة</th>
                    <th className="py-3 px-3 text-start">الورد الحالي</th>
                    <th className="py-3 px-3 text-start">برنامج المراجعة</th>
                    <th className="py-3 px-3 text-start">مستوى التجويد</th>
                    <th className="py-3 px-3 text-start">آخر تقييم</th>
                    <th className="py-3 px-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schoolStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block text-xs sm:text-sm">{std.name}</strong>
                        <span className="text-[10px] text-slate-700 font-mono">{std.studentCode}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{std.teacherName}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {std.totalJuzMemorized} / 60 حزباً
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{std.currentHifzTarget}</td>
                      <td className="py-3 px-3 text-slate-600">{std.dailyRevision}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                          {std.tajweedLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">{std.lastExamScore}%</span>
                        <span className="text-[10px] text-slate-700 block">{std.lastEvaluationDate}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setEditingStudent(std)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs transition cursor-pointer"
                        >
                          تحديث الورد والتقييم
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">تحديث تقييم وورد الطالب: {editingStudent.name}</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-700 hover:text-slate-600 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الأجزاء المحفوظة (من 60):</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={editingStudent.totalJuzMemorized}
                    onChange={(e) => setEditingStudent({ ...editingStudent, totalJuzMemorized: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">علامة آخر اختبار (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingStudent.lastExamScore}
                    onChange={(e) => setEditingStudent({ ...editingStudent, lastExamScore: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الورد المستهدف للحفظ الجديد:</label>
                <input
                  type="text"
                  value={editingStudent.currentHifzTarget}
                  onChange={(e) => setEditingStudent({ ...editingStudent, currentHifzTarget: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">برنامج المراجعة اليومي:</label>
                <input
                  type="text"
                  value={editingStudent.dailyRevision}
                  onChange={(e) => setEditingStudent({ ...editingStudent, dailyRevision: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات المقرئ وتوجيهات ولي الأمر:</label>
                <textarea
                  rows={3}
                  value={editingStudent.notes}
                  onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  حفظ التحديثات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SCHOOL PROFILE UPDATE */}
      {activeTab === 'school_profile' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">تحديث البيانات الأساسية للصرح والخدمات</h3>
              <p className="text-xs text-slate-700">تتيح هذه الصفحة لمسؤولي الصرح تحديث بيانات التواصل، أوقات الحلقات، والبرامج المعتمدة.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
              {currentSchool.registrationNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">اسم المؤسسة أو الصرح:</label>
              <input
                type="text"
                value={currentSchool.name}
                onChange={(e) => onUpdateInstitution({ ...currentSchool, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">المشرف / الإمام الراتب:</label>
              <input
                type="text"
                value={currentSchool.imamOrSheikh}
                onChange={(e) => onUpdateInstitution({ ...currentSchool, imamOrSheikh: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">رقم الهاتف للتواصل:</label>
              <input
                type="text"
                value={currentSchool.phone}
                onChange={(e) => onUpdateInstitution({ ...currentSchool, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني الرسمي:</label>
              <input
                type="email"
                value={currentSchool.email}
                onChange={(e) => onUpdateInstitution({ ...currentSchool, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 text-xs block mb-1">التاريخ والنبذة التعريفية:</label>
            <textarea
              rows={4}
              value={currentSchool.historicalBio}
              onChange={(e) => onUpdateInstitution({ ...currentSchool, historicalBio: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => alert('تم حفظ وتحديث بيانات الصرح القرآني بنجاح!')}
              className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-xs hover:bg-emerald-900 transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات في السجل الوطني</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BROADCAST NOTIFICATIONS */}
      {activeTab === 'broadcast' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <span>
              {isMinistryExecutive ? 'مركز التعميم الوزاري والبلاغات الوطنية' : 'مركز الإشعارات والتوجيهات الداخلية'}
            </span>
          </h3>
          <p className="text-xs text-slate-700">
            {isMinistryExecutive 
              ? 'إرسال تعميمات وزارية رسمية لجميع المدارس والمساجد والزوايا عبر التراب الوطني أو ولايات محددة.'
              : 'أرسل تنبيهات فورية مخصصة للطلبة وأولياء الأمور بمواعيد الاختبارات، الختمات، أو التوجيهات.'}
          </p>

          {broadcastSent && (
            <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>تم إرسال الإشعار اللحظي إلى الفئة المستهدفة بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            {isMinistryExecutive && (
              <div>
                <label className="font-bold text-amber-900 block mb-1">نطاق البث الوزاري:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBroadcastTargetScope('national_all')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      broadcastTargetScope === 'national_all'
                        ? 'bg-amber-600 border-amber-500 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Globe2 className="w-4 h-4" />
                    <span>تعميم وطني لجميع المدارس والمساجد (58 ولاية)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBroadcastTargetScope('school_only')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      broadcastTargetScope === 'school_only'
                        ? 'bg-emerald-800 border-emerald-700 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>تنبيه خاص بالصرح المحدد: {currentSchool.name}</span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">الفئة المستهدفة بالإشعار:</label>
              <select
                value={broadcastRole}
                onChange={(e) => setBroadcastRole(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer font-medium"
              >
                <option value="all">الجميع (أولياء أمور + طلبة + معلمين ومسيرين)</option>
                <option value="parent">أولياء الأمور فقط</option>
                <option value="student">الطلبة والحفظة فقط</option>
                <option value="teacher">هيئة التدريس والمقرئين فقط</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">عنوان الإشعار:</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="مثال: موعد تصفيات المسابقة القرآنية وتثبيت المحفوظ"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">نص الرسالة والتفاصيل:</label>
              <textarea
                required
                rows={4}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="اكتب التوجيهات أو الموعد المراد إعلام الجميع به..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التنبيه اللحظي الآن</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 4: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">التقارير الدورية والإحصاءات التعليمية</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="font-bold text-xs text-emerald-900">تقرير تقدم الحفظ الربعي لعام 2026</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                ملخص شامل لمعدلات حفظ الأحزاب، نسب الالتزام بالأوراد، وملاحظات المشايخ لجميع أفواج {currentSchool.name}.
              </p>
              <button 
                onClick={() => window.print()}
                className="text-xs font-bold text-emerald-800 underline block pt-1 cursor-pointer"
              >
                طباعة / تصدير التقرير PDF
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <span className="font-bold text-xs text-blue-900">سجل نتائج الاختبارات التكيفية الإلكترونية</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                تحليل إحصائي لأداء الطلبة في أحكام التجويد ورواية ورش والمتشابهات وتحديد نقاط التحسين.
              </p>
              <button 
                onClick={() => window.print()}
                className="text-xs font-bold text-blue-800 underline block pt-1 cursor-pointer"
              >
                طباعة / تصدير التقرير PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: MINISTRY AUDIT (ONLY FOR MINISTRY EXECUTIVES) */}
      {activeTab === 'ministry_audit' && isMinistryExecutive && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">سجل التفتيش والمطابقة الوزارية الميدانية</h3>
                <p className="text-xs text-slate-600">فحص التراخيص والروايات القرآنية المعتمدة والتجهيزات الداخلية لـ {currentSchool.name}.</p>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full">
              محضر تفتيش رسمي
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-700 block font-semibold">حالة الاعتماد في السجل الوطني:</span>
              <strong className="text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>معتمد ومسجل بوزارة الشؤون الدينية</span>
              </strong>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-700 block font-semibold">الرواية القرآنية الأساسية:</span>
              <strong className="text-slate-900 font-bold block mt-1">
                {currentSchool.riwayaDefault || 'رواية ورش عن نافع من طريق الأزرق'}
              </strong>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-700 block font-semibold">نظام الإيواء الداخلي:</span>
              <strong className="text-slate-900 font-bold block mt-1">
                {currentSchool.hasBoarding ? 'متوفر (إيواء داخلي للطلبة)' : 'نظام خارجي فقط'}
              </strong>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <strong className="font-bold block">ملاحظات المفتشية المركزية:</strong>
            <p className="leading-relaxed">
              المؤسسة مطابقة للمعايير الوطنية للتعليم القرآني الأصيل، المناهج التعليمية تلتزم برواية ورش وضبط المصحف الشريف. يُوصى بتوسيع برامج الإجازة بالسند العالي.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
