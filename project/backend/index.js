// index.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3002;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // Check if API key is set
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    // Provide mock responses when no API key is set
    const mockResponses = {
      'hello': "Hello! I'm your SkillSwap assistant. How can I help you today?",
      'help': "I can help you with:\n• Browsing users and skills\n• Setting up your profile\n• Sending swap requests\n• Using the messaging system\n• Understanding the rating system",
      'profile': "To update your profile:\n1. Go to your Profile page\n2. Click 'Edit Profile'\n3. Add your skills, location, and availability\n4. Save your changes",
      'browse': "To browse users:\n1. Click 'Browse Skills' in the navigation\n2. Use filters to find specific skills or locations\n3. Click 'Send Swap Request' on any user card",
      'request': "To send a swap request:\n1. Find a user with compatible skills\n2. Click 'Send Swap Request'\n3. Select what you can teach and what you want to learn\n4. Add an optional message\n5. Submit the request",
      'message': "To use messaging:\n1. Go to the Messages tab\n2. Select a conversation\n3. Type your message and press Enter\n4. Messages are real-time between users",
      'rating': "After completing a swap:\n1. Go to your Swap Requests\n2. Find the completed swap\n3. Click 'Rate Swap'\n4. Give a rating and feedback\n5. This helps other users know your experience"
    };

    const lowerMessage = userMessage.toLowerCase();
    let reply = "I'm here to help with SkillSwap! Ask me about browsing users, setting up your profile, sending requests, messaging, or ratings.";

    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(key)) {
        reply = response;
        break;
      }
    }

    res.json({ reply });
    return;
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userMessage }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
    res.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from Gemini API." });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 Gemini Chatbot API is running at http://localhost:${PORT}`);
}); 