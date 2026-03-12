/* global process */
import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendEmail } from '../utils/sendEmail.js';

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
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${process.env.APP_URL || '#'}" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px;">Login to Portal</a>
                  </td>
                </tr>
              </table>
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
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${process.env.APP_URL || '#'}" style="display: inline-block; padding: 16px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px;">Review Profile</a>
                  </td>
                </tr>
              </table>
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

// Delete student
router.delete('/students/:id', adminAuth, async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
