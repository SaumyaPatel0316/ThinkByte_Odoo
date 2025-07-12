# Admin Credentials
admin mail : mike@example.com
password: demo


# SkillSwap - AI-Powered Skill Exchange Platform

A modern web application for connecting people who want to exchange skills, featuring AI-powered assistance and a comprehensive user experience.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login system with password reset functionality
- **Profile Management**: Complete user profiles with skills, availability, and ratings
- **Skill Browsing**: Discover users with compatible skills
- **Swap Requests**: Send and manage skill exchange requests
- **Messaging System**: Real-time chat between users
- **Rating System**: Rate and review completed swaps
- **Dark Mode**: Full dark mode support throughout the app

### AI Features
- **Chatbot Assistant**: AI-powered help using Google Gemini
- **Smart Matching**: Intelligent skill matching between users
- **Real-time Notifications**: Toast notifications for all actions

### Technical Features
- **Responsive Design**: Works on all devices
- **Local Storage**: Data persistence without external database
- **TypeScript**: Full type safety
- **React Router**: Client-side routing
- **Tailwind CSS**: Modern styling with utility classes

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Heroicons** for icons

### Backend (Chatbot)
- **Node.js** with Express
- **Google Gemini AI** for chatbot responses
- **CORS** enabled for frontend integration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Frontend Setup

1. **Navigate to the project directory:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5174`

### Backend Setup (Chatbot)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   npm run setup
   ```

4. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Edit the `.env` file and replace `your_gemini_api_key_here` with your actual key

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Register/Login**: Create an account or use demo credentials
2. **Complete Profile**: Add your skills, availability, and location
3. **Browse Skills**: Find users with compatible skills
4. **Send Requests**: Request skill exchanges with other users
5. **Chat**: Use the messaging system to coordinate
6. **Rate**: Provide feedback after completed swaps

### Password Reset Flow

1. **Forgot Password**: Click "Forgot your password?" on the login page
2. **Enter Email**: Provide your registered email address
3. **Receive Email**: Get a password reset link (simulated in demo)
4. **Reset Password**: Set a new password and confirm it
5. **Login**: Use your new password to log in

### Demo Accounts

Use these demo accounts to test the platform:

- **Alex Johnson**: `alex@example.com` / `demo`
- **Sarah Chen**: `sarah@example.com` / `demo`
- **Mike Rodriguez**: `mike@example.com` / `demo` (Admin)

### Chatbot Usage

- Click the chat bubble in the bottom-right corner
- Ask questions about SkillSwap features
- Get help with profile setup, finding users, or general questions

## 📁 Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # Business logic and API calls
│   └── types/              # TypeScript type definitions
├── backend/                # Chatbot API server
│   ├── index.js           # Express server
│   ├── package.json       # Backend dependencies
│   └── setup.js           # Environment setup script
└── public/                # Static assets
```

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run setup` - Set up environment file

### Key Components

- **AuthContext**: User authentication and session management
- **ThemeContext**: Dark/light mode management
- **ToastContext**: Notification system
- **localStorageService**: Data persistence layer
- **Chatbot**: AI-powered assistance

## 🌟 Features in Detail

### User Management
- Secure authentication with password protection
- Profile completeness tracking
- Public/private profile settings
- User ratings and swap history

### Skill Exchange
- Smart skill matching algorithm
- Request management (pending, accepted, completed)
- Rating and feedback system
- Real-time notifications

### Messaging
- Real-time chat between users
- Conversation management
- Message history and read status

### AI Assistant
- Powered by Google Gemini AI
- Context-aware responses
- Help with platform usage
- Skill recommendations

## 🎨 Design System

- **Colors**: Blue primary, with semantic colors for success/error
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing using Tailwind's scale
- **Components**: Reusable, accessible components
- **Dark Mode**: Full dark mode support with smooth transitions

## 🔒 Security

- Client-side data validation
- Secure password handling
- CORS protection for API
- Environment variable protection

## 🚀 Deployment

### Frontend
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

### Backend
The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the documentation
- Use the in-app chatbot
- Create an issue on GitHub

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI** 
