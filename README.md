 # NexusAI 🤖

<div align="center">
  <img src="frontend/public/images/logo.png" alt="NexusAI Logo" width="200">
  <br>
  <p><strong>Your gateway to the world's most powerful AI models</strong></p>
</div>

## 🌟 Overview

NexusAI is an elegant, high-performance chat application that connects you to multiple state-of-the-art AI models through a single unified interface. Experience seamless conversations with leading AI technologies including GPT-4o, Grok, Dolphin, DeepSeek, and Claude Sonnet - all without switching between different platforms.

With its sleek dark theme, mobile-responsive design, and innovative features, NexusAI delivers a premium AI interaction experience that adapts to your needs and preferences.

## ✨ Key Features

- **Multi-Model Access** - Chat with 5 leading AI models from a single interface
- **Visual Queries** - Send images to compatible models for analysis and discussion
- **Markdown Rendering** - Beautifully formatted responses with syntax highlighting
- **Customizable Theme** - Choose from multiple accent colors to personalize your experience
- **Copy-to-Clipboard** - Easily save and use AI responses with one-click copying
- **Mobile-Responsive Design** - Perfect experience on any device
- **Progressive Web App** - Install on your device for offline access
- **API Usage Tracking** - Monitor your API consumption

## 🔧 Technologies

NexusAI is built with modern web technologies:

- **Frontend**: Svelte, Vite, PWA
- **Backend**: Node.js, Express
- **API**: CloseRouter (providing access to multiple AI models)
- **Storage**: LocalForage for client-side persistence
- **Styling**: Custom CSS with dynamic theming

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- CloseRouter API key ([sign up here](https://closerouter.com))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/nexusai.git
cd nexusai
```

2. **Set up environment variables**

```bash
# In the backend directory
cp .env.example .env
# Edit .env and add your CloseRouter API key
```

3. **Install dependencies and build**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies and build
cd ../frontend
npm install
npm run build
```

4. **Start the server**

```bash
cd ../backend
npm start
```

5. **Open your browser and navigate to [http://localhost:3000](http://localhost:3000)**

## 📱 Usage

### Chatting with AI Models

1. Select your preferred AI model from the dropdown menu
2. Type your message or question in the input field
3. For compatible models, attach images using the image upload button
4. Receive AI responses with rich formatting and code highlighting
5. Copy responses to clipboard with a single click

### Customizing Your Experience

- Click the color palette icon to change your theme accent color
- View your API usage statistics to monitor consumption
- Install as a PWA for offline access by clicking "Add to Home Screen" in your browser

## 🖼️ Screenshots

<div align="center">
  <img src="docs/images/screenshot-chat.png" alt="NexusAI Chat Interface" width="80%">
  <p><em>The main chat interface with model selection</em></p>
  <br>
  <img src="docs/images/screenshot-mobile.png" alt="NexusAI on Mobile" width="40%">
  <p><em>Responsive design for mobile devices</em></p>
</div>

## 🏗️ Architecture

NexusAI follows a client-server architecture:

- **Frontend**: Svelte application handling UI rendering and local state management
- **Backend**: Express server acting as a secure proxy to the CloseRouter API
- **API**: Communication with various AI models through the CloseRouter unified API

### Data Flow

1. User sends a message through the frontend interface
2. Message is processed by the Svelte application and sent to the backend server
3. Backend adds authentication and forwards the request to CloseRouter
4. CloseRouter routes the request to the appropriate AI model
5. Response flows back through the same path to the user interface

## 📚 API Models

NexusAI provides access to the following AI models:

| Model | Provider | Image Support | Specialized For |
|-------|----------|---------------|-----------------|
| GPT-4o | OpenAI | ✅ | General-purpose, visual understanding |
| Grok-3 | xAI | ✅ | Creative, unrestricted responses |
| Dolphin | Mistral AI | ❌ | Uncensored, open conversation |
| DeepSeek | DeepSeek | ❌ | Technical and scientific topics |
| Claude Sonnet | Anthropic | ✅ | Thoughtful, nuanced answers |

## 🛠️ Development

### Running in development mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Project Structure

```
nexusai/
├── frontend/          # Svelte frontend application
├── backend/           # Express backend server
├── docs/              # Documentation and assets
└── README.md          # This file
```

## 📄 License

NexusAI is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [CloseRouter](https://closerouter.com) for providing the unified AI API
- The teams behind GPT-4, Grok, Dolphin, DeepSeek, and Claude for their amazing AI models
- [Svelte](https://svelte.dev) and [Vite](https://vitejs.dev) for the excellent frontend development experience

---

<div align="center">
  <p>Built with ❤️ by Noah</p>
  <p>© 2025 NexusAI</p>
</div>