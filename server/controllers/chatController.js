const Session = require('../db/models/Session')
const { generateComponent } = require('../utils/openrouter')
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

    // Try to get history from Redis cache
    let fullHistory = await getSessionCache(session._id);
    if (!fullHistory) {
      // If not in Redis, use MongoDB and cache it
      fullHistory = session.messages;
      await setSessionCache(session._id, fullHistory);
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
