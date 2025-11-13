import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="bg-govGray border rounded p-6">
        <h1 className="text-2xl font-semibold mb-2">{t('appName')}</h1>
        <p className="text-gray-600 mb-4">{t('selectRoleToLogin')}</p>
        <div className="mb-4">
          <Link className="text-govBlue underline text-sm" to="/register">Create a new account</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link className="border rounded p-4 hover:shadow" to="/login?role=POLICE">
            <div className="gov-badge mb-2">{t('police')}</div>
            <p className="text-sm">File/track complaints, forward to judge</p>
          </Link>
          <Link className="border rounded p-4 hover:shadow" to="/login?role=JUDGE">
            <div className="gov-badge mb-2">{t('judge')}</div>
            <p className="text-sm">Review, schedule hearings, pass judgment</p>
          </Link>
          <Link className="border rounded p-4 hover:shadow" to="/login?role=ADMIN">
            <div className="gov-badge mb-2">{t('admin')}</div>
            <p className="text-sm">Manage users, view statistics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


