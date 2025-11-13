import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ComplaintList from './ComplaintList';

export default function PoliceDashboard() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('policeDashboard')}</h2>
      <div className="bg-white p-4 rounded shadow-sm">
        <ComplaintList />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link className="border rounded p-4 hover:shadow" to="/police/complaints/new">
          {t('newComplaint')}
        </Link>
        <Link className="border rounded p-4 hover:shadow" to="/police/complaints">
          {t('trackComplaints')}
        </Link>
        <a className="border rounded p-4 hover:shadow" href="https://www.cybercrime.gov.in/" target="_blank" rel="noreferrer">
          {t('helpFaq')}
        </a>
      </div>
    </div>
  );
}


