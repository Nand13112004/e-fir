import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../store/auth';

export default function ComplaintList() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(data);
      } catch (e) {
        setError('Failed to load');
      }
    })();
  }, [token]);

  const handleClick = async (id) => {
    try {
      const { data } = await axios.get(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelected(data);
    } catch (e) {
      setError('Failed to load complaint');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Complaints</h2>
      {error ? <div className="text-red-600">{error}</div> : null}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-govGray">
            <tr>
              <th className="text-left p-2">Number</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Court</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleClick(c._id)}>
                <td className="p-2">{c.complaintNumber}</td>
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.court}</td>
                <td className="p-2">{mapStatus(c.status)}</td>
                <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="font-semibold">Judge Replies</h3>
          {selected.judgeReplies && selected.judgeReplies.length ? (
            <ul className="mt-2 space-y-2">
              {selected.judgeReplies.map((r, idx) => (
                <li key={idx} className="p-2 border rounded bg-gray-50">
                  <div className="text-sm font-medium">{r.type}</div>
                  {r.payload && r.payload.date ? (
                    <div className="text-sm">Date: {new Date(r.payload.date).toLocaleDateString()}</div>
                  ) : null}
                  {r.payload && r.payload.time ? (
                    <div className="text-sm">Time: {r.payload.time}</div>
                  ) : null}
                  {r.payload && r.payload.courtroom ? (
                    <div className="text-sm">Courtroom: {r.payload.courtroom}</div>
                  ) : null}
                  {r.payload && typeof r.payload.isOnline !== 'undefined' ? (
                    <div className="text-sm">Online: {r.payload.isOnline ? 'Yes' : 'No'}</div>
                  ) : null}
                  {r.message ? <div className="text-sm mt-1">{r.message}</div> : null}
                  <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-600 mt-2">No replies from judge yet.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function mapStatus(s) {
  if (!s) return '';
  if (s === 'CLOSED') return 'Approved';
  if (s === 'REJECTED') return 'Rejected';
  return s.replace(/_/g, ' ');
}


