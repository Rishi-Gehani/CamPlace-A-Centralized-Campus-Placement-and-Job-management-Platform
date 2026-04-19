/* global process */
import express from 'express';
const router = express.Router();
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendShortlistedEmail, sendSelectedEmail, sendRejectedEmail } from '../utils/mailer.js';
import { GoogleGenAI } from "@google/genai";

// Apply for a job
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

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('analyticsUpdated');
    }

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

// @route   GET api/applications/stats
// @desc    Get current student's application statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id }).populate('jobId');
    
    // Filter by month/year if provided
    const { month, year } = req.query;
    let filteredApps = applications;
    
    if (month || year) {
      filteredApps = applications.filter(app => {
        const date = new Date(app.appliedDate);
        const mMatch = month ? (date.getMonth() + 1).toString() === month : true;
        const yMatch = year ? date.getFullYear().toString() === year : true;
        return mMatch && yMatch;
      });
    }

    // Prepare chart data
    // 1. Application Trends (by month)
    const trends = {};
    // Get last 6 months
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const yearNum = d.getFullYear();
      const key = `${monthName} ${yearNum}`;
      last6Months.push(key);
      trends[key] = 0;
    }

    filteredApps.forEach(app => {
      const date = new Date(app.appliedDate);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const yearNum = date.getFullYear();
      const key = `${monthName} ${yearNum}`;
      if (trends[key] !== undefined) {
        trends[key]++;
      }
    });
    const trendsData = last6Months.map(name => ({ name, value: trends[name] }));

    // 2. Status Distribution
    const statusDist = {
      'Selected': filteredApps.filter(app => app.currentStage === 'SELECTED').length,
      'Rejected': filteredApps.filter(app => app.currentStage === 'REJECTED').length,
      'In Progress': filteredApps.filter(app => {
        const stage = app.currentStage || 'APPLIED';
        return ['APPLIED', 'SHORTLISTED', 'INTERVIEW_ROUND_1', 'INTERVIEW_ROUND_2', 'INTERVIEW_ROUND_3'].includes(stage);
      }).length
    };
    const statusData = Object.entries(statusDist).map(([name, value]) => ({ name, value }));

    res.json({
      total: applications.length,
      filteredTotal: filteredApps.length,
      charts: {
        trends: trendsData,
        status: statusData
      }
    });
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
      .populate('studentId', 'firstName lastName email department degree resumeUrl placementStatus')
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

    // Fetch student to check placement status
    const student = await User.findById(application.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Prevent modifying other applications if the student is already placed
    if (student.placementStatus === 'PLACED' && application.currentStage !== 'SELECTED') {
      return res.status(400).json({ message: 'Student is already placed. Cannot modify other applications.' });
    }

    // Rule B: Stage Transition Logic (Strict)
    if (status === 'REJECTED') {
      // Capture the stage they were at before being rejected
      application.rejectedAtStage = application.currentStage;
    } else {
      const currentIndex = stages.indexOf(application.currentStage);
      const nextIndex = stages.indexOf(status);

      if (nextIndex !== currentIndex + 1) {
        return res.status(400).json({ message: 'Invalid stage transition' });
      }
      // If they were previously rejected and now promoted (unlikely but for safety)
      application.rejectedAtStage = null;
    }

    application.currentStage = status;
    await application.save();

    // Fetch job details for email
    const job = await Job.findById(application.jobId);

    // Send emails based on status
    if (status === 'SHORTLISTED') {
      sendShortlistedEmail(student, job);
      
      // Check if today is the interview day
      if (job.interviewDate) {
        const today = new Date();
        const interviewDate = new Date(job.interviewDate);
        
        if (
          today.getFullYear() === interviewDate.getFullYear() &&
          today.getMonth() === interviewDate.getMonth() &&
          today.getDate() === interviewDate.getDate()
        ) {
          const timeString = job.interviewTime ? ` at ${job.interviewTime}` : '';
          const interviewNotification = new Notification({
            message: `Reminder: Your interview for ${job.title} at ${job.company} is scheduled for today${timeString}!`,
            type: 'application',
            relatedId: job._id,
            recipient: application.studentId
          });
          await interviewNotification.save();
          
          const io = req.app.get('io');
          if (io) {
            io.to(application.studentId.toString()).emit('new_notification', interviewNotification);
          }
        }
      }
    } else if (status === 'SELECTED') {
      sendSelectedEmail(student, job);
    } else if (status === 'REJECTED') {
      sendRejectedEmail(student, job);
    }

    // Create notification for the student
    const notification = new Notification({
      message: `Your application status for ${job.title} changed to ${status}`,
      type: 'application',
      relatedId: application._id,
      recipient: application.studentId
    });
    await notification.save();

    // Finalization Logic (Rule 8)
    if (status === 'SELECTED') {
      await User.findByIdAndUpdate(application.studentId, { placementStatus: 'PLACED' });
    }

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(application.studentId.toString()).emit('applicationUpdate', { 
        applicationId: application._id, 
        status,
        rejectedAtStage: application.rejectedAtStage
      });
      io.emit('analyticsUpdated');
      io.to(application.studentId.toString()).emit('new_notification', notification);
    }

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Generate AI Insights for Student
router.post('/ai-insights', auth, async (req, res) => {
  try {
    const { timeframe, trends, statusDistribution } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const models = ["gemini-3.1-flash-lite-preview", "gemini-2.5-flash", "gemini-1.5-flash"];

    const prompt = `You are a world-class career coach and placement strategist with 20 years of experience helping students land top-tier jobs. A student has asked for a brutal, data-driven analysis of their current placement performance.

Here is their application data for the timeframe: ${timeframe}
- Application Trends (Last 6 Months): ${JSON.stringify(trends)}
- Status Distribution (Current Standing): ${JSON.stringify(statusDistribution)}

Your task is to diagnose their current momentum and provide a strict, executable action plan. Be encouraging but brutally honest about their funnel efficiency.

You MUST return the response as a valid JSON object with the following exact keys:
- "momentum_diagnosis": A 2-sentence analysis of their application volume and consistency.
- "funnel_diagnosis": A 1-sentence analysis of their conversion from application to selection/rejection.
- "critical_bottleneck": Identify the single biggest reason they aren't getting placed yet.
- "action_plan": An array of 3 strict, executable steps for the next 7 days.

Return ONLY the raw JSON object. Do not include markdown code blocks, conversational text, or any other formatting.`;

    let text = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        text = response.text;
        break; // Success, exit the loop
      } catch (error) {
        console.warn(`Model ${model} failed:`, error.message);
        lastError = error;
      }
    }

    if (!text) {
      throw lastError || new Error("All Gemini models failed");
    }

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const insights = JSON.parse(cleanedText);

    res.json(insights);
  } catch (error) {
    console.error('Student AI Insights Error:', error);
    res.status(500).json({ message: 'Failed to generate AI insights' });
  }
});

export default router;
