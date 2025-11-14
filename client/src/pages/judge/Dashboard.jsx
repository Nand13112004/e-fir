import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { useTranslation } from 'react-i18next';
import i18n from '../../services/i18n';

export default function JudgeDashboard() {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [assigned, setAssigned] = useState([]);
  const [today, setToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    completedToday: 0,
    upcomingHearings: 0,
    submitted: 0,
    inReview: 0,
    closed: 0
  });

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        setError('');
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        const [a, b] = await Promise.all([
          axios.get('/api/judge/assigned', { headers }),
          axios.get('/api/judge/hearings/today', { headers })
        ]);
        const assignedData = a.data || [];
        const todayData = b.data || [];
        
        setAssigned(assignedData);
        setToday(todayData);
        
        // Calculate stats
        setStats({
          totalCases: assignedData.length,
          pendingCases: assignedData.filter(c => c.status === 'PENDING' || c.status === 'SUBMITTED').length,
          completedToday: todayData.filter(h => h.status === 'COMPLETED').length,
          upcomingHearings: todayData.length,
          submitted: assignedData.filter(c => c.status === 'SUBMITTED').length,
          inReview: assignedData.filter(c => c.status === 'JUDGE_REVIEW' || c.status === 'HEARING_SCHEDULED').length,
          closed: assignedData.filter(c => c.status === 'CLOSED').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.response?.data?.message || t('failedToLoad') || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, t]);

  const courtName = user?.department || t('courtName', 'Central Court');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-govGray-600">{t('dashboardLoading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="tricolor-border pl-6">
        <h1 className="gov-heading-1 mb-2">{t('judgeDashboard')}</h1>
        <p className="text-govGray-600 text-lg">{t('courtManagementSystem')}</p>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="stat-number">{stats.totalCases}</div>
              <div className="stat-label">{t('totalCases')}</div>
              <div className="text-xs text-govGray-500 mt-1">
                {stats.submitted} {t('submitted') || 'Submitted'} • {stats.inReview} {t('inReview') || 'In Review'}
              </div>
            </div>
            <div className="w-12 h-12 bg-govBlue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="stat-number text-yellow-600">{stats.pendingCases}</div>
              <div className="stat-label">{t('pendingCases')}</div>
              <div className="text-xs text-govGray-500 mt-1">
                {stats.submitted} {t('awaitingAction') || 'Awaiting Action'}
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="stat-number text-govGreen-600">{stats.completedToday}</div>
              <div className="stat-label">{t('closedToday') || 'Closed Today'}</div>
              <div className="text-xs text-govGray-500 mt-1">
                {stats.closed} {t('closed') || 'Closed'} {t('total') || 'Total'}
              </div>
            </div>
            <div className="w-12 h-12 bg-govGreen-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="stat-number text-govOrange-600">{stats.upcomingHearings}</div>
              <div className="stat-label">{t('upcomingHearings')}</div>
              <div className="text-xs text-govGray-500 mt-1">
                {t('scheduledToday') || 'Scheduled Today'}
              </div>
            </div>
            <div className="w-12 h-12 bg-govOrange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Today's Hearings */}
        <div className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="gov-card-title">{t('hearingsToday')}</h3>
          </div>
          
          {today.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-govGray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-govGray-500 font-medium">{t('noHearingsToday')}</p>
              <p className="text-sm text-govGray-400 mt-1">{t('allCasesPostponed')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {today.map((h) => (
                <div key={h._id} className="flex items-center justify-between p-4 bg-govGray-50 rounded-lg border border-govGray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-govBlue-600">
                        {new Date(h.date).toLocaleTimeString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'gu-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                      <span className={`status-badge ${
                        h.status === 'COMPLETED' ? 'status-completed' : 'status-in-progress'
                      }`}>
                        {h.status === 'COMPLETED' ? t('closed') || 'Closed' : t('hearing')}
                      </span>
                    </div>
                    <div className="text-sm text-govGray-800 font-medium">
                      {t('complaintNumber')}: {h.complaintId}
                    </div>
                    <div className="text-xs text-govGray-600 mt-1">
                      {t('courtroom')}: {h.courtroom || t('notScheduled')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/judge/complaint/${h.complaintId?._id || h.complaintId}`}
                      className="btn-primary text-xs py-1 px-3"
                    >
                      {t('viewDetails')}
                    </Link>
                    {h.status !== 'COMPLETED' && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Mark this hearing as closed?')) {
                            try {
                              const headers = { Authorization: `Bearer ${token}` };
                              await axios.post(`/api/judge/hearing/${h._id}/complete`, {}, { headers });
                              // Reload data
                              const { data } = await axios.get('/api/judge/hearings/today', { headers });
                              setToday(data || []);
                            } catch (err) {
                              alert(err.response?.data?.message || 'Failed to close hearing');
                            }
                          }
                        }}
                        className="bg-govGreen-600 hover:bg-govGreen-700 text-white text-xs py-1 px-3 rounded-lg font-medium transition-colors"
                      >
                        {t('close') || 'Close'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Court Complaints */}
        <div className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex-1">
              <h3 className="gov-card-title">{t('courtComplaints')}</h3>
              <p className="text-sm text-govGray-600 mt-1">{courtName}</p>
            </div>
          </div>
          
          {assigned.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-govGray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-govGray-500 font-medium">{t('noComplaints')}</p>
              <p className="text-sm text-govGray-400 mt-1">{t('noComplaintsDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {assigned.map((c) => (
                <Link 
                  key={c._id} 
                  to={`/judge/complaint/${c._id}`} 
                  className="block p-4 bg-white border border-govGray-200 rounded-lg hover:shadow-md hover:border-govBlue-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-govGray-800">
                          {c.complaintNumber}
                        </span>
                        <span className={`status-badge ${
                          c.status === 'SUBMITTED' ? 'status-pending' :
                          c.status === 'PENDING' ? 'status-pending' :
                          c.status === 'JUDGE_REVIEW' ? 'status-in-progress' :
                          c.status === 'HEARING_SCHEDULED' ? 'status-in-progress' :
                          c.status === 'IN_PROGRESS' ? 'status-in-progress' :
                          c.status === 'CLOSED' ? 'status-completed' :
                          c.status === 'COMPLETED' ? 'status-completed' :
                          'status-pending'
                        }`}>
                          {c.status === 'SUBMITTED' ? t('submitted') || 'SUBMITTED' :
                           c.status === 'PENDING' ? t('pending') :
                           c.status === 'JUDGE_REVIEW' ? t('inReview') || 'In Review' :
                           c.status === 'HEARING_SCHEDULED' ? t('hearingScheduled') || 'Hearing Scheduled' :
                           c.status === 'IN_PROGRESS' ? t('inProgress') :
                           c.status === 'CLOSED' ? t('closed') :
                           c.status === 'COMPLETED' ? t('closed') : c.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-govGray-800 mb-1">
                        {c.title}
                      </h4>
                      <div className="text-xs text-govGray-500">
                        {t('date')}: {new Date(c.createdAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'hi' ? 'hi-IN' : 'gu-IN')}
                      </div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-govGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Quick Actions */}
      <div className="gov-card">
        <div className="gov-card-header">
          <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="gov-card-title">{t('quickActions')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/judge/cases"
            className="flex items-center gap-3 p-4 bg-govBlue-50 border border-govBlue-200 rounded-lg hover:bg-govBlue-100 transition-colors"
          >
            <svg className="w-6 h-6 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-govBlue-800">{t('viewAllCases')}</div>
              <div className="text-xs text-govBlue-600">{t('detailedList')}</div>
            </div>
          </Link>
          
          <button 
            onClick={() => {
              // Scroll to complaints section or show a modal to schedule hearing
              const firstComplaint = assigned.find(c => c.status === 'SUBMITTED' || c.status === 'PENDING');
              if (firstComplaint) {
                navigate(`/judge/complaint/${firstComplaint._id}`);
              } else {
                alert('No pending cases available to schedule hearing');
              }
            }}
            className="flex items-center gap-3 p-4 bg-govOrange-50 border border-govOrange-200 rounded-lg hover:bg-govOrange-100 transition-colors"
          >
            <svg className="w-6 h-6 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-govOrange-800">{t('scheduleHearing')}</div>
              <div className="text-xs text-govOrange-600">{t('newDate')}</div>
            </div>
          </button>
          
          <Link
            to="/judge/reports"
            className="flex items-center gap-3 p-4 bg-govGreen-50 border border-govGreen-200 rounded-lg hover:bg-govGreen-100 transition-colors"
          >
            <svg className="w-6 h-6 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-govGreen-800">{t('viewReports')}</div>
              <div className="text-xs text-govGreen-600">{t('monthlySummary')}</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}


