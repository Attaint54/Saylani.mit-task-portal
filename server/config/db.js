const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri || uri.startsWith('mongodb+srv')) {
      const isAtlasDown = uri && uri.startsWith('mongodb+srv');
      if (!uri || isAtlasDown) {
        console.log('Starting in-memory MongoDB...');
        mongoServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'olx-clone',
          },
        });
        uri = mongoServer.getUri();
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  if (mongoServer) await mongoServer.stop();
  process.exit(0);
});

module.exports = connectDB;
