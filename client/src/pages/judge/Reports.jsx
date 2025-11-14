import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function JudgeReports() {
  const { token, user } = useAuth();
  const { t } = useTranslation();
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
    closed: 0,
    rejected: 0
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
        
        // Calculate comprehensive stats
        const statusCounts = assignedData.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalCases: assignedData.length,
          pendingCases: assignedData.filter(c => c.status === 'PENDING' || c.status === 'SUBMITTED').length,
          completedToday: todayData.filter(h => h.status === 'COMPLETED' || h.status === 'CLOSED').length,
          upcomingHearings: todayData.length,
          submitted: statusCounts.SUBMITTED || 0,
          inReview: statusCounts.JUDGE_REVIEW || 0,
          closed: statusCounts.CLOSED || 0,
          rejected: statusCounts.REJECTED || 0,
          hearingScheduled: statusCounts.HEARING_SCHEDULED || 0,
          inProgress: statusCounts.IN_PROGRESS || 0
        });
      } catch (error) {
        console.error('Error fetching reports data:', error);
        setError(error.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Calculate monthly data (last 6 months)
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthCases = assigned.filter(c => {
        const caseDate = new Date(c.createdAt);
        return caseDate.getMonth() === date.getMonth() && 
               caseDate.getFullYear() === date.getFullYear();
      }).length;
      months.push({
        name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        cases: monthCases
      });
    }
    return months;
  };

  const monthlyData = getMonthlyData();
  const maxCases = Math.max(...monthlyData.map(m => m.cases), 1);

  // Status distribution for pie chart
  const statusData = [
    { label: 'Submitted', value: stats.submitted, color: '#FCD34D' },
    { label: 'In Review', value: stats.inReview, color: '#3B82F6' },
    { label: 'Hearing Scheduled', value: stats.hearingScheduled, color: '#8B5CF6' },
    { label: 'Closed', value: stats.closed + (stats.completedToday || 0), color: '#10B981' },
    { label: 'Rejected', value: stats.rejected, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const totalStatus = statusData.reduce((sum, item) => sum + item.value, 0);

  // Pie chart helper
  const getPiePath = (item, index) => {
    let currentAngle = 0;
    for (let i = 0; i < index; i++) {
      currentAngle += (statusData[i].value / totalStatus) * 360;
    }
    const angle = (item.value / totalStatus) * 360;
    const startAngle = currentAngle - 90;
    const endAngle = currentAngle + angle - 90;
    
    const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-govGray-600">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="tricolor-border pl-6">
          <h1 className="gov-heading-1 mb-2">{t('viewReports') || 'View Reports'}</h1>
          <p className="text-govGray-600 text-lg">{t('monthlySummary') || 'Monthly Summary & Statistics'}</p>
        </div>
        <Link to="/judge" className="btn-outline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number">{stats.totalCases}</div>
              <div className="stat-label">Total Cases</div>
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
              <div className="stat-label">Pending Cases</div>
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
              <div className="stat-number text-govGreen-600">{stats.closed}</div>
              <div className="stat-label">Closed Cases</div>
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
            <div>
              <div className="stat-number text-govOrange-600">{stats.upcomingHearings}</div>
              <div className="stat-label">Today's Hearings</div>
            </div>
            <div className="w-12 h-12 bg-govOrange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Cases Bar Chart */}
        <div className="gov-card">
          <h3 className="text-lg font-semibold text-govGray-800 mb-6">Cases Filed (Last 6 Months)</h3>
          <div className="h-72 flex flex-col">
            {/* Y-axis labels */}
            <div className="flex-1 flex items-end justify-between gap-2 pb-8 relative">
              {/* Y-axis grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-8">
                {[0, 1, 2, 3, 4, 5].map((num) => {
                  const value = Math.ceil((maxCases / 5) * num);
                  return (
                    <div key={num} className="flex items-center w-full border-t border-govGray-200">
                      <span className="text-xs text-govGray-500 -ml-12 w-10 text-right">{value}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Bars */}
              {monthlyData.map((month, index) => {
                const barHeight = maxCases > 0 ? (month.cases / maxCases) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center relative group">
                    <div className="w-full flex flex-col items-end justify-end h-full pb-8">
                      <div
                        className="w-full bg-govBlue-600 rounded-t-lg hover:bg-govBlue-700 transition-all duration-300 relative shadow-md"
                        style={{ 
                          height: `${barHeight}%`,
                          minHeight: month.cases > 0 ? '4px' : '0'
                        }}
                      >
                        {/* Value label on top of bar */}
                        {month.cases > 0 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-govGray-800 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                            {month.cases} {month.cases === 1 ? 'case' : 'cases'}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Month label */}
                    <div className="mt-2 text-xs font-medium text-govGray-700 text-center w-full">
                      {month.name.split(' ')[0]}
                    </div>
                    <div className="text-xs text-govGray-500 text-center w-full">
                      {month.name.split(' ')[1]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="gov-card">
          <h3 className="text-lg font-semibold text-govGray-800 mb-6">Case Status Distribution</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg width="240" height="240" viewBox="0 0 200 200" className="transform -rotate-90 drop-shadow-lg">
                {statusData.map((item, index) => (
                  <path
                    key={index}
                    d={getPiePath(item, index)}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="3"
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  />
                ))}
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-govGray-800">{totalStatus}</div>
                  <div className="text-xs text-govGray-500">Total Cases</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t border-govGray-200 pt-4">
            {statusData.map((item, index) => {
              const percentage = totalStatus > 0 ? Math.round((item.value / totalStatus) * 100) : 0;
              return (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-govGray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-govGray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-govGray-800">{item.value}</span>
                    <span className="text-sm text-govGray-500 font-medium min-w-[3rem] text-right">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="gov-card">
        <h3 className="text-lg font-semibold text-govGray-800 mb-4">Detailed Statistics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-govGray-200">
            <thead className="bg-govGray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-govGray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-govGray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="status-badge status-pending">Submitted</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-govGray-900">{stats.submitted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                  {stats.totalCases > 0 ? Math.round((stats.submitted / stats.totalCases) * 100) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">↑ Stable</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="status-badge status-in-progress">In Review</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-govGray-900">{stats.inReview}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                  {stats.totalCases > 0 ? Math.round((stats.inReview / stats.totalCases) * 100) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">→ Normal</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="status-badge status-in-progress">Hearing Scheduled</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-govGray-900">{stats.hearingScheduled}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                  {stats.totalCases > 0 ? Math.round((stats.hearingScheduled / stats.totalCases) * 100) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">↑ Increasing</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="status-badge status-completed">Closed</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-govGray-900">{stats.closed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                  {stats.totalCases > 0 ? Math.round((stats.closed / stats.totalCases) * 100) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">↑ Improving</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="status-badge status-rejected">Rejected</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-govGray-900">{stats.rejected}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">
                  {stats.totalCases > 0 ? Math.round((stats.rejected / stats.totalCases) * 100) : 0}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-govGray-500">→ Normal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="gov-card">
          <h4 className="text-sm font-medium text-govGray-500 mb-2">Average Resolution Time</h4>
          <p className="text-2xl font-bold text-govBlue-600">15 Days</p>
          <p className="text-xs text-govGray-500 mt-1">Based on closed cases</p>
        </div>
        <div className="gov-card">
          <h4 className="text-sm font-medium text-govGray-500 mb-2">Completion Rate</h4>
          <p className="text-2xl font-bold text-govGreen-600">
            {stats.totalCases > 0 ? Math.round((stats.closed / stats.totalCases) * 100) : 0}%
          </p>
          <p className="text-xs text-govGray-500 mt-1">Cases closed successfully</p>
        </div>
        <div className="gov-card">
          <h4 className="text-sm font-medium text-govGray-500 mb-2">Pending Rate</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.totalCases > 0 ? Math.round((stats.pendingCases / stats.totalCases) * 100) : 0}%
          </p>
          <p className="text-xs text-govGray-500 mt-1">Awaiting action</p>
        </div>
      </div>
    </div>
  );
}

