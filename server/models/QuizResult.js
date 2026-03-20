import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  insights: [
    {
      title: String,
      harsh_truth: String,
      action_step: String
    }
  ],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a student can only take the quiz once per department
quizResultSchema.index({ student: 1, department: 1 }, { unique: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export default QuizResult;
