import express from 'express';
import validator from 'validator';
import Notice from '../models/Notice.js';
import Notification from '../models/Notification.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET api/notices
// @desc    Get all notices (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting Logic: isFeatured DESC, createdAt DESC
    const notices = await Notice.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/notices
// @desc    Create a notice (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, content, category, link, isFeatured } = req.body;

    // Validations
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (link && !validator.isURL(link)) {
      return res.status(400).json({ message: 'Invalid attachment link' });
    }

    // Check for duplicate (same title + same date - simplified to same title today)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const duplicate = await Notice.findOne({
      title: title.trim(),
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (duplicate) {
      return res.status(400).json({ message: 'A notice with this title already exists today' });
    }

    const notice = new Notice({
      title: title.trim(),
      content: content.trim(),
      category,
      link: link || '',
      isFeatured: isFeatured || false
    });

    await notice.save();

    // Create notification for all students
    const notification = new Notification({
      message: `New notice: ${notice.title}`,
      type: 'notice',
      relatedId: notice._id,
      recipient: null // Broadcast
    });
    await notification.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('noticeUpdated');
      io.emit('new_notification', notification);
    }

    res.json(notice);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/notices/:id
// @desc    Update a notice (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, content, category, link, isFeatured } = req.body;

    let notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (title) notice.title = title.trim();
    if (content) notice.content = content.trim();
    if (category) notice.category = category;
    if (link !== undefined) {
      if (link && !validator.isURL(link)) {
        return res.status(400).json({ message: 'Invalid attachment link' });
      }
      notice.link = link;
    }
    if (isFeatured !== undefined) notice.isFeatured = isFeatured;

    await notice.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('noticeUpdated');

    res.json(notice);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/notices/:id
// @desc    Delete a notice (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    await notice.deleteOne();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('noticeUpdated');

    res.json({ message: 'Notice deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
