import express from 'express';
const router = express.Router();
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { adminAuth } from '../middleware/adminAuth.js';

// @route   GET api/jobs
// @desc    Get all jobs (Public/Student view)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Job not found' });
    res.status(500).send('Server error');
  }
});

// @route   POST api/jobs
// @desc    Create a job (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const job = await newJob.save();
    
    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.emit('newJob', job);
    
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/jobs/:id
// @desc    Update a job (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.emit('jobUpdated', job);
    
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/jobs/:id
// @desc    Delete a job (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const jobId = job._id;
    
    // Delete associated applications
    await Application.deleteMany({ jobId: jobId });
    
    await job.deleteOne();
    
    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.emit('jobDeleted', jobId);
    
    res.json({ message: 'Job removed and associated applications deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
