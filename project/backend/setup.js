const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('🔧 Setting up environment file...');
  
  // Create .env file with placeholder
  const envContent = `GEMINI_API_KEY=your_gemini_api_key_here

# Get your API key from: https://makersuite.google.com/app/apikey
# Replace 'your_gemini_api_key_here' with your actual API key`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log('📝 Please edit .env file and add your Gemini API key');
  console.log('🔗 Get your API key from: https://makersuite.google.com/app/apikey');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🚀 To start the server:');
console.log('   npm run dev'); 