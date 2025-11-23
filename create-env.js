// Helper script to create .env file
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 MongoDB Atlas .env File Creator\n');
console.log('=====================================\n');

rl.question('Enter your MongoDB Atlas password: ', (password) => {
  // URL encode special characters
  const encodedPassword = encodeURIComponent(password);
  
  const envContent = `PORT=3000
SESSION_SECRET=${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://Sowmya:${encodedPassword}@cluster0.zccv28f.mongodb.net/token-system?retryWrites=true&w=majority
`;

  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ .env file created successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Make sure Network Access is allowed in MongoDB Atlas');
  console.log('2. Run: node server.js');
  console.log('3. Your app will connect to MongoDB Atlas!\n');
  
  rl.close();
});

