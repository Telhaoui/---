import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapExplorer } from './components/MapExplorer';
import { DedicatedSatelliteMap } from './components/DedicatedSatelliteMap';
import { InstitutionDetailModal } from './components/InstitutionDetailModal';
import { AdaptiveQuizEngine } from './components/AdaptiveQuizEngine';
import { SchoolManagementPortal } from './components/SchoolManagementPortal';
import { StudentParentPortal } from './components/StudentParentPortal';
import { EventsCalendar } from './components/EventsCalendar';
import { PlatformAnalytics } from './components/PlatformAnalytics';
import { LiveSupportWidget } from './components/LiveSupportWidget';
import { MandatoryAuthScreen } from './components/MandatoryAuthScreen';
import { 
  Institution, 
  Language, 
  UserRole, 
  Review, 
  StudentRecord, 
  SmartNotification,
  AuthUser 
} from './types';
import { INITIAL_INSTITUTIONS } from './data/institutions';
import { INITIAL_STUDENTS } from './data/studentsData';

export default function App() {
  // Mandatory Auth User State (persisted in localStorage)
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('manarat_auth_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load authenticated user', e);
    }
    return null;
  });

  // Navigation & State
  const [activeTab, setActiveTab] = useState<'explore' | 'satellite' | 'events' | 'quiz' | 'admin' | 'student' | 'analytics'>('explore');
  const [language, setLanguage] = useState<Language>('ar');
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');

  // Sync role whenever authenticatedUser changes
  useEffect(() => {
    if (authenticatedUser) {
      if (authenticatedUser.role === 'ministry_executive') {
        setCurrentRole('admin');
      } else if (authenticatedUser.role === 'institution_admin') {
        setCurrentRole('principal');
      } else if (authenticatedUser.role === 'teacher') {
        setCurrentRole('teacher');
      } else if (authenticatedUser.role === 'student') {
        setCurrentRole('student');
      } else if (authenticatedUser.role === 'parent') {
        setCurrentRole('parent');
      }
    }
  }, [authenticatedUser]);

  // Handle Login & Logout
  const handleLoginSuccess = (user: AuthUser) => {
    setAuthenticatedUser(user);
    try {
      localStorage.setItem('manarat_auth_user', JSON.stringify(user));
    } catch (e) {}

    // Smart initial tab based on role
    if (user.role === 'ministry_executive' || user.role === 'institution_admin') {
      setActiveTab('admin');
    } else if (user.role === 'student' || user.role === 'parent') {
      setActiveTab('student');
    } else {
      setActiveTab('explore');
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    try {
      localStorage.removeItem('manarat_auth_user');
    } catch (e) {}
  };

  // Institutions State with LocalStorage persistence
  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    try {
      const cached = localStorage.getItem('manarat_institutions');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to load from storage', e);
    }
    return INITIAL_INSTITUTIONS;
  });

  // Students Data State
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    try {
      const cached = localStorage.getItem('manarat_students');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to load students from storage', e);
    }
    return INITIAL_STUDENTS;
  });

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const favs = localStorage.getItem('manarat_favorites');
      if (favs) return JSON.parse(favs);
    } catch (e) {
      console.warn('Failed to load favorites', e);
    }
    return ['inst-01', 'inst-02'];
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Smart Notifications State
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: 'notif-1',
      title: 'انطلاق التسجيل في مسابقة تاج القرآن الوطنية',
      message: 'تم فتح باب الترشح لتصفيات المسابقة الوطنية لحفظ القرآن الكريم عبر كافة الولايات.',
      timestamp: 'منذ ساعتين',
      type: 'event',
      read: false
    },
    {
      id: 'notif-2',
      title: 'تحديث أوقات الورد الصباحي',
      message: 'تم تحديث جدول الحلقات الصباحية والمراجعة في الزاوية البلقايدية وجامع الجزائر.',
      timestamp: 'أمس',
      type: 'schedule',
      read: false
    }
  ]);

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('manarat_institutions', JSON.stringify(institutions));
    } catch (e) {}
  }, [institutions]);

  useEffect(() => {
    try {
      localStorage.setItem('manarat_students', JSON.stringify(students));
    } catch (e) {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('manarat_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Add new review to an institution
  const handleAddReview = (institutionId: string, review: Review) => {
    setInstitutions(prev => prev.map(inst => {
      if (inst.id === institutionId) {
        const updatedReviews = [review, ...inst.reviews];
        const newAverage = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...inst,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newAverage
        };
      }
      return inst;
    }));

    if (selectedInstitution && selectedInstitution.id === institutionId) {
      setSelectedInstitution(prev => prev ? {
        ...prev,
        reviews: [review, ...prev.reviews],
        reviewsCount: prev.reviewsCount + 1
      } : null);
    }
  };

  // Update institution from admin portal
  const handleUpdateInstitution = (updated: Institution) => {
    setInstitutions(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const handleAddInstitution = (newInst: Institution) => {
    setInstitutions(prev => [newInst, ...prev]);
  };

  // Student updates
  const handleUpdateStudent = (updated: StudentRecord) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleAddStudent = (newStudent: StudentRecord) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  // Smart notification dispatch
  const handleSendNotification = (notif: SmartNotification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Mandatory Authentication Check: If not logged in, render the login portal
  if (!authenticatedUser) {
    return (
      <div dir={language === 'fr' || language === 'en' ? 'ltr' : 'rtl'} className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-600 selection:text-white">
        <MandatoryAuthScreen
          onLoginSuccess={handleLoginSuccess}
          institutions={institutions}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
    );
  }

  // Filtered data based on authentication roles to prevent data mixing:
  // - ministry_executive has full oversight over all institutions and students nationwide.
  // - institution_admin only manages their own institution and students.
  const accessibleInstitutions = authenticatedUser.role === 'institution_admin' && authenticatedUser.institutionId
    ? institutions.filter(inst => inst.id === authenticatedUser.institutionId)
    : institutions;

  const accessibleStudents = authenticatedUser.role === 'institution_admin' && authenticatedUser.institutionId
    ? students.filter(std => std.institutionId === authenticatedUser.institutionId)
    : students;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white" dir={language === 'fr' || language === 'en' ? 'ltr' : 'rtl'}>
      {/* Global Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        favoritesCount={favorites.length}
        setShowFavoritesOnly={setShowFavoritesOnly}
        showFavoritesOnly={showFavoritesOnly}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        authUser={authenticatedUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'satellite' && (
          <DedicatedSatelliteMap
            institutions={institutions}
            language={language}
            selectedInstitution={selectedInstitution}
            onSelectInstitution={(inst) => setSelectedInstitution(inst)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onOpenDetailsModal={(inst) => setSelectedInstitution(inst)}
          />
        )}

        {activeTab === 'explore' && (
          <MapExplorer
            institutions={institutions}
            language={language}
            selectedInstitution={selectedInstitution}
            onSelectInstitution={(inst) => setSelectedInstitution(inst)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
            isOffline={isOffline}
            onSwitchToSatelliteTab={() => setActiveTab('satellite')}
          />
        )}

        {activeTab === 'events' && (
          <EventsCalendar language={language} />
        )}

        {activeTab === 'quiz' && (
          <AdaptiveQuizEngine language={language} />
        )}

        {activeTab === 'admin' && (
          <SchoolManagementPortal
            institutions={accessibleInstitutions}
            students={accessibleStudents}
            onUpdateInstitution={handleUpdateInstitution}
            onAddInstitution={handleAddInstitution}
            onUpdateStudent={handleUpdateStudent}
            onAddStudent={handleAddStudent}
            onSendNotification={handleSendNotification}
            currentRole={currentRole}
            language={language}
            authUser={authenticatedUser}
          />
        )}

        {activeTab === 'student' && (
          <StudentParentPortal
            students={students}
            currentRole={currentRole}
            language={language}
            onOpenQuiz={() => setActiveTab('quiz')}
            authUser={authenticatedUser}
          />
        )}

        {activeTab === 'analytics' && (
          <PlatformAnalytics
            institutions={institutions}
            language={language}
          />
        )}
      </main>

      {/* Full Modal Detail Profile */}
      <InstitutionDetailModal
        institution={selectedInstitution}
        onClose={() => setSelectedInstitution(null)}
        language={language}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        currentUserRole={currentRole}
        onAddReview={handleAddReview}
      />

      {/* 24/7 AI Live Support Chat Widget */}
      <LiveSupportWidget language={language} />
    </div>
  );
}

