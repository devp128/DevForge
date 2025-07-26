const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Session'
  },
  messages: [messageSchema],
  currentCode: {
    jsx: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Session', sessionSchema)
