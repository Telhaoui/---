export type Language = 'ar' | 'fr' | 'en' | 'ber';

export type InstitutionType = 'quranic_school' | 'mosque' | 'zawiya' | 'institute' | 'dar_quran';

export type MapTileLayer = 'satellite' | 'hybrid' | 'osm' | 'topo' | 'dark' | 'street' | 'topographic';

export interface RecognitionScanResult {
  visibleInstitutions: Institution[];
  totalFound: number;
  verifiedCount: number;
  historicalCount: number;
  mosquesCount: number;
  quranicSchoolsCount: number;
  closestToCenter?: Institution;
  scanRadiusKm: number;
}

export type UserRole = 'admin' | 'ministry_executive' | 'institution_admin' | 'principal' | 'teacher' | 'student' | 'parent' | 'visitor';

export type AuthRole = 'ministry_executive' | 'institution_admin' | 'teacher' | 'student' | 'parent';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AuthRole;
  // Ministry executive specific fields
  ministryDepartment?: string;
  officialTitle?: string;
  badgeNumber?: string;
  inspectionZone?: string;
  // Institution / Mosque specific fields
  institutionId?: string;
  institutionName?: string;
  institutionType?: InstitutionType;
  wilayaCode?: string;
  wilayaNameAr?: string;
  commune?: string;
  registrationNumber?: string;
  avatar?: string;
  phone?: string;
}

export interface Wilaya {
  code: string;
  nameAr: string;
  nameFr: string;
  nameBer?: string;
  lat: number;
  lng: number;
  region: 'North' | 'High_Plateaus' | 'South' | 'East' | 'West' | 'Center';
}

export interface Review {
  id: string;
  authorName: string;
  userRole: UserRole;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedVisitor?: boolean;
}

export interface Facility {
  nameAr: string;
  nameFr: string;
  iconName: string;
}

export interface StudyScheduleItem {
  dayAr: string;
  dayFr: string;
  timeSlot: string;
  targetGroup: string; // e.g. 'أطفال (تحضيري)', 'ناشئة وحفظة', 'كبار السن ومحو أمية', 'طالبات ونساء'
  teacher: string;
  subject: string; // e.g. 'حفظ الورد الجديد', 'مراجعة وتثبيت', 'أحكام التجويد برواية ورش', 'المتون العلمية'
}

export interface QuranicEvent {
  id: string;
  institutionId: string;
  institutionName: string;
  title: string;
  description: string;
  category: 'competition' | 'khatma' | 'seminar' | 'course' | 'friday_lecture';
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  time: string;
  wilaya: string;
  locationDetails: string;
  isFree: boolean;
  registrationOpen: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  wilayaCode: string;
  wilayaNameAr: string;
  commune: string;
  address: string;
  lat: number;
  lng: number;
  foundedYear: number;
  historicalBio: string;
  imamOrSheikh: string;
  studentCount: number;
  teachersCount: number;
  capacity: number;
  phone: string;
  email: string;
  services: string[]; // e.g., 'تحفيظ القرآن برواية ورش', 'إجازات بالسند المتصل', 'إيواء داخلي للطلبة', 'روضة قرآنية'
  facilities: string[];
  photos: string[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  schedules: StudyScheduleItem[];
  verified: boolean;
  registrationNumber?: string; // الرقم الوطني للتسجيل والاعتماد
  registrationStatus?: 'registered_ministry' | 'historical_heritage' | 'certified_waqf';
  ministryLicenceNumber?: string;
  riwayaDefault?: string;
  quranicMethod?: string;
  hasBoarding: boolean; // إيواء داخلي
  hasWomenClasses: boolean;
  hasWeekendClasses: boolean;
  hasIjazaProgram: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  institutionId?: string;
  wilayaCode: string;
  avatar: string;
  enrolledSince?: string;
  memorizedJuzCount?: number;
  currentSurah?: string;
  childrenNames?: string[];
}

export interface StudentRecord {
  id: string;
  name: string;
  studentCode: string;
  institutionId: string;
  teacherName: string;
  parentName: string;
  parentPhone: string;
  totalJuzMemorized: number;
  currentHifzTarget: string;
  dailyRevision: string;
  tajweedLevel: 'مبتدئ' | 'متوسط' | 'متقدم' | 'إتقان وإجازة';
  attendanceRate: number; // 0 - 100
  lastExamScore: number; // 0 - 100
  lastEvaluationDate: string;
  notes: string;
  quizzesTaken: number;
  averageQuizScore: number;
}

export interface QuizQuestion {
  id: string;
  type: 'complete_verse' | 'tajweed_rule' | 'surah_order' | 'mutashabihat' | 'riwayah_warsh';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  surahReference?: string;
}

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'event' | 'schedule' | 'exam' | 'system' | 'message';
  read: boolean;
  targetRole?: UserRole | 'all';
  linkInstitutionId?: string;
}
