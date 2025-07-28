// Usage: node scripts/getUserSessions.js <userId>
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Session = require('../db/models/Session');

async function main() {
  const userId = process.argv[2] || '6886703c7a59560257f2e9e8';
  if (!userId) {
    console.error('Please provide a userId as an argument.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const sessions = await Session.find({ userId });
  if (!sessions.length) {
    console.log('No sessions found for user:', userId);
  } else {
    sessions.forEach((session, idx) => {
      console.log(`\nSession #${idx + 1}:`);
      console.log('Session ID:', session._id);
      console.log('Title:', session.title);
      console.log('Created:', session.createdAt);
      console.log('Updated:', session.updatedAt);
      console.log('Current Code:', session.currentCode);
      console.log('Messages:');
      session.messages.forEach((msg, i) => {
        console.log(`  [${i + 1}] ${msg.type}: ${msg.content}`);
      });
    });
  }
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
