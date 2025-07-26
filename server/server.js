const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const chatRoutes = require('./routes/chat')
const sessionRoutes = require('./routes/sessions')

const app = express()

// Render-Alive
if (process.env.KEEP_ALIVE_URL) {
  const axios = require('axios');
  setInterval(() => {
    axios.get(process.env.KEEP_ALIVE_URL)
      .then(() => console.log('Website reloaded'))
      .catch(error => console.error(`Keep-alive error: ${error.message}`));
  }, 300000); // 5 minutes
}



app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000', // Vercel or local
    'http://localhost:3000'
  ],
  credentials: true
}))
app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/sessions', sessionRoutes)


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
