const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'HEARING_SET',
        'HEARING_UPDATED',
        'MORE_INFO_REQUESTED',
        'JUDGMENT_UPLOADED',
        'COMPLAINT_REJECTED',
        'JUDGE_REPLY'
      ],
      required: true
    },
    payload: mongoose.Schema.Types.Mixed,
    readAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);


