import express from 'express';
const router = express.Router();
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
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
    
    // Create notification for all students
    const notification = new Notification({
      message: `New job posted: ${job.title}`,
      type: 'job',
      relatedId: job._id
    });
    await notification.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('newJob', job);
      io.emit('analyticsUpdated');
      io.emit('new_notification', notification);
    }
    
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
    const oldJob = await Job.findById(req.params.id);
    if (!oldJob) return res.status(404).json({ message: 'Job not found' });

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    // Check if interviewDate was updated to today
    if (job.interviewDate && (!oldJob.interviewDate || oldJob.interviewDate.getTime() !== job.interviewDate.getTime())) {
      const today = new Date();
      const interviewDate = new Date(job.interviewDate);
      
      if (
        today.getFullYear() === interviewDate.getFullYear() &&
        today.getMonth() === interviewDate.getMonth() &&
        today.getDate() === interviewDate.getDate()
      ) {
        // Find all shortlisted applications for this job
        const applications = await Application.find({
          jobId: job._id,
          currentStage: 'SHORTLISTED'
        });

        const io = req.app.get('io');
        
        for (const app of applications) {
          // Check if notification already exists for today
          const existingNotification = await Notification.findOne({
            recipient: app.studentId,
            relatedId: job._id,
            type: 'application',
            createdAt: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          });

          if (!existingNotification) {
            const timeString = job.interviewTime ? ` at ${job.interviewTime}` : '';
            const notification = new Notification({
              message: `Reminder: Your interview for ${job.title} at ${job.company} is scheduled for today${timeString}!`,
              type: 'application',
              relatedId: job._id,
              recipient: app.studentId
            });
            await notification.save();
            
            if (io) {
              io.to(app.studentId.toString()).emit('new_notification', notification);
            }
          }
        }
      }
    }

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.emit('jobUpdated', job);
    io.emit('analyticsUpdated');
    
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
    io.emit('analyticsUpdated');
    
    res.json({ message: 'Job removed and associated applications deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
