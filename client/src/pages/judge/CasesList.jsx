import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';

export default function JudgeCasesList() {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        setError('');
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get('/api/judge/assigned', { headers });
        setAssigned(data || []);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError(error.response?.data?.message || 'Failed to load cases');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const filteredCases = assigned.filter(c => {
    const matchesFilter = filter === 'ALL' || c.status === filter;
    const matchesSearch = !searchTerm || 
      c.complaintNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'SUBMITTED': 'status-pending',
      'PENDING': 'status-pending',
      'JUDGE_REVIEW': 'status-in-progress',
      'HEARING_SCHEDULED': 'status-in-progress',
      'IN_PROGRESS': 'status-in-progress',
      'CLOSED': 'status-completed',
      'COMPLETED': 'status-completed',
      'REJECTED': 'status-rejected'
    };
    return statusMap[status] || 'status-pending';
  };

  const getStatusText = (status) => {
    const statusTextMap = {
      'SUBMITTED': t('submitted') || 'SUBMITTED',
      'PENDING': t('pending'),
      'JUDGE_REVIEW': t('inReview') || 'In Review',
      'HEARING_SCHEDULED': t('hearingScheduled') || 'Hearing Scheduled',
      'IN_PROGRESS': t('inProgress'),
      'CLOSED': t('closed'),
      'COMPLETED': t('closed'),
      'REJECTED': t('rejected') || 'REJECTED'
    };
    return statusTextMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-govGray-600">{t('loading') || 'Loading...'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="tricolor-border pl-6">
        <h1 className="gov-heading-1 mb-2">{t('viewAllCases') || 'View All Cases'}</h1>
        <p className="text-govGray-600 text-lg">{t('detailedList') || 'Detailed List of All Cases'}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="gov-card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'ALL' 
                  ? 'bg-govBlue-600 text-white' 
                  : 'bg-govGray-100 text-govGray-700 hover:bg-govGray-200'
              }`}
            >
              All ({assigned.length})
            </button>
            <button
              onClick={() => setFilter('SUBMITTED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'SUBMITTED' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-govGray-100 text-govGray-700 hover:bg-govGray-200'
              }`}
            >
              Submitted ({assigned.filter(c => c.status === 'SUBMITTED').length})
            </button>
            <button
              onClick={() => setFilter('HEARING_SCHEDULED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'HEARING_SCHEDULED' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-govGray-100 text-govGray-700 hover:bg-govGray-200'
              }`}
            >
              Hearing Scheduled ({assigned.filter(c => c.status === 'HEARING_SCHEDULED').length})
            </button>
            <button
              onClick={() => setFilter('CLOSED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'CLOSED' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-govGray-100 text-govGray-700 hover:bg-govGray-200'
              }`}
            >
              Closed ({assigned.filter(c => c.status === 'CLOSED').length})
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={t('    search') || 'Search cases...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 pr-4"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-govGray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="gov-card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-govGray-800">
            {filteredCases.length} {filteredCases.length === 1 ? 'Case' : 'Cases'} Found
          </h3>
        </div>

        {filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-govGray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-govGray-500 font-medium">No cases found</p>
            <p className="text-sm text-govGray-400 mt-1">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((c) => (
              <Link
                key={c._id}
                to={`/judge/complaint/${c._id}`}
                className="block p-5 bg-white border border-govGray-200 rounded-lg hover:shadow-lg hover:border-govBlue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base font-semibold text-govGray-800">
                        {c.complaintNumber}
                      </span>
                      <span className={`status-badge ${getStatusBadge(c.status)}`}>
                        {getStatusText(c.status)}
                      </span>
                    </div>
                    <h4 className="text-base font-medium text-govGray-800 mb-2">
                      {c.title}
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-govGray-600">
                      <span>
                        <strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'gu-IN')}
                      </span>
                      {c.court && (
                        <span>
                          <strong>Court:</strong> {c.court}
                        </span>
                      )}
                      {c.complainant?.fullName && (
                        <span>
                          <strong>Complainant:</strong> {c.complainant.fullName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <svg className="w-6 h-6 text-govGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

