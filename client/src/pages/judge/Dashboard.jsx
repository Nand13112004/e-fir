import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth';
import { useTranslation } from 'react-i18next';

export default function JudgeDashboard() {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const [assigned, setAssigned] = useState([]);
  const [today, setToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    completedToday: 0,
    upcomingHearings: 0
  });

  useEffect(() => {
    (async () => {
      try {
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
          pendingCases: assignedData.filter(c => c.status === 'PENDING').length,
          completedToday: todayData.filter(h => h.status === 'COMPLETED').length,
          upcomingHearings: todayData.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number">{stats.totalCases}</div>
              <div className="stat-label">{t('totalCases')}</div>
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
            <div>
              <div className="stat-number text-yellow-600">{stats.pendingCases}</div>
              <div className="stat-label">{t('pendingCases')}</div>
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
            <div>
              <div className="stat-number text-govGreen-600">{stats.completedToday}</div>
              <div className="stat-label">{t('completedToday')}</div>
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
            <div>
              <div className="stat-number text-govOrange-600">{stats.upcomingHearings}</div>
              <div className="stat-label">{t('upcomingHearings')}</div>
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
              <p className="text-govGray-500 font-medium">आज कोई सुनवाई निर्धारित नहीं है।</p>
              <p className="text-sm text-govGray-400 mt-1">सभी मामले स्थगित या पूर्ण हैं।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {today.map((h) => (
                <div key={h._id} className="flex items-center justify-between p-4 bg-govGray-50 rounded-lg border border-govGray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-govBlue-600">
                        {new Date(h.date).toLocaleTimeString('hi-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                      <span className="status-badge status-in-progress">सुनवाई</span>
                    </div>
                    <div className="text-sm text-govGray-800 font-medium">
                      शिकायत संख्या: {h.complaintId}
                    </div>
                    <div className="text-xs text-govGray-600 mt-1">
                      कक्ष: {h.courtroom || 'निर्धारित नहीं'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-primary text-xs py-1 px-3">
                      विवरण देखें
                    </button>
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
              <h3 className="gov-card-title">न्यायालयीन शिकायतें</h3>
              <p className="text-sm text-govGray-600 mt-1">{courtName}</p>
            </div>
          </div>
          
          {assigned.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-govGray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-govGray-500 font-medium">वर्तमान में कोई शिकायत निर्धारित नहीं है।</p>
              <p className="text-sm text-govGray-400 mt-1">नई शिकायतें यहाँ दिखाई जाएंगी।</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {assigned.map((c) => (
                <Link 
                  key={c._id} 
                  to={`/judge/complaints/${c._id}`} 
                  className="block p-4 bg-white border border-govGray-200 rounded-lg hover:shadow-md hover:border-govBlue-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-govGray-800">
                          {c.complaintNumber}
                        </span>
                        <span className={`status-badge ${
                          c.status === 'PENDING' ? 'status-pending' :
                          c.status === 'IN_PROGRESS' ? 'status-in-progress' :
                          c.status === 'COMPLETED' ? 'status-completed' :
                          'status-pending'
                        }`}>
                          {c.status === 'PENDING' ? 'लंबित' :
                           c.status === 'IN_PROGRESS' ? 'प्रगति में' :
                           c.status === 'COMPLETED' ? 'पूर्ण' : c.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-govGray-800 mb-1">
                        {c.title}
                      </h4>
                      <div className="text-xs text-govGray-500">
                        दिनांक: {new Date(c.createdAt).toLocaleDateString('hi-IN')}
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
          <h3 className="gov-card-title">त्वरित कार्य</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-govBlue-50 border border-govBlue-200 rounded-lg hover:bg-govBlue-100 transition-colors">
            <svg className="w-6 h-6 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-govBlue-800">सभी मामले देखें</div>
              <div className="text-xs text-govBlue-600">विस्तृत सूची</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-govOrange-50 border border-govOrange-200 rounded-lg hover:bg-govOrange-100 transition-colors">
            <svg className="w-6 h-6 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-govOrange-800">सुनवाई निर्धारित करें</div>
              <div className="text-xs text-govOrange-600">नई तारीख</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-govGreen-50 border border-govGreen-200 rounded-lg hover:bg-govGreen-100 transition-colors">
            <svg className="w-6 h-6 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <div className="font-medium text-govGreen-800">रिपोर्ट देखें</div>
              <div className="text-xs text-govGreen-600">मासिक सारांश</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}


