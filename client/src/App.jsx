import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './store/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PoliceDashboard from './pages/police/Dashboard';
import JudgeDashboard from './pages/judge/Dashboard';
import JudgeComplaintDetail from './pages/judge/ComplaintDetail';
import JudgeCasesList from './pages/judge/CasesList';
import JudgeReports from './pages/judge/Reports';
import AdminDashboard from './pages/admin/Dashboard';
import ComplaintForm from './pages/police/ComplaintForm';
import ComplaintList from './pages/police/ComplaintList';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import HelpFAQModal from './components/HelpFAQModal';
import IndianEmblem from './components/IndianEmblem';

function Protected({ children, role }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const hideLogo = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <>
      {/* Top Government Bar */}
      <div className="bg-govOrange-950 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <span className="font-medium">{t('governmentOfIndia')}</span>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="gov-header">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Section */}
            <Link to="/" className="gov-header-brand">
              <div className="flex items-center gap-3">
                {!hideLogo && (
                  <div className="flex-shrink-0">
                    <img 
                      src="/logo.png" 
                      alt="Logo" 
                      className="w-12 h-12 object-contain bg-white rounded"
                      onError={(e) => {
                        // Fallback to Indian Emblem if logo.png doesn't exist
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                    <IndianEmblem className="w-12 h-12 text-white hidden" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-wide">{t('appName')}</span>
                  <span className="text-sm opacity-90">{t('courtManagementSystem')}</span>
                </div>
              </div>
            </Link>
            
            {/* Navigation & Actions */}
            <div className="flex items-center gap-6">
              {/* User Info */}
              {user && (
                <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-medium">{user.name || 'User'}</span>
                    <span className="text-xs opacity-75 uppercase">
                      {user.role === 'JUDGE' && t('judge')}
                      {user.role === 'POLICE' && t('police')}
                      {user.role === 'ADMIN' && t('admin')}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">{(user.name || 'U')[0]}</span>
                  </div>
                </div>
              )}
              
              {/* Language Selector */}
              <div className="gov-nav px-3 py-2">
                <select
                  aria-label={t('selectLanguage')}
                  className="bg-transparent text-white border-none outline-none cursor-pointer font-medium"
                  onChange={(e) => {
                    const newLanguage = e.target.value;
                    i18n.changeLanguage(newLanguage);
                    localStorage.setItem('language', newLanguage);
                  }}
                  value={i18n.language}
                >
                  <option value="en" className="text-black">English</option>
                  <option value="hi" className="text-black">हिन्दी</option>
                  <option value="gu" className="text-black">ગુજરાતી</option>
                </select>
              </div>
              
              {/* Logout Button */}
              {user && (
                <button 
                  onClick={logout} 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('logout')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      {user && (
        <div className="bg-govGray-100 border-b border-govGray-200 py-2">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-govGray-600">
              <Link to="/" className="hover:text-govBlue-600 transition-colors">{t('home')}</Link>
              <span>›</span>
              <span className="text-govGray-800 font-medium">
                {user.role === 'JUDGE' && t('judgeDashboard')}
                {user.role === 'POLICE' && t('policeDashboard')}
                {user.role === 'ADMIN' && t('adminDashboard')}
              </span>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function FooterComponent() {
  const { t } = useTranslation();
  const [showHelpFAQ, setShowHelpFAQ] = useState(false);
  
  return (
    <>
      <footer className="bg-gray-800 text-white mt-auto">
        {/* Top Section - Navigation and Social Media */}
        <div className="bg-gray-700 py-4 border-b border-gray-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left - Navigation Links */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a href="#" className="hover:text-govOrange-400 transition-colors">Feedback</a>
                <span className="text-gray-500">|</span>
                <button onClick={() => setShowHelpFAQ(true)} className="hover:text-govOrange-400 transition-colors">FAQ</button>
                <span className="text-gray-500">|</span>
                <a href="#" className="hover:text-govOrange-400 transition-colors">{t('contactUs')}</a>
                <span className="text-gray-500">|</span>
                <a href="#" className="hover:text-govOrange-400 transition-colors">Website Policies</a>
                <span className="text-gray-500">|</span>
                <a href="#" className="hover:text-govOrange-400 transition-colors">{t('privacyPolicy')}</a>
                <span className="text-gray-500">|</span>
                <a href="#" className="hover:text-govOrange-400 transition-colors">Disclaimer</a>
              </div>
              
              {/* Right - Social Media Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors" title="X (Twitter)">
                  <span className="text-white text-xs font-bold">X</span>
                </a>
                <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors" title="Facebook">
                  <span className="text-white text-xs font-bold">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" title="YouTube">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity" title="Instagram">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors" title="Telegram">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.174 1.858-.93 6.37-1.313 8.448-.17.95-.504 1.268-.827 1.3-.7.064-1.23-.461-1.908-.903-1.058-.693-1.657-1.125-2.684-1.802-1.274-.854-.449-1.324.278-2.09.19-.197 3.475-3.186 3.537-3.457.008-.03.015-.141-.053-.199-.068-.058-.168-.038-.241-.023-.103.02-1.74 1.108-4.915 3.253-.465.31-.886.46-1.264.453-.416-.008-1.214-.235-1.807-.43-.728-.24-1.305-.37-1.255-.782.026-.21.4-.425 1.1-.644 4.247-1.54 7.07-2.556 8.463-3.046 2.01-.71 2.43-.833 2.704-.833.595 0 .968.11 1.19.322.24.23.31.54.34.95.03.41.07 1.08.07 1.95z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors" title="LinkedIn">
                  <span className="text-white text-xs font-bold">in</span>
                </a>
                <a href="#" className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors" title="Koo">
                  <span className="text-white text-xs">🐦</span>
                </a>
                <a href="#" className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity" title="ShareChat">
                  <span className="text-white text-xs font-bold">SC</span>
                </a>
                <a href="#" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" title="MyGov">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors" title="WhatsApp">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.057-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.98-3.717-.214-.38a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Website Information */}
        <div className="bg-gray-900 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <div className="text-gray-300">
                Website Content Managed by Ministry of Home Affairs, Govt. of India. Best viewed in Mozilla Firefox, Google Chrome [B].
              </div>
              <div className="flex items-center gap-6 text-gray-300">
                <div>
                  <span className="font-semibold">Visitor Count:</span> 226565897
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span> 01/10/2025
                </div>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  title="Scroll to top"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4 text-center text-sm text-gray-400">
              © 2025 {t('governmentOfIndia')} | {t('allRightsReserved')}
            </div>
          </div>
        </div>
      </footer>
      
      {/* Help/FAQ Modal */}
      {showHelpFAQ && (
        <HelpFAQModal isOpen={showHelpFAQ} onClose={() => setShowHelpFAQ(false)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-govGray-50">
      <Header />
      
      <main className="min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/police" 
              element={
                <Protected role="POLICE">
                  <PoliceDashboard />
                </Protected>
              } 
            />
            <Route 
              path="/police/complaints" 
              element={
                <Protected role="POLICE">
                  <ComplaintList />
                </Protected>
              } 
            />
            <Route 
              path="/police/complaints/new" 
              element={
                <Protected role="POLICE">
                  <ComplaintForm />
                </Protected>
              } 
            />
            
            <Route 
              path="/judge" 
              element={
                <Protected role="JUDGE">
                  <JudgeDashboard />
                </Protected>
              } 
            />
            <Route 
              path="/judge/complaint/:id" 
              element={
                <Protected role="JUDGE">
                  <JudgeComplaintDetail />
                </Protected>
              } 
            />
            <Route 
              path="/judge/cases" 
              element={
                <Protected role="JUDGE">
                  <JudgeCasesList />
                </Protected>
              } 
            />
            <Route 
              path="/judge/reports" 
              element={
                <Protected role="JUDGE">
                  <JudgeReports />
                </Protected>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <Protected role="ADMIN">
                  <AdminDashboard />
                </Protected>
              }
            />
          </Routes>
        </div>
      </main>
      
      <FooterComponent />
    </div>
  );
}


