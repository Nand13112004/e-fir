import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../store/auth';
import { useEffect, useState } from 'react';
import HelpFAQModal from '../components/HelpFAQModal';

export default function Landing() {
  const { t } = useTranslation();
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);

  // Check if user is logged in and show reminder
  useEffect(() => {
    if (token && user) {
      setShowReminder(true);
    }
  }, [token, user]);

  const handleContinueToLanding = () => {
    setShowReminder(false);
  };
  
  const handleGoToDashboard = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="space-y-8">
      {/* Reminder Modal for Logged-in Users */}
      {showReminder && token && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-govGray-800">You are already logged in</h3>
            </div>
            <p className="text-govGray-600 mb-4">
              You are currently logged in as <span className="font-semibold">{user.name || user.email}</span>. 
              Would you like to go to your dashboard or continue browsing?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleGoToDashboard}
                className="btn-primary flex-1"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleContinueToLanding}
                className="btn-outline flex-1"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-govBlue-600 to-govBlue-800 text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-govOrange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold">
                {t('appName')}
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-govBlue-100 leading-relaxed">
              {t('modernSystem')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-govOrange-500 hover:bg-govOrange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-govOrange-400/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-govGreen-400/10 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-govBlue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-govGray-800 mb-2">{t('secure')}</h3>
          <p className="text-govGray-600">{t('secureDesc')}</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-govOrange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-govGray-800 mb-2">{t('fast')}</h3>
          <p className="text-govGray-600">{t('fastDesc')}</p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-govGreen-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-govGray-800 mb-2">{t('transparent')}</h3>
          <p className="text-govGray-600">{t('transparentDesc')}</p>
        </div>
      </div>

      {/* Role Selection Section */}
      <div id="roles" className="space-y-6">
        <div className="text-center">
          <h2 className="gov-heading-2">{t('selectRoleToLogin')}</h2>
          <p className="text-govGray-600 text-lg">{t('selectRoleToLogin')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/login?role=POLICE" 
            className="group gov-card hover:border-govBlue-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-govBlue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-govBlue-200 transition-colors">
                <svg className="w-10 h-10 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="status-badge status-in-progress mb-3">{t('police')}</div>
              <h3 className="text-lg font-semibold text-govGray-800 mb-2">{t('police')}</h3>
              <p className="text-sm text-govGray-600 leading-relaxed">
                {t('policeDesc')}
              </p>
            </div>
          </Link>

          <Link 
            to="/login?role=JUDGE" 
            className="group gov-card hover:border-govOrange-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-govOrange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-govOrange-200 transition-colors">
                <svg className="w-10 h-10 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div className="status-badge status-pending mb-3">{t('judge')}</div>
              <h3 className="text-lg font-semibold text-govGray-800 mb-2">{t('judge')}</h3>
              <p className="text-sm text-govGray-600 leading-relaxed">
                {t('judgeDesc')}
              </p>
            </div>
          </Link>

          <Link 
            to="/login?role=ADMIN" 
            className="group gov-card hover:border-govGreen-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-govGreen-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-govGreen-200 transition-colors">
                <svg className="w-10 h-10 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="status-badge status-completed mb-3">{t('admin')}</div>
              <h3 className="text-lg font-semibold text-govGray-800 mb-2">{t('admin')}</h3>
              <p className="text-sm text-govGray-600 leading-relaxed">
                उपयोगकर्ता प्रबंधन और सिस्टم आँकड़े<br/>
                <span className="text-xs">Manage users, view system statistics</span>
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-r from-govGray-100 to-white rounded-xl p-8 border border-govGray-200">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-govGray-800 mb-4">{t('needHelp')}</h3>
          <p className="text-govGray-600 mb-6">
            {t('helpDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="btn-outline inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t('userGuide')}
            </a>
            <a 
              href="#" 
              className="btn-outline inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('contactUs')}
            </a>
            <button
              onClick={() => setShowHelpFAQ(true)}
              className="btn-outline inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help & FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Help/FAQ Modal */}
      <HelpFAQModal isOpen={showHelpFAQ} onClose={() => setShowHelpFAQ(false)} />
    </div>
  );
}


