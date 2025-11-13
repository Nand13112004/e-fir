import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const complaintTypes = [
  'FIR',
  'General Complaint',
  'Missing Person Report',
  'Theft / Robbery',
  'Cyber Crime',
  'Domestic Violence',
  'Accident',
  'Assault',
  'Harassment',
  'Property Dispute',
  'Others'
];

const complaintCategories = [
  'Crime Against Person',
  'Crime Against Property',
  'Cyber Offense',
  'Public Safety',
  'Financial Fraud',
  'Missing / Lost Items'
];

const courts = ['Ahmedabad Central Court', 'Surat Court', 'Rajkot Court', 'Baroda Court', 'Anand Court'];

export default function ComplaintForm() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    complaintType: '',
    otherType: '',
    complaintCategory: '',
    court: '',
    title: '',
    complainant: {
      fullName: '',
      gender: 'Male',
      age: '',
      mobile: '',
      email: '',
      address: {
        houseStreet: '',
        area: '',
        city: '',
        district: '',
        state: '',
        pincode: ''
      }
    },
    incident: {
      date: '',
      time: '',
      place: '',
      policeStation: '',
      description: ''
    },
    accusedKnown: false,
    accused: {
      name: '',
      gender: 'Male',
      phone: '',
      address: '',
      relationship: 'Unknown',
      identifiableFeatures: ''
    },
    witnesses: [],
    idProof: { idType: 'Aadhaar', idNumber: '' },
    declarationAccepted: false
  });

  const [files, setFiles] = useState({
    photoEvidence: [],
    videoEvidence: [],
    documents: [],
    audioEvidence: [],
    idProofFile: null
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (path, value) => {
    setForm((prev) => {
      const clone = structuredClone(prev);
      const segments = path.split('.');
      let ref = clone;
      for (let i = 0; i < segments.length - 1; i++) ref = ref[segments[i]];
      ref[segments[segments.length - 1]] = value;
      return clone;
    });
  };

  const addWitness = () => {
    setForm((p) => ({ ...p, witnesses: [...p.witnesses, { fullName: '', contactNumber: '', address: '', statement: '' }] }));
  };

  const updateWitness = (idx, key, value) => {
    setForm((p) => {
      const copy = [...p.witnesses];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...p, witnesses: copy };
    });
  };

  const validate = () => {
    if (!form.complaintType) return 'Complaint Type is required';
    if (!form.complaintCategory) return 'Complaint Category is required';
    if (!form.title) return 'Brief Title is required';
    if (!form.court) return 'Court selection is required';
    if (!form.complainant.fullName) return 'Full Name is required';
    if (!form.complainant.age) return 'Age is required';
    if (!form.complainant.mobile) return 'Mobile Number is required';
    const addr = form.complainant.address;
    if (!addr.houseStreet || !addr.area || !addr.city || !addr.district || !addr.state || !addr.pincode) return 'Address is required';
    if (!form.incident.date) return 'Date of Incident is required';
    if (!form.incident.place) return 'Place of Incident is required';
    if (!form.incident.policeStation) return 'Police Station Jurisdiction is required';
    if (!form.incident.description) return 'Detailed Description is required';
    if (!form.idProof.idNumber) return 'ID Number is required';
    if (!files.idProofFile) return 'ID Proof file is required';
    if (!form.declarationAccepted) return 'Declaration must be accepted';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append(
        'payload',
        JSON.stringify({
          ...form,
          complaintType: form.complaintType === 'Others' ? form.otherType || 'Others' : form.complaintType
        })
      );
      for (const f of files.photoEvidence) fd.append('photoEvidence', f);
      for (const f of files.videoEvidence) fd.append('videoEvidence', f);
      for (const f of files.documents) fd.append('documents', f);
      for (const f of files.audioEvidence) fd.append('audioEvidence', f);
      if (files.idProofFile) fd.append('idProofFile', files.idProofFile);
      await axios.post('/api/complaints', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/police/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const FileInput = ({ label, name, multiple }) => (
    <div className="gov-card">
      <label className="form-label mb-2 block">{label}</label>
      <div className="relative">
        <input
          type="file"
          multiple={multiple}
          className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-govBlue-50 file:text-govBlue-700 hover:file:bg-govBlue-100"
          onChange={(e) => {
            if (multiple) setFiles((p) => ({ ...p, [name]: Array.from(e.target.files || []) }));
            else setFiles((p) => ({ ...p, [name]: e.target.files?.[0] || null }));
          }}
        />
      </div>
      {files[name] && files[name].length > 0 && (
        <div className="mt-2 text-sm text-govGray-600">
          {multiple ? `${files[name].length} file(s) selected` : files[name].name}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="tricolor-border pl-6">
        <h1 className="gov-heading-1 mb-2">{t('newComplaintTitle')}</h1>
        <p className="text-govGray-600 text-lg">{t('courtManagementSystem')}</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="gov-card-title">{t('section1')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('court')}</label>
              <select className="form-input" value={form.court} onChange={(e) => set('court', e.target.value)}>
                <option value="">{t('selectCourt')}</option>
                {courts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">{t('complaintType')}</label>
              <select className="form-input" value={form.complaintType} onChange={(e) => set('complaintType', e.target.value)}>
                <option value="">{t('select')}</option>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {form.complaintType === 'Others' ? (
              <div>
                <label className="form-label">{t('specifyComplaintType')}</label>
                <input className="form-input" value={form.otherType} onChange={(e) => set('otherType', e.target.value)} />
              </div>
            ) : null}
            <div>
              <label className="form-label">{t('complaintCategory')}</label>
              <select
                className="form-input"
                value={form.complaintCategory}
                onChange={(e) => set('complaintCategory', e.target.value)}
              >
                <option value="">{t('select')}</option>
                {complaintCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">{t('briefTitle')}</label>
              <input className="form-input" value={form.title} onChange={(e) => set('title', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="gov-card-title">{t('section2')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('fullName')}</label>
              <input className="form-input" value={form.complainant.fullName} onChange={(e) => set('complainant.fullName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('gender')}</label>
              <select className="form-input" value={form.complainant.gender} onChange={(e) => set('complainant.gender', e.target.value)}>
                <option>{t('male')}</option>
                <option>{t('female')}</option>
                <option>{t('other')}</option>
              </select>
            </div>
            <div>
              <label className="form-label">{t('age')}</label>
              <input type="number" className="form-input" value={form.complainant.age} onChange={(e) => set('complainant.age', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('mobileNumber')}</label>
              <input className="form-input" value={form.complainant.mobile} onChange={(e) => set('complainant.mobile', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('emailOptional')}</label>
              <input type="email" className="form-input" value={form.complainant.email} onChange={(e) => set('complainant.email', e.target.value)} />
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">{t('houseStreet')}</label>
                <input className="form-input" value={form.complainant.address.houseStreet} onChange={(e) => set('complainant.address.houseStreet', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('area')}</label>
                <input className="form-input" value={form.complainant.address.area} onChange={(e) => set('complainant.address.area', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('city')}</label>
                <input className="form-input" value={form.complainant.address.city} onChange={(e) => set('complainant.address.city', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('district')}</label>
                <input className="form-input" value={form.complainant.address.district} onChange={(e) => set('complainant.address.district', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('state')}</label>
                <input className="form-input" value={form.complainant.address.state} onChange={(e) => set('complainant.address.state', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('pincode')}</label>
                <input className="form-input" value={form.complainant.address.pincode} onChange={(e) => set('complainant.address.pincode', e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="gov-card-title">{t('section3')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('dateOfIncident')}</label>
              <input type="date" className="form-input" value={form.incident.date} onChange={(e) => set('incident.date', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('timeOfIncident')}</label>
              <input type="time" className="form-input" value={form.incident.time} onChange={(e) => set('incident.time', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">{t('placeOfIncident')}</label>
              <input className="form-input" value={form.incident.place} onChange={(e) => set('incident.place', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('policeStationJurisdiction')}</label>
              <input className="form-input" placeholder="Auto/GPS or Select" value={form.incident.policeStation} onChange={(e) => set('incident.policeStation', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">{t('detailedDescription')}</label>
              <textarea className="form-input h-28" value={form.incident.description} onChange={(e) => set('incident.description', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="gov-card-title">{t('section4')}</h3>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-govBlue-600 border-govGray-300 rounded focus:ring-govBlue-500" checked={form.accusedKnown} onChange={(e) => set('accusedKnown', e.target.checked)} />
              <span className="text-sm text-govGray-700">{t('doYouKnowAccused')}</span>
            </label>
          </div>
          {form.accusedKnown ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">{t('name')}</label>
                <input className="form-input" value={form.accused.name} onChange={(e) => set('accused.name', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('gender')}</label>
                <select className="form-input" value={form.accused.gender} onChange={(e) => set('accused.gender', e.target.value)}>
                  <option>{t('male')}</option>
                  <option>{t('female')}</option>
                  <option>{t('other')}</option>
                </select>
              </div>
              <div>
                <label className="form-label">{t('phoneNumber')}</label>
                <input className="form-input" value={form.accused.phone} onChange={(e) => set('accused.phone', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">{t('address')}</label>
                <input className="form-input" value={form.accused.address} onChange={(e) => set('accused.address', e.target.value)} />
              </div>
              <div>
                <label className="form-label">{t('relationship')}</label>
                <select className="form-input" value={form.accused.relationship} onChange={(e) => set('accused.relationship', e.target.value)}>
                  <option>Stranger</option>
                  <option>Neighbor</option>
                  <option>Friend</option>
                  <option>Relative</option>
                  <option>Unknown</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">{t('identifiableFeatures')}</label>
                <input className="form-input" value={form.accused.identifiableFeatures} onChange={(e) => set('accused.identifiableFeatures', e.target.value)} />
              </div>
            </div>
          ) : null}
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="gov-card-title">{t('section5')}</h3>
          </div>
          <p className="text-sm text-govGray-600 mb-4">{t('attachSupportingFiles')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileInput label={t('uploadPhotoEvidence')} name="photoEvidence" multiple />
            <FileInput label={t('uploadVideoEvidence')} name="videoEvidence" multiple />
            <FileInput label={t('uploadDocuments')} name="documents" multiple />
            <FileInput label={t('uploadAudioEvidence')} name="audioEvidence" multiple />
          </div>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="gov-card-title">{t('section6')}</h3>
          </div>
          <button type="button" className="btn-outline mb-4" onClick={addWitness}>
            {t('addWitness')}
          </button>
          <div className="space-y-3">
            {form.witnesses.map((w, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-govGray-200 rounded-lg p-4 bg-govGray-50">
                <input className="form-input" placeholder={t('fullName')} value={w.fullName} onChange={(e) => updateWitness(idx, 'fullName', e.target.value)} />
                <input className="form-input" placeholder={t('contactNumber')} value={w.contactNumber} onChange={(e) => updateWitness(idx, 'contactNumber', e.target.value)} />
                <input className="form-input sm:col-span-2" placeholder={t('address')} value={w.address} onChange={(e) => updateWitness(idx, 'address', e.target.value)} />
                <textarea className="form-input sm:col-span-2 h-20" placeholder={t('statement')} value={w.statement} onChange={(e) => updateWitness(idx, 'statement', e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <h3 className="gov-card-title">{t('section7')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('idProof')}</label>
              <select className="form-input" value={form.idProof.idType} onChange={(e) => set('idProof.idType', e.target.value)}>
                <option>Aadhaar</option>
                <option>DrivingLicense</option>
                <option>PAN</option>
                <option>VoterID</option>
                <option>Passport</option>
              </select>
            </div>
            <div>
              <label className="form-label">{t('idNumber')}</label>
              <input className="form-input" value={form.idProof.idNumber} onChange={(e) => set('idProof.idNumber', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">{t('uploadIdProof')}</label>
              <input type="file" className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-govBlue-50 file:text-govBlue-700 hover:file:bg-govBlue-100" onChange={(e) => setFiles((p) => ({ ...p, idProofFile: e.target.files?.[0] || null }))} />
              {files.idProofFile && (
                <div className="mt-2 text-sm text-govGray-600">{files.idProofFile.name}</div>
              )}
            </div>
          </div>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="gov-card-title">{t('section8')}</h3>
          </div>
          <label className="inline-flex items-start gap-3">
            <input type="checkbox" className="w-5 h-5 text-govBlue-600 border-govGray-300 rounded focus:ring-govBlue-500 mt-0.5" checked={form.declarationAccepted} onChange={(e) => set('declarationAccepted', e.target.checked)} />
            <span className="text-sm text-govGray-700">{t('declarationText')}</span>
          </label>
        </section>

        <section className="gov-card">
          <div className="gov-card-header">
            <svg className="gov-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="gov-card-title">{t('section9')}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-outline" onClick={() => alert('Preview coming soon')}>
              {t('previewComplaint')}
            </button>
            <button disabled={submitting} className="btn-primary">
              {submitting ? t('submitting') : t('submitComplaint')}
            </button>
            <button type="button" className="btn-outline" onClick={() => alert('Saved as draft')}>
              {t('saveAsDraft')}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}


