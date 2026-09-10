import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  Search, 
  Award, 
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { QuranicEvent, Language } from '../types';
import { INITIAL_EVENTS } from '../data/studentsData';
import { TRANSLATIONS } from '../data/translations';
import { exportToIcs, getGoogleCalendarUrl } from '../utils/geoAndCalendar';

interface EventsCalendarProps {
  language: Language;
}

export const EventsCalendar: React.FC<EventsCalendarProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [events, setEvents] = useState<QuranicEvent[]>(INITIAL_EVENTS);
  const [searchEvent, setSearchEvent] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const filteredEvents = events.filter((evt) => {
    if (categoryFilter !== 'all' && evt.category !== categoryFilter) return false;
    if (searchEvent.trim()) {
      const q = searchEvent.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.wilaya.toLowerCase().includes(q) ||
        evt.institutionName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleRegister = (id: string) => {
    if (registeredEvents.includes(id)) {
      setRegisteredEvents(registeredEvents.filter(e => e !== id));
    } else {
      setRegisteredEvents([...registeredEvents, id]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <CalendarCheck className="w-4 h-4" />
            <span>الأجندة القرآنية الوطنية والفعاليات الدينية</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif">
            {t.events_calendar}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            مواعيد المسابقات الوطنية، مجالس السماع والإجازة بالسند، الملتقيات العلمية، وحفلات التكريم مع إمكانية المزامنة المباشرة مع تقويم Google وتنزيل ملفات .ics.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
          <input
            type="text"
            value={searchEvent}
            onChange={(e) => setSearchEvent(e.target.value)}
            placeholder="ابحث بالفعالية، المؤسسة، أو الولاية..."
            className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'جميع الفعاليات' },
            { id: 'competition', label: '🏆 مسابقات قرآنية' },
            { id: 'khatma', label: '📖 ختمات وإجازات' },
            { id: 'seminar', label: '🕌 ملتقيات ومجالس' },
            { id: 'course', label: '🎯 دورات ومخيمات' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-700">لا توجد فعاليات مطابقة لخيارات البحث المحددة.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isRegistered = registeredEvents.includes(evt.id);

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                      📅
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 block">
                        {evt.institutionName}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg font-serif">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
                      📍 ولاية {evt.wilaya}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {evt.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>التاريخ: <strong className="text-slate-900 font-sans">{evt.startDate} {evt.endDate ? `إلى ${evt.endDate}` : ''}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>التوقيت: <strong className="text-slate-900">{evt.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>المقر: <strong className="text-slate-900">{evt.locationDetails}</strong></span>
                  </div>
                </div>

                {/* Event Actions: Google Sync, .ics Download, Registration */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRegister(evt.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        isRegistered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isRegistered ? 'تم التسجيل في الفعالية' : 'تأكيد الحضور / التسجيل'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Google Calendar Link */}
                    <a
                      href={getGoogleCalendarUrl(evt)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      title={t.google_cal}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.google_cal}</span>
                    </a>

                    {/* .ICS Export */}
                    <button
                      onClick={() => exportToIcs(evt)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      title={t.export_ics}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.export_ics}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
