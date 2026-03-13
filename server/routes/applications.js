import express from 'express';
const router = express.Router();
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';

// @route   POST api/applications/apply/:jobId
// @desc    Apply for a job
router.post('/apply/:jobId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // 1. Visibility Check (Only verified users)
    if (user.profileStatus !== 'VERIFIED') {
      return res.status(403).json({ message: 'Your profile must be verified to apply for jobs.' });
    }

    // 2. Placement Lock System (A3)
    if (user.placementStatus === 'PLACED') {
      return res.status(403).json({ message: 'User already placed.' });
    }

    // 3. Timeline Check (A2)
    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: 'Application deadline passed.' });
    }

    // 4. Duplicate Check (A1)
    const existingApplication = await Application.findOne({
      jobId: req.params.jobId,
      studentId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied.' });
    }

    const newApplication = new Application({
      jobId: req.params.jobId,
      studentId: req.user.id
    });

    await newApplication.save();
    res.json(newApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/applications/my
// @desc    Get current student's applications
router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('jobId')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/applications/admin
// @desc    Get all applications (Admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId')
      .populate('studentId', 'firstName lastName email')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/applications/:id/status
// @desc    Update application status (Admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body;
  const stages = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_ROUND_1', 'INTERVIEW_ROUND_2', 'INTERVIEW_ROUND_3', 'SELECTED'];

  try {
    let application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Rule B: Stage Transition Logic (Strict)
    if (status !== 'REJECTED') {
      const currentIndex = stages.indexOf(application.currentStage);
      const nextIndex = stages.indexOf(status);

      if (nextIndex !== currentIndex + 1) {
        return res.status(400).json({ message: 'Invalid stage transition' });
      }
    }

    application.currentStage = status;
    await application.save();

    // Finalization Logic (Rule 8)
    if (status === 'SELECTED') {
      await User.findByIdAndUpdate(application.studentId, { placementStatus: 'PLACED' });
    }

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.to(application.studentId.toString()).emit('applicationUpdate', { 
      applicationId: application._id, 
      status 
    });

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
