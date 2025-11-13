const express = require('express');
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const Hearing = require('../models/Hearing');
const User = require('../models/User');
const Notification = require('../models/Notification');

const router = express.Router();

router.get('/assigned', auth(['JUDGE']), async (req, res, next) => {
  try {
    const judge = await User.findById(req.user.userId);
    const court = judge?.department;
    const filter = { status: { $ne: 'DRAFT' } };
    if (court) filter.court = court;
    const items = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post('/:id/approve-hearing', auth(['JUDGE']), async (req, res, next) => {
  try {
    const { date, time, courtroom, remarks, isOnline } = req.body;
    const complaintId = req.params.id;
    const hearing = await Hearing.create({
      complaintId,
      judgeId: req.user.userId,
      date,
      time,
      courtroom,
      isOnline: Boolean(isOnline),
      notes: remarks,
      history: [{ action: 'HEARING_SET', by: req.user.userId, details: remarks || '' }]
    });
    // update complaint status and save judge reply so police can see it
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        $set: { status: 'HEARING_SCHEDULED' },
        $push: {
          judgeReplies: {
            type: 'HEARING_SCHEDULED',
            message: remarks || '',
            payload: { date, time, courtroom, isOnline: Boolean(isOnline) },
            judgeId: req.user.userId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    if (complaint && complaint.createdByPoliceId) {
      await Notification.create({
        toUserId: complaint.createdByPoliceId,
        type: 'HEARING_SET',
        payload: { complaintId, date, time, courtroom, isOnline: Boolean(isOnline) }
      });
    }
    req.app.get('io').emit('notify', { type: 'HEARING_SET', complaintId, date, time, courtroom, isOnline: Boolean(isOnline) });
    res.status(201).json(hearing);
  } catch (e) {
    next(e);
  }
});

router.post('/:id/request-more-info', auth(['JUDGE']), async (req, res, next) => {
  try {
    const { comment } = req.body;
    const complaintId = req.params.id;
    await Complaint.findByIdAndUpdate(complaintId, { $set: { status: 'MORE_INFO_REQUESTED' } });
    // save judge reply and notify the police who created it
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        $push: {
          judgeReplies: {
            type: 'MORE_INFO_REQUESTED',
            message: comment || '',
            payload: { comment },
            judgeId: req.user.userId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    if (complaint && complaint.createdByPoliceId) {
      await Notification.create({
        toUserId: complaint.createdByPoliceId,
        type: 'MORE_INFO_REQUESTED',
        payload: { complaintId, comment }
      });
    }
    req.app.get('io').emit('notify', { type: 'MORE_INFO_REQUESTED', complaintId, comment });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/:id/reject', auth(['JUDGE']), async (req, res, next) => {
  try {
    const { reason } = req.body;
    const complaintId = req.params.id;
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        $set: { status: 'REJECTED' },
        $push: {
          judgeReplies: {
            type: 'REJECTED',
            message: reason || '',
            payload: { reason },
            judgeId: req.user.userId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    if (complaint && complaint.createdByPoliceId) {
      await Notification.create({
        toUserId: complaint.createdByPoliceId,
        type: 'COMPLAINT_REJECTED',
        payload: { complaintId, reason }
      });
    }
    req.app.get('io').emit('notify', { type: 'COMPLAINT_REJECTED', complaintId, reason });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.post('/:id/final-judgment', auth(['JUDGE']), async (req, res, next) => {
  try {
    const { summary } = req.body;
    const complaintId = req.params.id;
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        $set: { status: 'CLOSED' },
        $push: {
          judgeReplies: {
            type: 'JUDGMENT',
            message: summary || '',
            payload: { summary },
            judgeId: req.user.userId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    if (complaint && complaint.createdByPoliceId) {
      await Notification.create({
        toUserId: complaint.createdByPoliceId,
        type: 'JUDGMENT_UPLOADED',
        payload: { complaintId, summary }
      });
    }
    req.app.get('io').emit('notify', { type: 'JUDGMENT_UPLOADED', complaintId, summary });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.get('/hearings/today', auth(['JUDGE']), async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const items = await Hearing.find({
      judgeId: req.user.userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

module.exports = router;


