# SkillSwap Chatbot API

A REST API for the SkillSwap chatbot using Google's Gemini AI.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the backend directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

4. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /chat
Send a message to the chatbot and get a response.

**Request:**
```json
{
  "message": "Hello, how can you help me?"
}
```

**Response:**
```json
{
  "reply": "Hello! I'm here to help you with SkillSwap..."
}
```

## Features

- 🤖 Powered by Google Gemini AI
- 🔄 Real-time chat responses
- 🛡️ Error handling and validation
- 🌐 CORS enabled for frontend integration
- 📝 Environment-based configuration

## Development

- **Development mode:** `npm run dev` (uses nodemon for auto-restart)
- **Production mode:** `npm start` 