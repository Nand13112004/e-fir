import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="file"
        multiple={multiple}
        onChange={(e) => {
          if (multiple) setFiles((p) => ({ ...p, [name]: Array.from(e.target.files || []) }));
          else setFiles((p) => ({ ...p, [name]: e.target.files?.[0] || null }));
        }}
      />
    </div>
  );

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold">New Complaint</h2>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 1 — Complaint Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Court</label>
            <select className="border rounded w-full px-3 py-2" value={form.court} onChange={(e) => set('court', e.target.value)}>
              <option value="">Select Court</option>
              {courts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Complaint Type</label>
            <select className="border rounded w-full px-3 py-2" value={form.complaintType} onChange={(e) => set('complaintType', e.target.value)}>
              <option value="">Select</option>
              {complaintTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {form.complaintType === 'Others' ? (
            <div>
              <label className="block text-sm mb-1">Specify Complaint Type</label>
              <input className="border rounded w-full px-3 py-2" value={form.otherType} onChange={(e) => set('otherType', e.target.value)} />
            </div>
          ) : null}
          <div>
            <label className="block text-sm mb-1">Complaint Category</label>
            <select
              className="border rounded w-full px-3 py-2"
              value={form.complaintCategory}
              onChange={(e) => set('complaintCategory', e.target.value)}
            >
              <option value="">Select</option>
              {complaintCategories.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Brief Title of Complaint</label>
            <input className="border rounded w-full px-3 py-2" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 2 — Complainant Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input className="border rounded w-full px-3 py-2" value={form.complainant.fullName} onChange={(e) => set('complainant.fullName', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select className="border rounded w-full px-3 py-2" value={form.complainant.gender} onChange={(e) => set('complainant.gender', e.target.value)}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input type="number" className="border rounded w-full px-3 py-2" value={form.complainant.age} onChange={(e) => set('complainant.age', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Mobile Number</label>
            <input className="border rounded w-full px-3 py-2" value={form.complainant.mobile} onChange={(e) => set('complainant.mobile', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email (optional)</label>
            <input className="border rounded w-full px-3 py-2" value={form.complainant.email} onChange={(e) => set('complainant.email', e.target.value)} />
          </div>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">House No / Street</label>
              <input className="border rounded w-full px-3 py-2" value={form.complainant.address.houseStreet} onChange={(e) => set('complainant.address.houseStreet', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Area</label>
              <input className="border rounded w-full px-3 py-2" value={form.complainant.address.area} onChange={(e) => set('complainant.address.area', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">City</label>
              <input className="border rounded w-full px-3 py-2" value={form.complainant.address.city} onChange={(e) => set('complainant.address.city', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">District</label>
              <input className="border rounded w-full px-3 py-2" value={form.complainant.address.district} onChange={(e) => set('complainant.address.district', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">State</label>
              <input className="border rounded w-full px-3 py-2" value={form.complainant.address.state} onChange={(e) => set('complainant.address.state', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Pincode</label>
              <input className="border rounded w-full px-3 py-2" value={form.complainant.address.pincode} onChange={(e) => set('complainant.address.pincode', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 3 — Incident Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Date of Incident</label>
            <input type="date" className="border rounded w-full px-3 py-2" value={form.incident.date} onChange={(e) => set('incident.date', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Time of Incident (optional)</label>
            <input type="time" className="border rounded w-full px-3 py-2" value={form.incident.time} onChange={(e) => set('incident.time', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Place of Incident</label>
            <input className="border rounded w-full px-3 py-2" value={form.incident.place} onChange={(e) => set('incident.place', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Police Station Jurisdiction</label>
            <input className="border rounded w-full px-3 py-2" placeholder="Auto/GPS or Select" value={form.incident.policeStation} onChange={(e) => set('incident.policeStation', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Detailed Description</label>
            <textarea className="border rounded w-full px-3 py-2 h-28" value={form.incident.description} onChange={(e) => set('incident.description', e.target.value)} />
          </div>
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 4 — Accused Information (If Known)</h3>
        <div className="mb-2">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.accusedKnown} onChange={(e) => set('accusedKnown', e.target.checked)} /> Do you know the accused?
          </label>
        </div>
        {form.accusedKnown ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="border rounded w-full px-3 py-2" value={form.accused.name} onChange={(e) => set('accused.name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Gender</label>
              <select className="border rounded w-full px-3 py-2" value={form.accused.gender} onChange={(e) => set('accused.gender', e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Phone Number</label>
              <input className="border rounded w-full px-3 py-2" value={form.accused.phone} onChange={(e) => set('accused.phone', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Address</label>
              <input className="border rounded w-full px-3 py-2" value={form.accused.address} onChange={(e) => set('accused.address', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Relationship</label>
              <select className="border rounded w-full px-3 py-2" value={form.accused.relationship} onChange={(e) => set('accused.relationship', e.target.value)}>
                <option>Stranger</option>
                <option>Neighbor</option>
                <option>Friend</option>
                <option>Relative</option>
                <option>Unknown</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm mb-1">Identifiable features</label>
              <input className="border rounded w-full px-3 py-2" value={form.accused.identifiableFeatures} onChange={(e) => set('accused.identifiableFeatures', e.target.value)} />
            </div>
          </div>
        ) : null}
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-1">Section 5 — Evidence Upload <span className="text-xs text-gray-500 font-normal">(Optional)</span></h3>
        <p className="text-xs text-gray-500 mb-3">Attach any supporting photos, videos, documents or audio if available.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileInput label="Upload Photo Evidence (JPG/PNG)" name="photoEvidence" multiple />
          <FileInput label="Upload Video Evidence (MP4)" name="videoEvidence" multiple />
          <FileInput label="Upload Documents (PDF/DOC)" name="documents" multiple />
          <FileInput label="Upload Audio Evidence" name="audioEvidence" multiple />
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 6 — Witness Information (Optional)</h3>
        <button type="button" className="border rounded px-3 py-1 mb-2" onClick={addWitness}>
          Add Witness
        </button>
        <div className="space-y-3">
          {form.witnesses.map((w, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded p-3">
              <input className="border rounded px-3 py-2" placeholder="Full Name" value={w.fullName} onChange={(e) => updateWitness(idx, 'fullName', e.target.value)} />
              <input className="border rounded px-3 py-2" placeholder="Contact Number" value={w.contactNumber} onChange={(e) => updateWitness(idx, 'contactNumber', e.target.value)} />
              <input className="border rounded px-3 py-2 sm:col-span-2" placeholder="Address" value={w.address} onChange={(e) => updateWitness(idx, 'address', e.target.value)} />
              <input className="border rounded px-3 py-2 sm:col-span-2" placeholder="Statement" value={w.statement} onChange={(e) => updateWitness(idx, 'statement', e.target.value)} />
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 7 — Identity Verification (Mandatory)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">ID Proof</label>
            <select className="border rounded w-full px-3 py-2" value={form.idProof.idType} onChange={(e) => set('idProof.idType', e.target.value)}>
              <option>Aadhaar</option>
              <option>DrivingLicense</option>
              <option>PAN</option>
              <option>VoterID</option>
              <option>Passport</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">ID Number</label>
            <input className="border rounded w-full px-3 py-2" value={form.idProof.idNumber} onChange={(e) => set('idProof.idNumber', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Upload ID Proof</label>
            <input type="file" onChange={(e) => setFiles((p) => ({ ...p, idProofFile: e.target.files?.[0] || null }))} />
          </div>
        </div>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 8 — Declaration</h3>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.declarationAccepted} onChange={(e) => set('declarationAccepted', e.target.checked)} />
          I hereby declare that the information provided by me is true and accurate to the best of my knowledge.
        </label>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold mb-3">Section 9 — Submit</h3>
        <div className="flex gap-2">
          <button type="button" className="border rounded px-4 py-2" onClick={() => alert('Preview coming soon')}>
            Preview Complaint
          </button>
          <button disabled={submitting} className="bg-govBlue text-white rounded px-4 py-2">
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <button type="button" className="border rounded px-4 py-2" onClick={() => alert('Saved as draft')}>
            Save as Draft
          </button>
        </div>
      </section>
    </form>
  );
}


