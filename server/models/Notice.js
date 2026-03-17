import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Event', 'Placement', 'Academic', 'Others'],
    required: true
  },
  link: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Prevent duplicate notices (same title + same date)
NoticeSchema.index({ title: 1, createdAt: 1 }, { unique: true });

export default mongoose.model('Notice', NoticeSchema);
