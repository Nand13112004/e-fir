import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/auth';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const queryRole = new URLSearchParams(search).get('role') || 'POLICE';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(queryRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);

  // Redirect if already logged in
  useEffect(() => {
    if (token && user) {
      if (user.role === 'POLICE') navigate('/police');
      else if (user.role === 'JUDGE') navigate('/judge');
      else if (user.role === 'ADMIN') navigate('/admin');
    }
  }, [token, user, navigate]);

  useEffect(() => {
    setError('');
  }, [role]);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'POLICE':
        return {
          title: t('police') + ' ' + t('login'),
          subtitle: 'Police Officer Login',
          icon: (
            <svg className="w-8 h-8 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          color: 'govBlue'
        };
      case 'JUDGE':
        return {
          title: t('judge') + ' ' + t('login'),
          subtitle: 'Judge Login',
          icon: (
            <svg className="w-8 h-8 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          ),
          color: 'govOrange'
        };
      case 'ADMIN':
        return {
          title: t('admin') + ' ' + t('login'),
          subtitle: 'Administrator Login',
          icon: (
            <svg className="w-8 h-8 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          color: 'govGreen'
        };
      default:
        return getRoleInfo('POLICE');
    }
  };

  const roleInfo = getRoleInfo(role);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data?.user?.role !== role) {
        setError(t('roleMismatch'));
        return;
      }
      login({ token: data.token, user: data.user });
      if (role === 'POLICE') navigate('/police');
      else if (role === 'JUDGE') navigate('/judge');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="gov-card" style={{ marginTop: '2rem' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-${roleInfo.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
            {roleInfo.icon}
          </div>
          <h1 className="text-2xl font-bold text-govGray-800 mb-2">{roleInfo.title}</h1>
          <p className="text-govGray-600">{roleInfo.subtitle}</p>
          <div className="w-20 h-1 bg-tricolor-saffron mx-auto mt-3"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div>
            <label className="form-label">
              {t('email')}
            </label>
            <div className="relative">
              <input 
                type="email"
                className="form-input pl-12 pr-4" 
                placeholder={t('emailPlaceholder')}
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-govGray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="form-label">
              {t('password')}
            </label>
            <div className="relative">
              <input 
                type="password"
                className="form-input pl-12 pr-4" 
                placeholder={t('passwordPlaceholder')}
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-govGray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-govBlue-600 border-govGray-300 rounded focus:ring-govBlue-500" />
              <span className="ml-2 text-sm text-govGray-600">{t('rememberMe')}</span>
            </label>
            <a href="#" className="text-sm text-govBlue-600 hover:text-govBlue-800 transition-colors">
              {t('forgotPassword')}
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full btn-primary py-3 text-lg font-semibold ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loading-spinner w-5 h-5"></div>
{t('loggingIn')}
              </div>
            ) : (
t('login')
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-govGray-200">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setRole('POLICE')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  role === 'POLICE' ? 'bg-govBlue-100 text-govBlue-800' : 'text-govGray-600 hover:text-govBlue-600'
                }`}
              >
                {t('police')}
              </button>
              <button 
                onClick={() => setRole('JUDGE')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  role === 'JUDGE' ? 'bg-govOrange-100 text-govOrange-800' : 'text-govGray-600 hover:text-govOrange-600'
                }`}
              >
                {t('judge')}
              </button>
              <button 
                onClick={() => setRole('ADMIN')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  role === 'ADMIN' ? 'bg-govGreen-100 text-govGreen-800' : 'text-govGray-600 hover:text-govGreen-600'
                }`}
              >
                {t('admin')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-govGray-100 rounded-lg border border-govGray-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-govOrange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="text-sm text-govGray-700">
            <p className="font-medium mb-1">{t('securityNotice')}</p>
            <p>{t('securityDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


