import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  currentStage: {
    type: String,
    enum: [
      'APPLIED', 
      'SHORTLISTED', 
      'INTERVIEW_ROUND_1', 
      'INTERVIEW_ROUND_2', 
      'INTERVIEW_ROUND_3', 
      'SELECTED', 
      'REJECTED'
    ],
    default: 'APPLIED'
  },
  rejectedAtStage: {
    type: String,
    enum: [
      'APPLIED', 
      'SHORTLISTED', 
      'INTERVIEW_ROUND_1', 
      'INTERVIEW_ROUND_2', 
      'INTERVIEW_ROUND_3'
    ],
    default: null
  }
});

// Ensure a student can only apply once to a specific job
ApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Application', ApplicationSchema);
