import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './store/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PoliceDashboard from './pages/police/Dashboard';
import JudgeDashboard from './pages/judge/Dashboard';
import JudgeComplaintDetail from './pages/judge/ComplaintDetail';
import AdminDashboard from './pages/admin/Dashboard';
import ComplaintForm from './pages/police/ComplaintForm';
import ComplaintList from './pages/police/ComplaintList';
import { useTranslation } from 'react-i18next';

function Protected({ children, role }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  
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
              <div className="gov-emblem"></div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wide">{t('appName')}</span>
                <span className="text-sm opacity-90">{t('courtManagementSystem')}</span>
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
  
  return (
    <footer className="bg-govGray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">{t('appName')}</h3>
            <p className="text-govGray-300 text-sm">
              {t('modernSystem')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">{t('help')}</h3>
            <ul className="space-y-2 text-sm text-govGray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('userGuide')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('technicalSupport')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('contactUs')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">{t('help')}</h3>
            <ul className="space-y-2 text-sm text-govGray-300">
              <li><a href="#" className="hover:text-white transition-colors">{t('privacyPolicy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('termsOfUse')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('securityPolicy')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-govGray-700 mt-8 pt-4 text-center text-sm text-govGray-400">
          © 2024 {t('governmentOfIndia')} | {t('allRightsReserved')}
        </div>
      </div>
    </footer>
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


