import express from 'express';
import QuizResult from '../models/QuizResult.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Check if student has already taken the quiz for a department
router.get('/check/:department', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      student: req.user.id,
      department: req.params.department
    });
    
    if (result) {
      return res.json({ completed: true, result });
    }
    
    res.json({ completed: false });
  } catch (error) {
    console.error('Error checking quiz status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz results
router.post('/submit', auth, async (req, res) => {
  try {
    const { department, score, maxScore, percentage } = req.body;
    
    // Check if already exists (extra safety)
    const existing = await QuizResult.findOne({
      student: req.user.id,
      department
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Quiz already completed for this department' });
    }
    
    const newResult = new QuizResult({
      student: req.user.id,
      department,
      score,
      maxScore,
      percentage
    });
    
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all quiz results for current student
router.get('/results', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ student: req.user.id });
    res.json(results);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
