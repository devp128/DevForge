// Usage: node scripts/deleteUserSessions.js <userId>
const mongoose = require('mongoose');
const Session = require('../db/models/Session');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function deleteUserSessions(userId) {
  if (!userId) {
    console.error('Please provide a userId as an argument.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
 
  try {
    const result = await Session.deleteMany({ userId });
    console.log(`Deleted ${result.deletedCount} sessions for userId: ${userId}`);
  } catch (err) {
    console.error('Error deleting sessions:', err);
  } finally {
    mongoose.disconnect();
  }
}

// Accept userId from command line or hardcode for quick use
const userId = process.argv[2] || '6881c030ca4098d38cbda84b';
deleteUserSessions(userId);
