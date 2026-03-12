import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import { adminAuth } from '../middleware/adminAuth.js';

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
