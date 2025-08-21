const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { generateComponent } = require('../controllers/chatController')

router.post('/generate', auth, generateComponent)

// GET /api/chat/history/:sessionId - get all messages for a session
router.get('/history/:sessionId', auth, async (req, res) => {
  try {
    const session = await require('../db/models/Session').findById(req.params.sessionId)
    if (!session || session.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Session not found' })
    }
    res.json({ messages: session.messages })
  } catch {
    res.status(500).json({ message: 'Failed to fetch history' })
  }
})
 
module.exports = router
