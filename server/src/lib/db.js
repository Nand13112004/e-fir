const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecourt';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'ecourt' });
}

module.exports = connectDb;


