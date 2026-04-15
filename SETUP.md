# AI Chatbot Setup Instructions

## 🚀 Quick Setup Guide

### 1. Get Your Free Groq API Key
1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy your API key (starts with `gsk_`)

### 2. Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder:
   ```
   GROQ_API_KEY=gsk_your_actual_api_key_here
   ```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Test the Chatbot
1. Open [http://localhost:5173](http://localhost:5173)
2. Click "Get Started" to open the chat
3. Try asking health-related questions

## 🤖 Features

- **Real AI Responses**: Uses Llama 3.1 8B Instant model via Groq API
- **Professional Medical Tone**: Formal, compassionate communication style
- **Emergency Detection**: Automatically identifies and prioritizes emergency symptoms
- **Fallback System**: Provides helpful responses even if API is down
- **No Data Storage**: All conversations are temporary and confidential
- **Safety First**: Always includes medical disclaimers and emergency guidance

## 🔧 API Integration Details

The chatbot now uses:
- **API Endpoint**: `/api/chat` (POST)
- **Model**: `llama-3.1-8b-instant` (free tier)
- **Provider**: Groq (fast, reliable, free tier available)
- **Response Format**: Streaming simulation for better UX
- **Error Handling**: Graceful fallback responses

## 🛡️ Safety Features

- Emergency symptom detection (chest pain, difficulty breathing, etc.)
- Always recommends professional medical consultation
- No personal health data storage
- Clear medical disclaimers
- Fallback responses for API failures

## 📝 Sample Prompts to Try

- "What are the symptoms of seasonal flu?"
- "How can I improve my sleep quality?"
- "What should I do for a mild headache?"
- "Tips for maintaining a healthy diet"
- "When should I seek help for chest pain?"

## 🔍 Troubleshooting

### API Key Issues
- Ensure your API key starts with `gsk_`
- Check that the `.env` file is in the correct directory (`apps/web/`)
- Verify the API key has sufficient credits

### Connection Issues
- The chatbot includes automatic fallback responses
- Check your internet connection
- Verify Groq service status at [status.groq.com](https://status.groq.com)

### Development Issues
- Ensure all dependencies are installed: `npm install`
- Check that the dev server runs without errors
- Verify the API endpoint is accessible

## 🚀 Next Steps

1. **Customize System Prompt**: Edit `/src/app/api/chat/route.js` to adjust the AI personality
2. **Add More Features**: Consider adding symptom tracking, appointment reminders, etc.
3. **Deploy**: When ready, deploy to Vercel, Netlify, or your preferred platform

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your API key configuration
3. Test the API endpoint directly
4. Review the fallback responses for basic functionality

---

*Remember: This AI assistant provides information and guidance, not medical advice. Always consult healthcare professionals for medical concerns.*
