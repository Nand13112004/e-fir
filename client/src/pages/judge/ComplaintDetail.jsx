import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { useTranslation } from 'react-i18next';
import EvidenceTable from '../../components/EvidenceTable';

const courtsLabels = {
  'Ahmedabad Central Court': 'Ahmedabad Central Court',
  'Surat Court': 'Surat Court',
  'Rajkot Court': 'Rajkot Court',
  'Baroda Court': 'Baroda Court',
  'Anand Court': 'Anand Court'
};

const statusBadge = (status) => {
  const map = {
    SUBMITTED: 'bg-blue-100 text-blue-700',
    HEARING_SCHEDULED: 'bg-green-100 text-green-700',
    MORE_INFO_REQUESTED: 'bg-yellow-100 text-yellow-700',
    REJECTED: 'bg-red-100 text-red-700',
    CLOSED: 'bg-gray-200 text-gray-700'
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

export default function ComplaintDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [acceptForm, setAcceptForm] = useState({
    date: '',
    time: '',
    courtroom: '',
    remarks: '',
    isOnline: false
  });
  const [requestInfoComment, setRequestInfoComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [finalSummary, setFinalSummary] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: complaintData }, { data: hearingsData }] = await Promise.all([
        axios.get(`/api/complaints/${id}`, { headers }),
        axios.get(`/api/complaints/${id}/hearings`, { headers })
      ]);
      setComplaint(complaintData);
      setHearings(hearingsData || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAccept = async () => {
    if (!acceptForm.date) {
      setError('Please choose a hearing date');
      return;
    }
    try {
      setError('');
      await axios.post(
        `/api/judge/${id}/approve-hearing`,
        {
          date: acceptForm.date,
          time: acceptForm.time,
          courtroom: acceptForm.courtroom,
          remarks: acceptForm.remarks,
          isOnline: acceptForm.isOnline
        },
        { headers }
      );
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule hearing');
    }
  };

  const handleRequestInfo = async () => {
    if (!requestInfoComment) {
      setError('Provide details for information request');
      return;
    }
    try {
      setError('');
      await axios.post(
        `/api/judge/${id}/request-more-info`,
        { comment: requestInfoComment },
        { headers }
      );
      setRequestInfoComment('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request information');
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      setError('Provide rejection reason');
      return;
    }
    try {
      setError('');
      await axios.post(
        `/api/judge/${id}/reject`,
        { reason: rejectReason },
        { headers }
      );
      setRejectReason('');
      navigate('/judge');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject complaint');
    }
  };

  const handleFinalJudgment = async () => {
    if (!finalSummary) {
      setError('Provide summary for final judgment');
      return;
    }
    try {
      setError('');
      await axios.post(
        `/api/judge/${id}/final-judgment`,
        { summary: finalSummary },
        { headers }
      );
      navigate('/judge');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit judgment');
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading complaint...</div>;
  }

  if (!complaint) {
    return (
      <div>
        <p className="text-red-600">{error || 'Complaint not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button className="text-govBlue text-sm underline" onClick={() => navigate(-1)}>
          ← Back to dashboard
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{complaint.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {complaint.complaintNumber} · {courtsLabels[complaint.court] || complaint.court}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusBadge(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>

      {error ? <div className="text-red-600 text-sm">{error}</div> : null}

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">Complaint Details</h2>
        <div className="text-sm">
          <div>
            <span className="font-medium">Type:</span> {complaint.complaintType}
          </div>
          <div>
            <span className="font-medium">Category:</span> {complaint.complaintCategory}
          </div>
          <div>
            <span className="font-medium">Filed On:</span> {new Date(complaint.createdAt).toLocaleString()}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mt-4 mb-2 text-sm uppercase text-gray-500">Incident</h3>
          <p className="text-sm whitespace-pre-line">{complaint.incident?.description}</p>
          <div className="mt-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Date:</span>{' '}
              {complaint.incident?.date ? new Date(complaint.incident.date).toLocaleDateString() : '—'}
            </div>
            <div>
              <span className="font-medium">Time:</span> {complaint.incident?.time || '—'}
            </div>
            <div>
              <span className="font-medium">Place:</span> {complaint.incident?.place}
            </div>
          </div>
        </div>
      </section>

      <section className="border rounded p-4 space-y-2">
        <h2 className="font-semibold">Complainant</h2>
        <div className="text-sm">
          <div>
            <span className="font-medium">Name:</span> {complaint.complainant?.fullName}
          </div>
          <div>
            <span className="font-medium">Contact:</span> {complaint.complainant?.mobile}
          </div>
          <div>
            <span className="font-medium">Email:</span> {complaint.complainant?.email || '—'}
          </div>
          <div className="mt-2">
            <span className="font-medium">Address:</span>{' '}
            {[complaint.complainant?.address?.houseStreet, complaint.complainant?.address?.area, complaint.complainant?.address?.city, complaint.complainant?.address?.district, complaint.complainant?.address?.state, complaint.complainant?.address?.pincode]
              .filter(Boolean)
              .join(', ')}
          </div>
        </div>
      </section>

      {complaint.accusedKnown ? (
        <section className="border rounded p-4 space-y-2">
          <h2 className="font-semibold">Accused (Provided)</h2>
          <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="font-medium">Name:</span> {complaint.accused?.name}
            </div>
            <div>
              <span className="font-medium">Relationship:</span> {complaint.accused?.relationship}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {complaint.accused?.phone || '—'}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Identifiable Features:</span> {complaint.accused?.identifiableFeatures || '—'}
            </div>
          </div>
        </section>
      ) : null}

      <section className="gov-card">
        <div className="gov-card-header">
          <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="gov-card-title">{t('evidence')}</h2>
        </div>
        <div className="mt-4">
          <EvidenceTable 
            evidence={complaint.evidence || []} 
            complaintId={complaint._id}
            onEvidenceUpdate={() => {
              // Reload complaint data
              window.location.reload();
            }}
          />
        </div>
      </section>

      <section className="border rounded p-4 space-y-4">
        <div>
          <h2 className="font-semibold">Schedule Hearing / Accept</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm mb-1">Hearing Date</label>
              <input
                type="date"
                className="border rounded w-full px-3 py-2"
                value={acceptForm.date}
                onChange={(e) => setAcceptForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Hearing Time</label>
              <input
                type="time"
                className="border rounded w-full px-3 py-2"
                value={acceptForm.time}
                onChange={(e) => setAcceptForm((p) => ({ ...p, time: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Courtroom / Meeting Link</label>
              <input
                className="border rounded w-full px-3 py-2"
                value={acceptForm.courtroom}
                onChange={(e) => setAcceptForm((p) => ({ ...p, courtroom: e.target.value }))}
                placeholder="Courtroom number or virtual meeting link"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={acceptForm.isOnline}
                onChange={(e) => setAcceptForm((p) => ({ ...p, isOnline: e.target.checked }))}
              />
              <span className="text-sm">Conduct hearing online</span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Message / Directions</label>
              <textarea
                className="border rounded w-full px-3 py-2 h-24"
                value={acceptForm.remarks}
                onChange={(e) => setAcceptForm((p) => ({ ...p, remarks: e.target.value }))}
                placeholder="Short message for police regarding preparation"
              />
            </div>
          </div>
          <button onClick={handleAccept} className="mt-3 bg-govBlue text-white px-4 py-2 rounded">
            Accept & Schedule Hearing
          </button>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold">Request More Information</h2>
          <textarea
            className="border rounded w-full px-3 py-2 h-24 mt-2"
            value={requestInfoComment}
            onChange={(e) => setRequestInfoComment(e.target.value)}
            placeholder="Ask police for additional documents, statements, photographs..."
          />
          <button onClick={handleRequestInfo} className="mt-2 border border-govBlue text-govBlue px-4 py-2 rounded">
            Send Request
          </button>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold text-red-600">Reject Complaint</h2>
          <textarea
            className="border rounded w-full px-3 py-2 h-20 mt-2"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection"
          />
          <button onClick={handleReject} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">
            Reject Complaint
          </button>
        </div>

        <div className="border-t pt-4">
          <h2 className="font-semibold">Pass Final Judgment (Online Justice)</h2>
          <textarea
            className="border rounded w-full px-3 py-2 h-24 mt-2"
            value={finalSummary}
            onChange={(e) => setFinalSummary(e.target.value)}
            placeholder="Upload or summarize final judgment to close the case."
          />
          <button onClick={handleFinalJudgment} className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded">
            Upload Judgment & Close Case
          </button>
        </div>
      </section>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Hearing History</h2>
        {hearings.length ? (
          <ul className="space-y-2 text-sm">
            {hearings.map((h) => (
              <li key={h._id} className="border rounded px-3 py-2">
                <div className="font-medium">
                  {new Date(h.date).toLocaleString()} {h.isOnline ? '(Online)' : ''}
                </div>
                <div className="text-xs text-gray-500">Courtroom: {h.courtroom || '—'}</div>
                <div className="text-xs text-gray-500">Status: {h.status}</div>
                {h.notes ? <div className="text-sm mt-1">{h.notes}</div> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hearings scheduled yet.</p>
        )}
      </section>
    </div>
  );
}


