const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);

    if (error.message.includes('querySrv')) {
      console.log('\nTIP: It looks like a DNS/Network issue with "mongodb+srv://".');
      console.log('Try using the "Standard Connection String" (mongodb://...) from MongoDB Atlas.');
    }

    console.log('\nAttempting to use In-Memory Database (Temp)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('WARNING: Data will not persist after server restart.');
    } catch (memError) {
      console.error(`In-Memory DB failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
