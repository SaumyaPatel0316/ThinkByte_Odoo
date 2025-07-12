const axios = require('axios');

async function testBackend() {
  try {
    console.log('🧪 Testing backend connection...');
    
    const response = await axios.post('http://localhost:3000/chat', {
      message: 'Hello, are you working?'
    });
    
    console.log('✅ Backend is working!');
    console.log('Response:', response.data.reply);
    
  } catch (error) {
    console.log('❌ Backend test failed');
    console.log('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Make sure you\'re in the backend directory: cd project/backend');
      console.log('2. Install dependencies: npm install');
      console.log('3. Set up environment: npm run setup');
      console.log('4. Add your Gemini API key to .env file');
      console.log('5. Start the server: npm run dev');
    }
  }
}

testBackend(); 