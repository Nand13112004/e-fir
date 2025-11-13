import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../store/auth';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    })();
  }, [token]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('adminDashboard')}</h2>
      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500">{t('totalComplaints')}</div>
            <div className="text-2xl font-semibold">{stats.totalComplaints}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500">{t('closedComplaints')}</div>
            <div className="text-2xl font-semibold">{stats.closedComplaints}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500">{t('judges')}</div>
            <div className="text-2xl font-semibold">{stats.judges}</div>
          </div>
          <div className="border rounded p-4">
            <div className="text-xs text-gray-500">{t('police')}</div>
            <div className="text-2xl font-semibold">{stats.police}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


