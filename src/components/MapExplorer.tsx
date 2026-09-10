import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  Building2, 
  BookOpen, 
  Phone, 
  Heart, 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Compass, 
  Users, 
  GraduationCap, 
  Home, 
  Award,
  Layers,
  Satellite,
  Download,
  Check,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';
import { Institution, Language, Wilaya } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';
import { TRANSLATIONS } from '../data/translations';
import { calculateDistanceKm, getDirectionsUrl } from '../utils/geoAndCalendar';

interface MapExplorerProps {
  institutions: Institution[];
  language: Language;
  selectedInstitution: Institution | null;
  onSelectInstitution: (inst: Institution) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
  isOffline: boolean;
  onSwitchToSatelliteTab?: () => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  institutions,
  language,
  selectedInstitution,
  onSelectInstitution,
  favorites,
  toggleFavorite,
  showFavoritesOnly,
  isOffline,
  onSwitchToSatelliteTab
}) => {
  const t = TRANSLATIONS[language];

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filterBoarding, setFilterBoarding] = useState(false);
  const [filterWomen, setFilterWomen] = useState(false);
  const [filterIjaza, setFilterIjaza] = useState(false);

  // User Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [cachedForOffline, setCachedForOffline] = useState(false);

  // GPS User Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('خاصية تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError('تعذر تحديد موقعك الحالي. يرجى تفعيل إذن الموقع في المتصفح.');
        console.warn('Geolocation error:', err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Offline Caching
  const handleCacheOffline = () => {
    localStorage.setItem('manarat_cached_institutions', JSON.stringify(institutions));
    localStorage.setItem('manarat_cache_timestamp', new Date().toISOString());
    setCachedForOffline(true);
    setTimeout(() => setCachedForOffline(false), 3500);
  };

  // Filter and Calculate Distances
  const filteredInstitutions = useMemo(() => {
    return institutions
      .map((inst) => {
        if (userLocation) {
          const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, inst.lat, inst.lng);
          return { ...inst, distance: parseFloat(dist.toFixed(1)) };
        }
        return inst;
      })
      .filter((inst) => {
        // Search query filter
        const matchSearch =
          !searchQuery.trim() ||
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.commune.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.wilayaNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.wilayaNameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inst.imamOrSheikh && inst.imamOrSheikh.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (inst.registrationNumber && inst.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()));

        // Wilaya filter
        const matchWilaya =
          selectedWilaya === 'all' ||
          inst.wilayaCode === selectedWilaya ||
          inst.wilayaCode.padStart(2, '0') === selectedWilaya.padStart(2, '0');

        // Type filter
        const matchType = selectedType === 'all' || inst.type === selectedType;

        // Facility filters
        const matchBoarding = !filterBoarding || inst.hasBoarding;
        const matchWomen = !filterWomen || inst.hasWomenSection;
        const matchIjaza = !filterIjaza || inst.offersIjaza;

        // Favorites only filter
        const matchFav = !showFavoritesOnly || favorites.includes(inst.id);

        return matchSearch && matchWilaya && matchType && matchBoarding && matchWomen && matchIjaza && matchFav;
      })
      .sort((a, b) => {
        // Sort by distance if available, otherwise by rating
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [
    institutions,
    searchQuery,
    selectedWilaya,
    selectedType,
    filterBoarding,
    filterWomen,
    filterIjaza,
    showFavoritesOnly,
    favorites,
    userLocation
  ]);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-50 flex flex-col">
      {/* Top Search & Filter Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto p-4 sm:p-5 space-y-3.5">
          {/* Row 1: Search, Wilaya Selector, Actions */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، البلدية، اسم الشيخ المقرئ، أو رقم الاعتماد الوزاري..."
                className="w-full ps-10 pe-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 58-Wilaya Select Dropdown */}
            <div className="w-full lg:w-64 shrink-0">
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="all">📍 جميع الولايات الـ 58</option>
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {w.nameAr} ({w.nameFr})
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Nearest Location */}
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer disabled:opacity-50 shrink-0 shadow-2xs"
              title="تحديد موقعي والعثور على أقرب المدارس القرآنية"
            >
              <Navigation className={`w-4 h-4 text-emerald-700 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جاري التحديد...' : 'أقرب مؤسسة إليّ'}</span>
            </button>

            {/* Switch to Satellite Tab Button */}
            {onSwitchToSatelliteTab && (
              <button
                onClick={onSwitchToSatelliteTab}
                className="w-full sm:w-auto px-4 py-2.5 bg-linear-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-amber-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 border border-amber-400/40 shadow-md cursor-pointer shrink-0"
              >
                <Satellite className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>الساتيليت الفضائي</span>
              </button>
            )}

            {/* Offline Cache Button */}
            <button
              onClick={handleCacheOffline}
              className={`p-2.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                cachedForOffline
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="حفظ بيانات المدارس للعمل دون إنترنت"
            >
              {cachedForOffline ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
              <span className="hidden xl:inline">{cachedForOffline ? 'محفوظ محلياً' : 'حفظ أوفلاين'}</span>
            </button>
          </div>

          {/* Row 2: Category Filter Tabs & Feature Checkboxes */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
            {/* Category Type Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'جميع الصروح', icon: Layers },
                { id: 'quranic_school', label: 'المدارس القرآنية', icon: BookOpen },
                { id: 'zawiya', label: 'الزوايا العريقة', icon: Building2 },
                { id: 'mosque', label: 'المساجد الجامعة', icon: Home },
                { id: 'dar_quran', label: 'دور القرآن والمعاهد', icon: Award }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    selectedType === type.id
                      ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <type.icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* Feature Filters */}
            <div className="flex items-center gap-3.5 text-slate-700 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800 font-medium">
                <input
                  type="checkbox"
                  checked={filterBoarding}
                  onChange={(e) => setFilterBoarding(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>إيواء داخلي (طعام ومبيت)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800 font-medium">
                <input
                  type="checkbox"
                  checked={filterWomen}
                  onChange={(e) => setFilterWomen(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>حلقات نساء وبنات</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-800 font-medium">
                <input
                  type="checkbox"
                  checked={filterIjaza}
                  onChange={(e) => setFilterIjaza(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>إجازات وأسانيد متصلة</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Results Header Info */}
        <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm">
              تم العثور على <span className="text-emerald-800 font-bold">{filteredInstitutions.length}</span> مؤسسة وصرح قرآني مسجل
            </span>
            {selectedWilaya !== 'all' && (
              <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
                ولاية: {ALGERIA_WILAYAS.find(w => w.code === selectedWilaya)?.nameAr}
              </span>
            )}
            {showFavoritesOnly && (
              <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                المفضلة فقط ({favorites.length})
              </span>
            )}
          </div>

          <span className="text-slate-500 hidden sm:inline">
            اضغط على أي صرح لعرض ملفه التوثيقي الكامل أو إيجاد مسار الوصول
          </span>
        </div>

        {locationError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <Compass className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Empty State */}
        {filteredInstitutions.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs max-w-md mx-auto my-8">
            <Building2 className="w-14 h-14 mx-auto text-slate-300 mb-3" />
            <h4 className="font-bold text-slate-900 text-base mb-1">لا توجد نتائج مطابقة لخيارات البحث</h4>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              جرب تغيير الولاية المحددة أو إزالة بعض الفلاتر لعرض المدارس والمساجد المسجلة.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWilaya('all');
                setSelectedType('all');
                setFilterBoarding(false);
                setFilterWomen(false);
                setFilterIjaza(false);
              }}
              className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition cursor-pointer shadow-xs"
            >
              إعادة ضبط جميع خيارات البحث
            </button>
          </div>
        ) : (
          /* Cards Grid: 1 col on mobile, 2 col on tablet, 3 col on large desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredInstitutions.map((inst) => {
              const isFav = favorites.includes(inst.id);

              return (
                <div
                  key={inst.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Type Badge, Registration, Verified, Favorite */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          inst.type === 'zawiya' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          inst.type === 'mosque' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          inst.type === 'dar_quran' ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}>
                          {inst.type === 'zawiya' ? 'زاوية عريقة' :
                           inst.type === 'mosque' ? 'مسجد جامع' :
                           inst.type === 'dar_quran' ? 'دار القرآن' : 'مدرسة قرآنية'}
                        </span>

                        {inst.registrationNumber && (
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {inst.registrationNumber}
                          </span>
                        )}

                        {inst.verified && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>معتمدة</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleFavorite(inst.id)}
                        className={`p-2 rounded-xl transition cursor-pointer border ${
                          isFav
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                        }`}
                        title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Title & Sheikh */}
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition">
                        {inst.name}
                      </h3>
                      {inst.imamOrSheikh && (
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          إشراف: <span className="text-slate-800 font-semibold">{inst.imamOrSheikh}</span>
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{inst.wilayaNameAr} ({inst.wilayaCode}) • {inst.commune}</span>
                      {inst.distance !== undefined && (
                        <span className="ms-auto text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                          {inst.distance} كم
                        </span>
                      )}
                    </div>

                    {/* Riwaya Tag */}
                    {inst.riwayaDefault && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 rounded-lg px-2.5 py-1 font-medium">
                        📖 الرواية: <span className="font-bold">{inst.riwayaDefault}</span>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                      <div className="bg-slate-50 rounded-xl p-1.5">
                        <span className="text-[10px] text-slate-500 block">الطلبة</span>
                        <span className="font-bold text-slate-800">{inst.studentCount}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-1.5">
                        <span className="text-[10px] text-slate-500 block">المقرئين</span>
                        <span className="font-bold text-slate-800">{inst.teachersCount}</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-1.5">
                        <span className="text-[10px] text-slate-500 block">التقييم</span>
                        <span className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{inst.rating}</span>
                        </span>
                      </div>
                    </div>

                    {/* Facility Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {inst.services.slice(0, 3).map((srv, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {srv}
                        </span>
                      ))}
                      {inst.services.length > 3 && (
                        <span className="text-[10px] text-emerald-800 font-semibold">
                          +{inst.services.length - 3} المزيد
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={getDirectionsUrl(inst.lat, inst.lng, userLocation?.lat, userLocation?.lng)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 py-1.5 px-2 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>الاتجاه والمسار</span>
                    </a>

                    <button
                      onClick={() => onSelectInstitution(inst)}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>عرض الملف الكامل</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
