const Session = require('../db/models/Session')
const { generateComponent } = require('../utils/openrouterQwen')
const { getSessionCache, setSessionCache } = require('../utils/redis')

exports.generateComponent = async (req, res) => {
  try {
    const { sessionId, prompt, history } = req.body
    const userId = req.user.userId

    // Get or create session
    let session = sessionId ? await Session.findById(sessionId) : null
    if (!session) {
      session = new Session({
        userId,
        title: prompt.substring(0, 50) + '...',
        messages: []
      })
      await session.save()
    }

    // Try to get history from Redis cache, but fall back to MongoDB if Redis is down
    let fullHistory;
    try {
      fullHistory = await getSessionCache(session._id);
    } catch (e) {
      console.warn('Redis unavailable, falling back to MongoDB:', e.message);
      fullHistory = null;
    }
    if (!fullHistory) {
      fullHistory = session.messages;
      // Optionally try to set cache if Redis comes back
      try { await setSessionCache(session._id, fullHistory); } catch {}
    }

    // Generate component using AI
    const aiResponse = await generateComponent(prompt, fullHistory, session.currentCode);

    // Update session and Redis
    const newMessages = [
      ...fullHistory,
      { type: 'user', content: prompt },
      { type: 'ai', content: aiResponse.message }
    ];
    session.messages = newMessages;
    // If this is the first user message, update the title
    if (newMessages.length === 2) {
      session.title = prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '');
    }
    session.currentCode = aiResponse.code;
    await session.save();
    await setSessionCache(session._id, newMessages);

    // (No Redis cache, MongoDB only)

    res.json({
      sessionId: session._id,
      message: aiResponse.message,
      code: aiResponse.code
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Failed to generate component' })
  }
}
