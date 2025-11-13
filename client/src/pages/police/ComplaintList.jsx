import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';
import EvidenceTable from '../../components/EvidenceTable';

export default function ComplaintList() {
  const { t } = useTranslation();
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
        setError(t('failedToLoad'));
      }
    })();
  }, [token, t]);

  const handleClick = async (id) => {
    try {
      const { data } = await axios.get(`/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelected(data);
    } catch (e) {
      setError(t('failedToLoadComplaint'));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('complaints')}</h2>
      {error ? <div className="text-red-600">{error}</div> : null}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-govGray">
            <tr>
              <th className="text-left p-2">{t('number')}</th>
              <th className="text-left p-2">{t('title')}</th>
              <th className="text-left p-2">{t('court')}</th>
              <th className="text-left p-2">{t('status')}</th>
              <th className="text-left p-2">{t('created')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleClick(c._id)}>
                <td className="p-2">{c.complaintNumber}</td>
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.court}</td>
                <td className="p-2">{mapStatus(c.status, t)}</td>
                <td className="p-2">{new Date(c.createdAt).toLocaleString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'gu-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <div className="mt-6 space-y-6">
          {/* Evidence Table */}
          {selected.evidence && selected.evidence.length > 0 && (
            <div className="gov-card">
              <div className="gov-card-header">
                <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="gov-card-title">{t('evidence')}</h3>
              </div>
              <div className="mt-4">
                <EvidenceTable 
                  evidence={selected.evidence || []} 
                  complaintId={selected._id}
                  onEvidenceUpdate={() => handleClick(selected._id)}
                />
              </div>
            </div>
          )}

          {/* Judge Replies */}
          <div className="gov-card">
            <div className="gov-card-header">
              <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="gov-card-title">{t('judgeReplies')}</h3>
            </div>
            {selected.judgeReplies && selected.judgeReplies.length ? (
              <ul className="mt-4 space-y-3">
                {selected.judgeReplies.map((r, idx) => (
                  <li key={idx} className="p-4 border border-govGray-200 rounded-lg bg-govGray-50">
                    <div className="text-sm font-semibold text-govGray-800 mb-2">{r.type}</div>
                    <div className="space-y-1 text-sm text-govGray-600">
                      {r.payload && r.payload.date ? (
                        <div><span className="font-medium">{t('date')}:</span> {new Date(r.payload.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'gu-IN')}</div>
                      ) : null}
                      {r.payload && r.payload.time ? (
                        <div><span className="font-medium">{t('time')}:</span> {r.payload.time}</div>
                      ) : null}
                      {r.payload && r.payload.courtroom ? (
                        <div><span className="font-medium">{t('courtroom')}:</span> {r.payload.courtroom}</div>
                      ) : null}
                      {r.payload && typeof r.payload.isOnline !== 'undefined' ? (
                        <div><span className="font-medium">{t('online')}:</span> {r.payload.isOnline ? t('yes') : t('no')}</div>
                      ) : null}
                      {r.message ? <div className="mt-2 p-2 bg-white rounded border border-govGray-200">{r.message}</div> : null}
                    </div>
                    <div className="text-xs text-govGray-500 mt-2">{new Date(r.createdAt).toLocaleString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'gu-IN')}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-govGray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-govGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">{t('noRepliesYet')}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapStatus(s, t) {
  if (!s) return '';
  if (s === 'CLOSED') return t('approved');
  if (s === 'REJECTED') return t('rejected');
  return s.replace(/_/g, ' ');
}


