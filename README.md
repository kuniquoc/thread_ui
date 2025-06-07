# 🧵 Thread UI - Social Media Platform

> A modern, feature-rich social media application built with React, TypeScript, and Vite. Experience seamless social networking with real-time updates, interactive threads, and elegant user interface.

## ✨ Features

### 🏠 Core Social Features
- **Thread Creation & Management** - Post, edit, and delete threads with rich content support
- **Real-time Comments & Replies** - Engage in threaded conversations with instant updates
- **Like & Repost System** - Express appreciation and share content with your network
- **Follow/Unfollow Users** - Build your social network and curate your feed
- **User Profiles** - Comprehensive profile management with avatar uploads

### 🔍 Discovery & Interaction
- **Advanced Search** - Find users and content with intelligent search functionality
- **Personalized Feeds** - Home feed and following feed for tailored content experience
- **Real-time Notifications** - Stay updated with instant push notifications via Pusher
- **User Discovery** - Explore and connect with new users in the community

### 👤 User Experience
- **Authentication System** - Secure login, registration, and password management
- **Profile Customization** - Edit profile information, change passwords, and upload avatars
- **Responsive Design** - Beautiful, modern UI optimized for all devices
- **Dark Theme** - Elegant dark mode interface with gradient accents

### 🔧 Technical Features
- **Real-time Updates** - Powered by Pusher for instant content synchronization
- **Image Upload** - Support for image attachments in threads
- **CSRF Protection** - Secure API communications with CSRF token handling
- **Type Safety** - Comprehensive TypeScript implementation for robust development

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Backend API** server running (for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/thread_ui.git
   cd thread_ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_IMGBB_API_KEY=your_actual_imgbb_api_key
   VITE_API_BASE_URL=http://localhost:8000
   VITE_PUSHER_APP_KEY=your_pusher_app_key
   VITE_PUSHER_CLUSTER=your_pusher_cluster
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🛠️ Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tool and dev server

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Beautiful icon library

### State Management & Routing
- **React Router DOM 7** - Client-side routing
- **Custom Hooks** - Modular state management approach

### Real-time & Utilities
- **Pusher JS** - Real-time WebSocket connections
- **date-fns** - Modern date utility library
- **classnames** - Conditional CSS class management

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Modal, Toast, Input)
│   ├── notification/    # Notification-related components
│   ├── profile/         # Profile management components
│   ├── search/          # Search functionality components
│   └── thread/          # Thread and comment components
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication logic
│   ├── useThread.tsx    # Thread operations
│   ├── useUser.tsx      # User management
│   └── ...              # Other specialized hooks
├── pages/               # Page components
├── routes/              # Routing configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── config/              # Configuration files
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

This project uses:
- **ESLint** with React and TypeScript rules
- **TypeScript strict mode** for maximum type safety
- **Modern ES modules** with Vite

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_IMGBB_API_KEY` | API key for image upload service | Yes |
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_PUSHER_APP_KEY` | Pusher application key | Yes |
| `VITE_PUSHER_CLUSTER` | Pusher cluster region | Yes |

## 🌐 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Platforms

This application can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting service**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Pusher** for real-time communication capabilities

---

<div align="center">
  <p>Built with ❤️ using React, TypeScript, and modern web technologies</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
