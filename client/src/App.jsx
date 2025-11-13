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
    <div className="gov-header">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-white text-lg">{t('appName')}</Link>
        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            className="text-black rounded px-2 py-1"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="gu">ગુજરાતી</option>
          </select>
          {user ? (
            <button onClick={logout} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded">
              {t('logout')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
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
            path="/police/complaints/new"
            element={
              <Protected role="POLICE">
                <ComplaintForm />
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
            path="/judge"
            element={
              <Protected role="JUDGE">
                <JudgeDashboard />
              </Protected>
            }
          />
          <Route
            path="/judge/complaints/:id"
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
    </div>
  );
}


