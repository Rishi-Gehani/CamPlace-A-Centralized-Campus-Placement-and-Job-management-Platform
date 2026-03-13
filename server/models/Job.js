import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Job', 'Internship'],
    required: true
  },
  internshipDuration: {
    type: String,
    required: function() {
      return this.type === 'Internship';
    }
  },
  description: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  tags: [{
    type: String
  }],
  interviewRounds: {
    type: [String],
    default: ['Aptitude', 'Technical', 'HR']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Job', JobSchema);
