const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Session = require('../db/models/Session');

// POST /api/sessions - create a new blank session for the authenticated user
router.post('/', auth, async (req, res) => {
  try {
    const Session = require('../db/models/Session');
    const session = new Session({
      userId: req.user.userId,
      title: 'New Session',
      messages: [],
      currentCode: { jsx: '', css: '' }
    });
    await session.save();
    res.status(201).json({ sessionId: session._id, title: session.title });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// GET /api/sessions - list all sessions for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select('_id title createdAt updatedAt');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

module.exports = router;
