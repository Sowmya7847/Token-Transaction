const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    // Default to MongoDB Atlas connection if not specified
    const mongoURI = process.env.MONGODB_URI || 
      'mongodb+srv://Sowmya:YOUR_PASSWORD@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n📋 TO FIX:');
    console.error('1. Update MONGODB_URI in .env file with your password');
    console.error('2. Format: mongodb+srv://Sowmya:YOUR_PASSWORD@cluster0.zccv28f.mongodb.net/token-system');
    console.error('3. Replace YOUR_PASSWORD with your actual MongoDB Atlas password');
    console.error('4. Make sure MongoDB Atlas Network Access allows your IP address');
    console.error('5. Check MongoDB Atlas cluster is running\n');
    process.exit(1);
  }
};

module.exports = connectDB;

