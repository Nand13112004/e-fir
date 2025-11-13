import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const courts = ['Ahmedabad Central Court', 'Surat Court', 'Rajkot Court', 'Baroda Court', 'Anand Court'];

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get('role') || 'POLICE';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [court, setCourt] = useState(initialRole === 'JUDGE' ? courts[0] : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === 'JUDGE' && !court) {
      setCourt(courts[0]);
    }
    if (role !== 'JUDGE') {
      setCourt('');
    }
  }, [role, court]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !role) {
      setError(t('allFieldsRequired'));
      return;
    }
    if (role === 'JUDGE' && !court) {
      setError(t('pleaseSelectCourt'));
      return;
    }
    try {
      setLoading(true);
      await axios.post('/api/auth/register', { fullName, email, password, role, court });
      navigate(`/login?role=${role}`);
    } catch (err) {
      setError(err.response?.data?.message || t('registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="border rounded p-6 space-y-4" onSubmit={onSubmit}>
        <h2 className="text-xl font-semibold">{t('createAccount')}</h2>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        <div>
          <label className="block text-sm mb-1">{t('fullName')}</label>
          <input className="border rounded w-full px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">{t('email')}</label>
          <input className="border rounded w-full px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">{t('password')}</label>
          <input type="password" className="border rounded w-full px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">{t('role')}</label>
          <select className="border rounded w-full px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="POLICE">{t('police')}</option>
            <option value="JUDGE">{t('judge')}</option>
            <option value="ADMIN">{t('admin')}</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">{t('adminOnlyNote')}</p>
        </div>
        {role === 'JUDGE' ? (
          <div>
            <label className="block text-sm mb-1">{t('court')}</label>
            <select className="border rounded w-full px-3 py-2" value={court} onChange={(e) => setCourt(e.target.value)}>
              {courts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <button disabled={loading} className="bg-govBlue text-white px-4 py-2 rounded w-full">
          {loading ? t('creating') : t('register')}
        </button>
      </form>
    </div>
  );
}


