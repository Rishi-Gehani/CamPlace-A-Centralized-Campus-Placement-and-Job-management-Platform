/* global process */
import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendEmail } from '../utils/sendEmail.js';
import { GoogleGenAI } from "@google/genai";

// Get all students
router.get('/students', adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get pending verifications
router.get('/students/pending', adminAuth, async (req, res) => {
  try {
    const pendingStudents = await User.find({ role: 'student', profileStatus: 'PENDING' }).select('-password');
    res.json(pendingStudents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify student (Approve/Reject)
router.put('/students/verify/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'VERIFIED' or 'REJECTED'
    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const student = await User.findByIdAndUpdate(
      req.params.id,
      { profileStatus: status },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    io.to(student._id.toString()).emit('statusUpdate', { profileStatus: status });
    
    // Also notify admins that a verification was processed
    io.to('admin').emit('verificationProcessed', { studentId: student._id, status });
    io.emit('analyticsUpdated');

    // Send automated email notification
    try {
      let subject = '';
      let htmlContent = '';

      if (status === 'VERIFIED') {
        subject = 'Update on your CamPlace profile verification';
        htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td align="center" style="padding: 40px 0; background-color: #1e293b;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; text-transform: uppercase;">CamPlace</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin: 0 0 24px 0; color: #0f172a; font-size: 24px; font-weight: 700;">Profile Approved</h2>
              <p style="margin: 0 0 16px 0; color: #334155; font-size: 16px; line-height: 1.6;">Dear ${student.firstName},</p>
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.6;">We are writing to let you know that your student profile on <strong>CamPlace</strong> has been successfully verified by the administration team. You now have full access to the placement platform.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 700;">The CamPlace Administration Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
      } else if (status === 'REJECTED') {
        subject = 'Information regarding your CamPlace student profile';
        htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td align="center" style="padding: 40px 0; background-color: #1e293b;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; text-transform: uppercase;">CamPlace</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin: 0 0 24px 0; color: #0f172a; font-size: 24px; font-weight: 700;">Action Required</h2>
              <p style="margin: 0 0 16px 0; color: #334155; font-size: 16px; line-height: 1.6;">Dear ${student.firstName},</p>
              <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.6;">We recently reviewed your registration on the <strong>CamPlace</strong> platform. At this time, we are unable to verify your profile with the current information provided. Please log in to review and correct your details.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 700;">The CamPlace Administration Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
      }

      if (subject && htmlContent) {
        await sendEmail(student.email, subject, htmlContent);
        console.log(`Verification email sent to ${student.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // We don't fail the request if email fails, but we log it
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get dashboard analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const { month, year, dept, course } = req.query;

    let studentQuery = { role: 'student' };
    if (dept && dept !== 'ALL') studentQuery.department = dept;
    if (course && course !== 'ALL') studentQuery.degree = course;

    let jobQuery = { deadline: { $gt: new Date() } };
    // Jobs aren't strictly tied to dept/course in the model, but we could filter them if they were.
    // For now, let's keep active jobs as is or filter by date if needed.

    const [students, jobs, allApplications] = await Promise.all([
      User.find(studentQuery),
      Job.find(jobQuery),
      Application.find().populate('jobId').populate('studentId')
    ]);

    // Filter applications based on all criteria
    const filteredApplications = allApplications.filter(app => {
      if (!app.studentId) return false;
      
      const date = new Date(app.appliedDate);
      const mMatch = month && month !== 'ALL' ? (date.getMonth() + 1).toString() === month : true;
      const yMatch = year && year !== 'ALL' ? date.getFullYear().toString() === year : true;
      const dMatch = dept && dept !== 'ALL' ? app.studentId.department === dept : true;
      const cMatch = course && course !== 'ALL' ? app.studentId.degree === course : true;
      
      return mMatch && yMatch && dMatch && cMatch;
    });

    const stats = {
      totalStudents: students.length,
      pendingVerifications: students.filter(s => s.profileStatus === 'PENDING').length,
      activeJobs: jobs.length,
      totalApplications: filteredApplications.length
    };

    // 1. Application Pipeline
    const pipelineStages = [
      'APPLIED', 'SHORTLISTED', 'INTERVIEW_ROUND_1', 'INTERVIEW_ROUND_2', 'INTERVIEW_ROUND_3', 'SELECTED', 'REJECTED'
    ];
    const pipelineData = pipelineStages.map(stage => ({
      name: stage.replace(/_/g, ' '),
      value: filteredApplications.filter(app => app.currentStage === stage).length
    }));

    // 2. Company-wise Applications
    const companyApps = {};
    filteredApplications.forEach(app => {
      const companyName = app.jobId?.company || 'Unknown Company';
      companyApps[companyName] = (companyApps[companyName] || 0) + 1;
    });
    const companyAppsData = Object.entries(companyApps).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // 3. Placement Success Rate (with percentages)
    const selectedCount = filteredApplications.filter(app => app.currentStage === 'SELECTED').length;
    const rejectedCount = filteredApplications.filter(app => app.currentStage === 'REJECTED').length;
    const inProgressCount = filteredApplications.filter(app => app.currentStage && !['SELECTED', 'REJECTED'].includes(app.currentStage)).length;
    const total = filteredApplications.length || 1;

    const successRateData = [
      { name: 'Selected', value: selectedCount, percentage: ((selectedCount / total) * 100).toFixed(1) },
      { name: 'Rejected', value: rejectedCount, percentage: ((rejectedCount / total) * 100).toFixed(1) },
      { name: 'In Progress', value: inProgressCount, percentage: ((inProgressCount / total) * 100).toFixed(1) }
    ];

    // 4. Top Hiring Companies
    const hiringCompanies = {};
    filteredApplications.filter(app => app.currentStage === 'SELECTED').forEach(app => {
      const companyName = app.jobId?.company || 'Unknown Company';
      hiringCompanies[companyName] = (hiringCompanies[companyName] || 0) + 1;
    });
    const topHiringData = Object.entries(hiringCompanies).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 5. Role Distribution
    const roles = {};
    filteredApplications.forEach(app => {
      const roleTitle = app.jobId?.title || 'Unknown Role';
      roles[roleTitle] = (roles[roleTitle] || 0) + 1;
    });
    const roleDistributionData = Object.entries(roles).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 6. Stage-wise Rejection (Real data from rejectedAtStage)
    const rejectionStages = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_ROUND_1', 'INTERVIEW_ROUND_2', 'INTERVIEW_ROUND_3'];
    const stageRejectionData = rejectionStages.map(stage => ({
      name: stage === 'INTERVIEW_ROUND_1' ? 'Aptitude' : 
            stage === 'INTERVIEW_ROUND_2' ? 'Technical' : 
            stage === 'INTERVIEW_ROUND_3' ? 'HR' : 
            stage.charAt(0) + stage.slice(1).toLowerCase(),
      value: filteredApplications.filter(app => app.currentStage === 'REJECTED' && app.rejectedAtStage === stage).length
    }));

    res.json({
      stats,
      charts: {
        pipeline: pipelineData,
        companyApps: companyAppsData,
        successRate: successRateData,
        topHiring: topHiringData,
        roleDistribution: roleDistributionData,
        stageRejection: stageRejectionData
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete student
router.delete('/students/:id', adminAuth, async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Delete all applications associated with this student
    await Application.deleteMany({ studentId });
    
    // Delete the student
    const student = await User.findByIdAndDelete(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('analyticsUpdated');
    }
    
    res.json({ message: 'Student and all associated data deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Generate AI Insights for Admin
router.post('/ai-insights', adminAuth, async (req, res) => {
  try {
    const { successRate, stageRejection, pipeline, roleDistribution, topHiring, companyApps } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const models = ["gemini-3.1-flash-lite-preview", "gemini-2.5-flash", "gemini-1.5-flash"];

    const prompt = `You are an elite, highly analytical Chief Placement Officer for a top-tier university. The college administrator has asked you to analyze the current placement season based on the aggregated data from their dashboard charts.

Here is the current aggregated chart data:
- Overall Placement Success Rate: ${JSON.stringify(successRate)}
- Stage-Wise Rejections: ${JSON.stringify(stageRejection)}
- Application Pipeline (Funnel): ${JSON.stringify(pipeline)}
- Role Distribution: ${JSON.stringify(roleDistribution)}
- Top Hiring Companies: ${JSON.stringify(topHiring)}
- Company-wise Applications: ${JSON.stringify(companyApps)}

Your task is to provide a high-level strategic analysis. Be sharp, data-driven, and identify exactly where the placement cell needs to intervene.

You MUST return the response as a valid JSON object with the following exact keys:
- "executive_summary": A 2-sentence high-level overview of the season's health.
- "market_alignment_fix": An array of 2-3 specific points analyzing if students are applying for the right roles.
- "bottleneck_intervention": An array of 2-3 specific steps to fix the biggest stage where students are failing.
- "strategic_opportunity": Identify one untapped opportunity or a positive trend to double down on.

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
    console.error('Admin AI Insights Error:', error);
    res.status(500).json({ message: 'Failed to generate AI insights' });
  }
});

export default router;
