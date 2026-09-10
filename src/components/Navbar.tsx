import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Bell, 
  Heart, 
  Wifi, 
  WifiOff, 
  Globe, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown,
  X,
  Satellite
} from 'lucide-react';
import { Language, UserRole, UserProfile, SmartNotification, AuthUser } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { LogOut, Lock, User } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'satellite' | 'events' | 'quiz' | 'admin' | 'student' | 'analytics';
  setActiveTab: (tab: 'explore' | 'satellite' | 'events' | 'quiz' | 'admin' | 'student' | 'analytics') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  favoritesCount: number;
  setShowFavoritesOnly: (val: boolean) => void;
  showFavoritesOnly: boolean;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  notifications: SmartNotification[];
  markNotificationAsRead: (id: string) => void;
  authUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  currentRole,
  setCurrentRole,
  favoritesCount,
  setShowFavoritesOnly,
  showFavoritesOnly,
  isOffline,
  setIsOffline,
  notifications,
  markNotificationAsRead,
  authUser,
  onLogout
}) => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const t = TRANSLATIONS[language];
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string; desc: string }> = {
    ministry_executive: { label: 'إطار وزاري ومفتشية', icon: ShieldCheck, color: 'text-amber-900 bg-amber-50 border-amber-300', desc: 'تحكم كامل واطلاع شامل على كافة مدارس ومساجد الوطن' },
    institution_admin: { label: 'مسؤول مدرسة / مسجد', icon: Building2, color: 'text-emerald-800 bg-emerald-50 border-emerald-300', desc: 'إدارة مستقلة وخاصة بالصرح القرآني دون خلط' },
    admin: { label: t.role_admin, icon: ShieldCheck, color: 'text-rose-600 bg-rose-50 border-rose-200', desc: 'صلاحيات كاملة للمنصة وتحديث البيانات' },
    principal: { label: t.role_principal, icon: Building2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'إدارة المدرسة، المعلمين، والبرامج' },
    teacher: { label: t.role_teacher, icon: GraduationCap, color: 'text-blue-700 bg-blue-50 border-blue-200', desc: 'متابعة أوراد الطلاب، الحلقات والاختبارات' },
    student: { label: t.role_student, icon: BookOpen, color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'عرض الورد اليومي، المراجعة، والاختبارات التكيفية' },
    parent: { label: t.role_parent, icon: UserCheck, color: 'text-indigo-700 bg-indigo-50 border-indigo-200', desc: 'متابعة تقدم الأبناء والتواصل مع المدرسين' },
    visitor: { label: t.role_visitor, icon: MapPin, color: 'text-slate-700 bg-slate-100 border-slate-200', desc: 'استكشاف المدارس والخرائط وتقييم المراكز' }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-900/10 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>الجمهورية الجزائرية الديمقراطية الشعبية - وزارة الشؤون الدينية والأوقاف (بوابة المدارس القرآنية)</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Offline Toggle Pill */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition cursor-pointer ${
              isOffline 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200'
            }`}
            title="تبديل وضع عدم الاتصال لتجربة الخرائط والبيانات المخزنة محلياً"
          >
            {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{isOffline ? 'وضع عدم الاتصال (Offline)' : 'متصل بالشبكة'}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 hover:text-white transition px-2 py-0.5 rounded-md hover:bg-emerald-800 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase font-semibold">
                {language === 'ar' ? 'العربية' : language === 'fr' ? 'Français' : language === 'en' ? 'English' : 'ⵜⴰⵎⴰⵣⵉⵖⵜ'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showLangDropdown && (
              <div className="absolute top-full end-0 mt-1 w-36 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95">
                {[
                  { code: 'ar' as Language, label: 'العربية (AR)' },
                  { code: 'fr' as Language, label: 'Français (FR)' },
                  { code: 'en' as Language, label: 'English (EN)' },
                  { code: 'ber' as Language, label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ (BER)' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-start px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between cursor-pointer ${
                      language === l.code ? 'font-bold text-emerald-800 bg-emerald-50/50' : ''
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User badge & Logout */}
          {authUser && (
            <div className="flex items-center gap-2 ps-2 border-s border-emerald-800">
              <span className="text-[11px] font-bold text-amber-300 hidden md:inline truncate max-w-[200px]">
                {authUser.role === 'ministry_executive' ? '🏛️ ' : authUser.role === 'institution_admin' ? '🔒 ' : '🎓 '}
                {authUser.name}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 bg-rose-600/90 hover:bg-rose-700 text-white px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer shadow-xs"
                  title="تسجيل الخروج والعودة لشاشة الدخول"
                >
                  <LogOut className="w-3 h-3" />
                  <span>خروج</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Title */}
          <div 
            onClick={() => { setActiveTab('explore'); setShowFavoritesOnly(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition">
              <Building2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-serif">
                  {t.app_title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  الجزائر 58
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden sm:block">
                {t.app_subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {/* Dedicated Fullscreen Satellite Tab */}
            <button
              onClick={() => { setActiveTab('satellite'); setShowFavoritesOnly(false); }}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'satellite' && !showFavoritesOnly
                  ? 'bg-linear-to-r from-emerald-800 to-teal-900 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                  : 'text-slate-800 hover:text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Satellite className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>الساتيليت الفضائي</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full">
                GIS
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('explore'); setShowFavoritesOnly(false); }}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'explore' && !showFavoritesOnly
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t.view_map}</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.events_calendar}</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{t.adaptive_quiz}</span>
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.student_portal}</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.admin_portal}</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t.view_analytics}</span>
            </button>
          </nav>

          {/* Action Buttons: Favorites, Notifications, Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Favorites Toggle */}
            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                if (!showFavoritesOnly) setActiveTab('explore');
              }}
              className={`relative p-2 rounded-lg transition border cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'text-slate-700 hover:text-rose-600 hover:bg-rose-50 border-slate-200'
              }`}
              title="عرض الأماكن المفضلة المحفوظة"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Smart Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="relative p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition border border-slate-200 cursor-pointer"
                title="مركز التنبيهات والفعاليات"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -end-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotificationsDropdown && (
                <div className="absolute top-full end-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span>{t.notifications}</span>
                    </span>
                    <span className="text-[11px] text-slate-700">
                      {unreadNotificationsCount} غير مقروء
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-700">
                        لا توجد إشعارات جديدة حالياً
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 ${
                            !notif.read ? 'bg-emerald-50/60 border-e-4 border-e-emerald-600' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{notif.title}</span>
                            <span className="text-[10px] text-slate-700">{notif.timestamp}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setShowRoleModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition cursor-pointer ${roleLabels[currentRole].color}`}
            >
              {React.createElement(roleLabels[currentRole].icon, { className: 'w-4 h-4' })}
              <span className="hidden sm:inline">{roleLabels[currentRole].label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {[
            { key: 'satellite', label: 'الساتيليت الفضائي', icon: Satellite },
            { key: 'explore', label: t.view_map, icon: MapPin },
            { key: 'events', label: t.events_calendar, icon: Calendar },
            { key: 'quiz', label: t.adaptive_quiz, icon: BookOpen },
            { key: 'student', label: t.student_portal, icon: GraduationCap },
            { key: 'admin', label: t.admin_portal, icon: ShieldCheck },
            { key: 'analytics', label: t.view_analytics, icon: BarChart3 }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key as any);
                setShowFavoritesOnly(false);
              }}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 shrink-0 ${
                activeTab === item.key
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-slate-700 bg-slate-100 hover:bg-emerald-50'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">تبديل صلاحيات الحساب (Multi-Role)</h3>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 mb-4">
              اختر الدور المطلوب لتجربة كامل واجهات وصلاحيات المنصة المخصصة لكل فئة:
            </p>

            <div className="space-y-2">
              {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                const item = roleLabels[r];
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setShowRoleModal(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-start flex items-center justify-between transition cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs' 
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        {React.createElement(item.icon, { className: 'w-5 h-5' })}
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">{item.label}</span>
                        <span className="text-[11px] text-slate-700">{item.desc}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
