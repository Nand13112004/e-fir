const mongoose = require('mongoose');

const HearingSchema = new mongoose.Schema(
  {
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String },
    courtroom: { type: String },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
    isOnline: { type: Boolean, default: false },
    notes: String,
    history: [
      {
        at: { type: Date, default: Date.now },
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        details: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hearing', HearingSchema);


