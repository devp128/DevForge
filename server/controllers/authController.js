const User = require('../db/models/User')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({ email, password, name })
    await user.save()

    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
