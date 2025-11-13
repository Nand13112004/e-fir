import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth';

export default function JudgeDashboard() {
  const { token, user } = useAuth();
  const [assigned, setAssigned] = useState([]);
  const [today, setToday] = useState([]);

  useEffect(() => {
    (async () => {
      const headers = { Authorization: `Bearer ${token}` };
      const [a, b] = await Promise.all([
        axios.get('/api/judge/assigned', { headers }),
        axios.get('/api/judge/hearings/today', { headers })
      ]);
      setAssigned(a.data || []);
      setToday(b.data || []);
    })();
  }, [token]);

  const courtName = user?.department;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Judge Dashboard</h2>
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Hearings Today</h3>
        {today.length === 0 ? <p className="text-sm text-gray-500">No hearings scheduled for today.</p> : null}
        <ul className="list-disc pl-5">
          {today.map((h) => (
            <li key={h._id}>
              {new Date(h.date).toLocaleString()} — Complaint {h.complaintId} — Courtroom {h.courtroom || '-'}
            </li>
          ))}
        </ul>
      </div>
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">
          Court Complaints {courtName ? `— ${courtName}` : ''}
        </h3>
        {assigned.length === 0 ? <p className="text-sm text-gray-500">No complaints currently routed to this court.</p> : null}
        <ul className="space-y-2">
          {assigned.map((c) => (
            <li key={c._id}>
              <Link to={`/judge/complaints/${c._id}`} className="block border rounded px-3 py-2 hover:bg-govGray/60">
                <div className="text-sm font-semibold">{c.complaintNumber}</div>
                <div className="text-sm text-gray-600">{c.title}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">{c.status}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


