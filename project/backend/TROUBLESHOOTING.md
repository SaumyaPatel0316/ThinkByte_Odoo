# Chatbot Troubleshooting Guide

## Common Issues and Solutions

### 1. "Sorry, I'm having trouble connecting right now"

**Problem**: The frontend can't connect to the backend API.

**Solutions**:

#### Check if backend is running:
```bash
cd project/backend
npm run test
```

#### If backend is not running:
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   npm run setup
   ```

3. **Add your Gemini API key:**
   - Edit the `.env` file
   - Replace `your_gemini_api_key_here` with your actual API key
   - Get your key from: https://makersuite.google.com/app/apikey

4. **Start the server:**
   ```bash
   npm run dev
   ```

#### If you see "ECONNREFUSED":
- Make sure the backend is running on port 3000
- Check if another process is using port 3000
- Try a different port by editing `index.js`

### 2. "Server error: Failed to get response from Gemini API"

**Problem**: The backend is running but can't connect to Gemini API.

**Solutions**:
- Verify your API key is correct
- Check if you have sufficient Gemini API quota
- Ensure your API key has access to the Gemini Pro model

### 3. Backend starts but immediately crashes

**Problem**: Missing dependencies or configuration.

**Solutions**:
1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check .env file exists:**
   ```bash
   npm run setup
   ```

3. **Verify all required packages:**
   ```bash
   npm list express axios cors dotenv
   ```

### 4. CORS errors in browser console

**Problem**: Frontend can't make requests to backend.

**Solutions**:
- Make sure CORS is enabled in `index.js`
- Check that frontend is making requests to correct URL
- Verify backend is running on the expected port

### 5. Port 3000 already in use

**Problem**: Another application is using port 3000.

**Solutions**:
1. **Find what's using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

2. **Kill the process or change port:**
   - Kill the process using the port
   - Or change the port in `index.js`:
     ```javascript
     const PORT = 3001; // Change to different port
     ```
   - Update frontend URL in `Chatbot.tsx`:
     ```javascript
     const response = await fetch('http://localhost:3001/chat', {
     ```

## Quick Diagnostic Commands

### Test Backend Connection:
```bash
cd project/backend
npm run test
```

### Check if server is running:
```bash
curl http://localhost:3000/chat -X POST -H "Content-Type: application/json" -d '{"message":"test"}'
```

### Check environment setup:
```bash
cd project/backend
node -e "require('dotenv').config(); console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Missing')"
```

## Environment Variables

Make sure your `.env` file contains:
```
GEMINI_API_KEY=your_actual_api_key_here
```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Backend not running | Start with `npm run dev` |
| `ENOTFOUND` | Wrong URL | Check frontend URL |
| `401 Unauthorized` | Invalid API key | Update `.env` file |
| `429 Too Many Requests` | API quota exceeded | Wait or upgrade plan |
| `500 Internal Server Error` | Backend error | Check server logs |

## Getting Help

1. **Check server logs** for detailed error messages
2. **Verify API key** is valid and has proper permissions
3. **Test with curl** to isolate frontend/backend issues
4. **Check network connectivity** to Google's servers

## Development Tips

- Use `npm run dev` for auto-restart on file changes
- Check browser console for frontend errors
- Monitor backend console for server errors
- Test API endpoints with Postman or curl 