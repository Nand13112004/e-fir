const express = require('express');
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const Hearing = require('../models/Hearing');
const upload = require('../lib/storage');

const router = express.Router();

router.post(
  '/',
  auth(['POLICE']),
  upload.fields([
    { name: 'photoEvidence', maxCount: 10 },
    { name: 'videoEvidence', maxCount: 5 },
    { name: 'documents', maxCount: 10 },
    { name: 'audioEvidence', maxCount: 5 },
    { name: 'idProofFile', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      const body = JSON.parse(req.body.payload || '{}');
      if (!body.court) {
        return res.status(400).json({ message: 'Court selection is required' });
      }

      const filesToEvidence = (files, type) =>
        (files || []).map((f) => ({
          type,
          originalName: f.originalname,
          storedName: f.filename,
          mimeType: f.mimetype,
          size: f.size,
          url: `/uploads/${f.filename}`
        }));

      const evidence = [
        ...filesToEvidence(req.files?.photoEvidence, 'photo'),
        ...filesToEvidence(req.files?.videoEvidence, 'video'),
        ...filesToEvidence(req.files?.documents, 'document'),
        ...filesToEvidence(req.files?.audioEvidence, 'audio')
      ];

      const complaint = await Complaint.create({
        ...body,
        evidence,
        idProof: body.idProof
          ? {
              idType: body.idProof.idType,
              idNumber: body.idProof.idNumber,
              file: req.files?.idProofFile
                ? {
                    type: 'id',
                    originalName: req.files.idProofFile[0].originalname,
                    storedName: req.files.idProofFile[0].filename,
                    mimeType: req.files.idProofFile[0].mimetype,
                    size: req.files.idProofFile[0].size,
                    url: `/uploads/${req.files.idProofFile[0].filename}`
                  }
                : undefined
            }
          : undefined,
        status: body.status || 'SUBMITTED',
        createdByPoliceId: req.user.userId,
        complaintNumber: `CMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });

      res.status(201).json(complaint);
    } catch (e) {
      next(e);
    }
  }
);

router.get('/', auth(['POLICE', 'ADMIN']), async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'POLICE') filter.createdByPoliceId = req.user.userId;
    const items = await Complaint.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', auth(['POLICE', 'ADMIN', 'JUDGE']), async (req, res, next) => {
  try {
    const item = await Complaint.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id/forward-to-judge', auth(['POLICE']), async (req, res, next) => {
  try {
    const { judgeId, notes } = req.body;
    const item = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { status: 'FORWARDED_TO_JUDGE', assignedJudgeId: judgeId }, $push: { notes: notes ? [notes] : [] } },
      { new: true }
    );
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.get('/:id/hearings', auth(['POLICE', 'JUDGE', 'ADMIN']), async (req, res, next) => {
  try {
    const hearings = await Hearing.find({ complaintId: req.params.id }).sort({ date: 1 });
    res.json(hearings);
  } catch (e) {
    next(e);
  }
});

// Upload evidence to existing complaint
router.post(
  '/evidence',
  auth(['POLICE', 'JUDGE']),
  upload.array('evidence', 10),
  async (req, res, next) => {
    try {
      const { complaintId } = req.body;
      if (!complaintId) {
        return res.status(400).json({ message: 'Complaint ID is required' });
      }

      const complaint = await Complaint.findById(complaintId);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      // Check if user has permission
      if (req.user.role === 'POLICE' && complaint.createdByPoliceId !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to add evidence to this complaint' });
      }

      const filesToEvidence = (files) =>
        (files || []).map((f) => {
          // Determine type based on mime type
          let type = 'document';
          if (f.mimetype.startsWith('image/')) type = 'photo';
          else if (f.mimetype.startsWith('video/')) type = 'video';
          else if (f.mimetype.startsWith('audio/')) type = 'audio';

          return {
            type,
            originalName: f.originalname,
            storedName: f.filename,
            mimeType: f.mimetype,
            size: f.size,
            url: `/uploads/${f.filename}`
          };
        });

      const newEvidence = filesToEvidence(req.files);
      complaint.evidence = [...(complaint.evidence || []), ...newEvidence];
      await complaint.save();

      res.status(200).json({ message: 'Evidence uploaded successfully', evidence: newEvidence });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;


