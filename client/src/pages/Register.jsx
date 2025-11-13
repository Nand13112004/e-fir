import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const courts = ['Ahmedabad Central Court', 'Surat Court', 'Rajkot Court', 'Baroda Court', 'Anand Court'];

export default function Register() {
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
      setError('All fields are required');
      return;
    }
    if (role === 'JUDGE' && !court) {
      setError('Please select a court');
      return;
    }
    try {
      setLoading(true);
      await axios.post('/api/auth/register', { fullName, email, password, role, court });
      navigate(`/login?role=${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="border rounded p-6 space-y-4" onSubmit={onSubmit}>
        <h2 className="text-xl font-semibold">Create account</h2>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input className="border rounded w-full px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="border rounded w-full px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="border rounded w-full px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Role</label>
          <select className="border rounded w-full px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="POLICE">Police</option>
            <option value="JUDGE">Judge</option>
            <option value="ADMIN">Admin</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Note: In production, only Admin can create new users.</p>
        </div>
        {role === 'JUDGE' ? (
          <div>
            <label className="block text-sm mb-1">Court</label>
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
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
    </div>
  );
}


