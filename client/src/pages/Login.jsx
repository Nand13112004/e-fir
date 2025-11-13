import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/auth';
import { Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryRole = new URLSearchParams(search).get('role') || 'POLICE';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState(queryRole);
  const [error, setError] = useState('');
  const login = useAuth((s) => s.login);

  useEffect(() => {
    setError('');
  }, [role]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      if (data?.user?.role !== role) {
        setError('Role mismatch for this account');
        return;
      }
      login({ token: data.token, user: data.user });
      if (role === 'POLICE') navigate('/police');
      else if (role === 'JUDGE') navigate('/judge');
      else navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form className="border rounded p-6 space-y-4" onSubmit={onSubmit}>
        <h2 className="text-xl font-semibold">Login ({role})</h2>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="border rounded w-full px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="border rounded w-full px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="bg-govBlue text-white px-4 py-2 rounded w-full">Login</button>
      </form>
      <div className="text-center mt-3 text-sm">
        <span>Don&apos;t have an account? </span>
        <Link className="text-govBlue underline" to={`/register?role=${role}`}>Register</Link>
      </div>
    </div>
  );
}


