// Server startup verification script
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Verifying server configuration...\n');

// Check environment variables
const checks = {
  'PORT': process.env.PORT || '3000',
  'SESSION_SECRET': process.env.SESSION_SECRET ? '✅ Set' : '⚠️  Using default',
  'MONGODB_URI': process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'
};

console.log('Environment Variables:');
Object.entries(checks).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

if (!process.env.MONGODB_URI) {
  console.log('\n❌ ERROR: MONGODB_URI is not set in .env file');
  console.log('📋 Please create a .env file with your MongoDB connection string');
  console.log('   See ENV_TEMPLATE.txt for reference\n');
  process.exit(1);
}

// Test MongoDB connection
console.log('\n🔌 Testing MongoDB connection...');
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}\n`);
  mongoose.connection.close();
  console.log('✅ All checks passed! Server is ready to start.');
  console.log('🚀 Run: npm start\n');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ MongoDB connection failed!');
  console.log(`   Error: ${error.message}\n`);
  console.log('📋 TO FIX:');
  console.log('1. Check your MONGODB_URI in .env file');
  console.log('2. Make sure MongoDB Atlas Network Access allows your IP');
  console.log('3. Verify your MongoDB password is correct\n');
  process.exit(1);
});

