const mongoose = require('mongoose');

const AccusedSchema = new mongoose.Schema(
  {
    name: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phone: String,
    address: String,
    relationship: {
      type: String,
      enum: ['Stranger', 'Neighbor', 'Friend', 'Relative', 'Unknown']
    },
    identifiableFeatures: String
  },
  { _id: false }
);

const WitnessSchema = new mongoose.Schema(
  {
    fullName: String,
    contactNumber: String,
    address: String,
    statement: String
  },
  { _id: false }
);

const EvidenceSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['photo', 'video', 'document', 'audio', 'id'] },
    originalName: String,
    storedName: String,
    mimeType: String,
    size: Number,
    url: String,
    meta: mongoose.Schema.Types.Mixed
  },
  { _id: false, timestamps: true }
);

const ComplaintSchema = new mongoose.Schema(
  {
    complaintType: String,
    complaintCategory: String,
    court: { type: String, required: true },
    title: { type: String, required: true },
    complainant: {
      fullName: String,
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      age: Number,
      mobile: String,
      email: String,
      address: {
        houseStreet: String,
        area: String,
        city: String,
        district: String,
        state: String,
        pincode: String
      }
    },
    incident: {
      date: Date,
      time: String,
      place: String,
      policeStation: String,
      description: String
    },
    accusedKnown: { type: Boolean, default: false },
    accused: AccusedSchema,
    witnesses: [WitnessSchema],
    evidence: [EvidenceSchema],
    idProof: {
      idType: { type: String, enum: ['Aadhaar', 'DrivingLicense', 'PAN', 'VoterID', 'Passport'] },
      idNumber: String,
      file: EvidenceSchema
    },
    declarationAccepted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_POLICE_REVIEW',
        'FORWARDED_TO_JUDGE',
        'JUDGE_REVIEW',
        'HEARING_SCHEDULED',
        'MORE_INFO_REQUESTED',
        'REJECTED',
        'CLOSED'
      ],
      default: 'DRAFT'
    },
    assignedJudgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByPoliceId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    judgeReplies: [
      {
        type: { type: String },
        message: String,
        payload: mongoose.Schema.Types.Mixed,
        judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    complaintNumber: { type: String, unique: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);


