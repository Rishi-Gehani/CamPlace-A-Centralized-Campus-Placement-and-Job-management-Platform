import express from 'express';
import validator from 'validator';
import Resource from '../models/Resource.js';
import Notification from '../models/Notification.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET api/resources
// @desc    Get all resources (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/resources/categories
// @desc    Get categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'Technical Guides',
      'Aptitude Tests',
      'HR Preparation',
      'Video Tutorials',
      'Resume Templates',
      'Question Banks'
    ];

    const counts = await Promise.all(categories.map(async (cat) => {
      const count = await Resource.countDocuments({ category: cat });
      return { name: cat, count };
    }));

    res.json(counts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/resources
// @desc    Create a resource (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, category, tags, externalLink, isFeatured } = req.body;

    // Validations
    if (!title || title.trim().length < 5) {
      return res.status(400).json({ message: 'Title must be at least 5 characters long' });
    }

    if (!externalLink || !validator.isURL(externalLink)) {
      return res.status(400).json({ message: 'A valid external link is required' });
    }

    const resourceData = {
      title,
      description,
      category,
      tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      externalLink
    };

    const resource = new Resource(resourceData);
    await resource.save();

    // Create notification for all students
    const notification = new Notification({
      message: `New interview resource added: ${resource.title}`,
      type: 'resource',
      relatedId: resource._id,
      recipient: null // Broadcast
    });
    await notification.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('resourceUpdated');
      io.emit('new_notification', notification);
    }

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// @route   PUT api/resources/:id
// @desc    Update a resource (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, category, tags, externalLink, isFeatured } = req.body;

    let resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (title) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (category) resource.category = category;
    if (tags) resource.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    if (isFeatured !== undefined) resource.isFeatured = isFeatured === 'true' || isFeatured === true;
    
    if (externalLink) {
      if (!validator.isURL(externalLink)) {
        return res.status(400).json({ message: 'Invalid URL' });
      }
      resource.externalLink = externalLink;
    }

    await resource.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('resourceUpdated');

    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    await resource.deleteOne();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('resourceUpdated');

    res.json({ message: 'Resource deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
