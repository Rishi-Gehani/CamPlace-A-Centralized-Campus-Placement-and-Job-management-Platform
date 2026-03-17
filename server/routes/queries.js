import express from 'express';
const router = express.Router();
import Query from '../models/Query.js';
import Notification from '../models/Notification.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { auth } from '../middleware/auth.js';
import { sendQueryConfirmationEmail, sendQueryReplyEmail } from '../utils/mailer.js';

// @route   POST api/queries
// @desc    Submit a contact query
router.post('/', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Basic required check
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Name validation
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return res.status(400).json({ message: 'Names should be 2-50 characters long and contain only letters.' });
    }

    // Email validation
    if (!email || !email.endsWith('@somaiya.edu')) {
      return res.status(400).json({ message: 'Please use your official @somaiya.edu email address.' });
    }

    // Message validation
    if (message.length < 10 || message.length > 1000) {
      return res.status(400).json({ message: 'Message should be between 10 and 1000 characters.' });
    }

    const newQuery = new Query({
      firstName,
      lastName,
      email,
      subject,
      message,
      userId: req.user.id
    });

    await newQuery.save();

    // Send confirmation email
    sendQueryConfirmationEmail(newQuery);

    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/queries
// @desc    Get all queries (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/queries/:id/reply
// @desc    Reply to a query (Admin only)
router.put('/:id/reply', adminAuth, async (req, res) => {
  try {
    const { reply } = req.body;
    let query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    query.adminReply = reply;
    query.status = 'replied';
    await query.save();

    // Create notification for the user who raised the query
    if (query.userId) {
      const notification = new Notification({
        message: `Your query has been resolved: ${query.subject}`,
        type: 'query',
        relatedId: query._id,
        recipient: query.userId
      });
      await notification.save();

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(query.userId.toString()).emit('new_notification', notification);
      }
    }

    // Send reply email
    sendQueryReplyEmail(query, reply);

    res.json(query);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
