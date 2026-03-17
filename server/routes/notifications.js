import express from 'express';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/notifications
// @desc    Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    // Get notifications for the user or broadcast notifications (recipient: null)
    const notifications = await Notification.find({
      $or: [
        { recipient: req.user.id },
        { recipient: null }
      ]
    }).sort({ createdAt: -1 }).limit(50);

    // Map to include isRead for broadcast notifications
    const mappedNotifications = notifications.map(notif => {
      const obj = notif.toObject();
      if (!obj.recipient) {
        obj.isRead = obj.readBy.some(id => id.toString() === req.user.id);
      }
      delete obj.readBy; // Don't send the full readBy array
      return obj;
    });

    res.json(mappedNotifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    // Check if it's a broadcast or for this user
    if (notification.recipient && notification.recipient.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (!notification.recipient) {
      // Broadcast notification
      if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
      }
    } else {
      // Specific user notification
      notification.isRead = true;
    }

    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/notifications/read-all
// @desc    Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    // For specific user notifications
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    // For broadcast notifications
    await Notification.updateMany(
      { recipient: null, readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
