import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
  Phone, 
  Mail, 
  Star, 
  Heart, 
  Navigation, 
  Share2, 
  CheckCircle2, 
  BookOpen, 
  Building2, 
  Award, 
  Home, 
  Download, 
  Send,
  MessageSquare,
  Sparkles,
  Info,
  CalendarCheck
} from 'lucide-react';
import { Institution, Language, Review, UserRole } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { exportToIcs, getDirectionsUrl, getGoogleCalendarUrl } from '../utils/geoAndCalendar';

interface InstitutionDetailModalProps {
  institution: Institution | null;
  onClose: () => void;
  language: Language;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  currentUserRole: UserRole;
  onAddReview: (institutionId: string, review: Review) => void;
}

export const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({
  institution,
  onClose,
  language,
  favorites,
  toggleFavorite,
  currentUserRole,
  onAddReview
}) => {
  if (!institution) return null;

  const t = TRANSLATIONS[language];
  const isFav = favorites.includes(institution.id);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedules' | 'history' | 'reviews'>('overview');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName.trim() || !newComment.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      authorName: newAuthorName.trim(),
      userRole: currentUserRole,
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedVisitor: true
    };

    onAddReview(institution.id, review);
    setNewComment('');
    setNewAuthorName('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const handleExportScheduleIcs = () => {
    exportToIcs({
      title: `برنامج التحفيظ والمراجعة - ${institution.name}`,
      description: `جدول حلقات القرآن الكريم والورد والمراجعة بمقر ${institution.name}\nالمشرف: ${institution.imamOrSheikh}\nالهاتف: ${institution.phone}`,
      location: institution.address,
      startDate: new Date().toISOString().split('T')[0],
      time: '08:00'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Modal Top Header Banner with Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={institution.photos?.[activePhotoIdx] || institution.photos?.[0] || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=1200'}
            alt={institution.name}
            className="w-full h-full object-cover opacity-80 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 end-4 flex items-center gap-2 z-10">
            <button
              onClick={() => toggleFavorite(institution.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                isFav
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/30 hover:bg-white/50 text-white'
              }`}
              title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Badge & Title */}
          <div className="absolute bottom-4 start-4 end-4 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                institution.type === 'zawiya' ? 'bg-amber-500 text-slate-950' :
                institution.type === 'mosque' ? 'bg-emerald-500 text-white' :
                institution.type === 'dar_quran' ? 'bg-blue-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {institution.type === 'zawiya' ? 'زاوية تاريخية' :
                 institution.type === 'mosque' ? 'مسجد جامع' :
                 institution.type === 'dar_quran' ? 'دار القرآن النموذجية' : 'مدرسة قرآنية'}
              </span>

              {institution.verified && (
                <span className="text-xs font-medium bg-white/20 backdrop-blur-md text-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>معتمدة من وزارة الشؤون الدينية</span>
                </span>
              )}

              <span className="text-xs text-amber-300 font-bold flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{institution.rating} ({institution.reviewsCount} تقييم)</span>
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold font-serif leading-tight text-white drop-shadow-md">
              {institution.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{institution.address}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Inside Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 bg-slate-50 text-xs sm:text-sm overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2">
            {[
              { id: 'overview', label: 'نظرة عامة والخدمات', icon: Sparkles },
              { id: 'schedules', label: 'أوقات التدريس والمراجعة', icon: Clock },
              { id: 'history', label: 'التاريخ والأعلام', icon: BookOpen },
              { id: 'reviews', label: `التقييمات (${institution.reviews.length})`, icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-slate-700 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 py-2">
            <a
              href={getDirectionsUrl(institution.lat, institution.lng)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.direction_route}</span>
            </a>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Info Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <Calendar className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">{t.founded_in}</span>
                  <span className="font-bold text-sm text-slate-800">{institution.foundedYear} م</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <Users className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">{t.students_count}</span>
                  <span className="font-bold text-sm text-slate-800">{institution.studentCount} طالب</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <GraduationCap className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">{t.teachers_count}</span>
                  <span className="font-bold text-sm text-slate-800">{institution.teachersCount} مقرئ</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <Building2 className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-700 block">الطاقة الاستيعابية</span>
                  <span className="font-bold text-sm text-slate-800">{institution.capacity} مصلٍ</span>
                </div>
              </div>

              {/* Sheikh / Imam Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-amber-50/50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold font-serif shrink-0">
                  شيخ
                </div>
                <div>
                  <span className="text-xs text-slate-700 font-medium block">المشرف العام / الإمام الراتب</span>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{institution.imamOrSheikh}</h4>
                </div>
              </div>

              {/* Official Registration & Accreditation Certificate Box */}
              <div className="bg-white p-4 rounded-2xl border border-emerald-300/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">شهادة القيد والاعتماد في السجل الوطني للمساجد والمدارس</h4>
                      <p className="text-[10px] text-slate-500">وزارة الشؤون الدينية والأوقاف - الجمهورية الجزائرية الديمقراطية الشعبية</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    {institution.registrationStatus === 'historical_heritage' ? 'تراث إسلامي وتاريخي' : 'معتمد رسمياً'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">رقم القيد الوطني</span>
                    <strong className="text-slate-900 font-mono">{institution.registrationNumber || 'REG-DZ-2024'}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">رقم الرخصة والاعتماد</span>
                    <strong className="text-slate-900 font-mono">{institution.ministryLicenceNumber || 'LIC-MIN-REL'}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">الإحداثيات الجغرافية (GPS)</span>
                    <strong className="text-slate-900 font-mono text-[11px]">{institution.lat.toFixed(4)}°, {institution.lng.toFixed(4)}°</strong>
                  </div>
                </div>

                {(institution.riwayaDefault || institution.quranicMethod) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                    {institution.riwayaDefault && (
                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 text-emerald-900">
                        <span className="text-[10px] text-emerald-700 font-medium block">الرواية القرآنية الأصيلة المعتمدة:</span>
                        <strong className="font-bold">{institution.riwayaDefault}</strong>
                      </div>
                    )}
                    {institution.quranicMethod && (
                      <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                        <span className="text-[10px] text-amber-700 font-medium block">المنهجية وطريقة التدريس:</span>
                        <strong className="font-bold">{institution.quranicMethod}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Services & Programs */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>{t.services_offered}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {institution.services.map((service, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-800">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>المرافق والتجهيزات المتوفرة</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {institution.facilities.map((fac, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium">
                      🏛️ {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo Gallery Thumbnails */}
              {(institution.photos?.length || 0) > 1 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-900 text-xs block">معرض صور الصرح والمرافق</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {institution.photos?.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="مرفق"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`h-20 w-full object-cover rounded-xl border-2 transition cursor-pointer ${
                          activePhotoIdx === idx ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>الهاتف: <strong className="text-slate-900 font-sans" dir="ltr">{institution.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>البريد: <strong className="text-slate-900 font-sans">{institution.email}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULES */}
          {activeTab === 'schedules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{t.schedules_title}</h3>
                  <p className="text-xs text-slate-700">مواعيد حلقات التحفيظ، السلكة، أوراد المراجعة، ومجالس الإقراء</p>
                </div>
                <button
                  onClick={handleExportScheduleIcs}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="تحميل جدول الحلقات إلى هاتفك أو تقويمك"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير للتقويم (.ics)</span>
                </button>
              </div>

              <div className="space-y-3">
                {institution.schedules.map((sch, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        🗓️ {sch.dayAr}
                      </span>
                      <span className="text-xs font-bold text-slate-700 font-sans bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-700" />
                        <span>{sch.timeSlot}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-slate-700 text-[11px] block">الفئة المستهدفة:</span>
                        <strong className="text-slate-800">{sch.targetGroup}</strong>
                      </div>
                      <div>
                        <span className="text-slate-700 text-[11px] block">المقرئ / الأستاذ المشرف:</span>
                        <strong className="text-slate-800">{sch.teacher}</strong>
                      </div>
                    </div>

                    <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900">المحتوى التعليمي: </span>
                      {sch.subject}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY & BIOGRAPHY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs sm:text-sm leading-relaxed text-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span>تاريخ الصرح ودوره في ترسيخ المرجعية الدينية الجزائرية</span>
                </div>
                <p className="leading-loose font-serif text-justify text-slate-800">
                  {institution.historicalBio}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">آراء الزوار والطلبة الحافظين</h3>
                {institution.reviews.length === 0 ? (
                  <p className="text-xs text-slate-700 p-4 text-center bg-slate-50 rounded-xl">
                    لا توجد مراجعات حتى الآن. كن أول من يضيف تقييماً لهذا الصرح القرآني المبارك!
                  </p>
                ) : (
                  institution.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {rev.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">{rev.authorName}</span>
                            <span className="text-[10px] text-slate-700">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Review Form */}
              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-emerald-700" />
                  <span>{t.add_review}</span>
                </h4>

                {reviewSubmitted && (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>تم تسجيل تقييمك بنجاح وسيبقى شاهداً على جودة الصرح القرآني!</span>
                  </div>
                )}

                {/* Rating Stars Input */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    {t.rate_experience}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ms-2">{newRating} من 5 نجوم</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">اسمك الكامل:</label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="مثال: عبد الرحيم الجزائري"
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">تعليقك وتجربتك:</label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t.write_comment}
                    className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  {t.submit_review}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
