import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technical Guides',
      'Aptitude Tests',
      'HR Preparation',
      'Video Tutorials',
      'Resume Templates',
      'Question Banks'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  externalLink: {
    type: String,
    required: true,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
