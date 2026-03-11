import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@somaiya\.edu$/, 'Please use a valid somaiya.edu email address']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  department: {
    type: String,
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  batch: {
    type: Number
  },
  cgpa: {
    type: Number
  },
  backlogs: {
    type: Number,
    default: 0
  },
  tenthPercentage: {
    type: Number
  },
  twelfthPercentage: {
    type: Number
  },
  collegeName: {
    type: String,
    trim: true
  },
  university: {
    type: String,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  projects: {
    type: [String],
    default: []
  },
  resumeUrl: {
    type: String,
    trim: true
  },
  profileStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  placementStatus: {
    type: String,
    enum: ['NOT_PLACED', 'PLACED', 'INTERNSHIP'],
    default: 'NOT_PLACED'
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
