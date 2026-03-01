# 🎓 Student Feedback System

> A modern, anonymous student feedback platform with powerful analytics and admin controls

A comprehensive student feedback solution built with React that allows students to submit anonymous feedback about courses, teachers, and academic experiences. Features a dedicated admin portal with real-time analytics, data visualization, and feedback management capabilities.

## ✨ Features

### For Students
- 📝 **Anonymous Submission** - Submit feedback without revealing identity
- 🎯 **Course & Teacher Feedback** - Targeted feedback for specific courses or instructors
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 💬 **Contact Form** - Direct communication channel with administration

### For Administrators
- 📊 **Analytics Dashboard** - Visual insights into feedback trends and patterns
- 🔍 **Advanced Filtering** - Filter feedback by course, teacher, date, or sentiment
- 📥 **CSV Export** - Download feedback data for further analysis
- 🎲 **Demo Data Generator** - Seed the system with sample data for testing
- 👤 **Admin Account Management** - Secure admin setup and profile management
- 📈 **Real-time Statistics** - Track submission counts, response rates, and trends

### Design & UX
- 🎨 **Academic Theme** - Warm, professional color scheme designed for educational settings
- ♿ **Accessible** - Built with accessibility best practices
- ⚡ **Fast & Lightweight** - Optimized performance with Vite and React
- 🔒 **Privacy-First** - All data stored locally in browser (localStorage)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-feedback-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### First-Time Setup

1. Visit `/admin/setup` to create your first admin account
2. Use the credentials to login at `/admin/login`
3. Optionally, seed demo data from the admin dashboard
4. Start collecting feedback!

## 📖 Usage Guide

### Student Access
Students can access the feedback form at the root URL (`/`) and submit anonymous feedback without any authentication required.

### Admin Access
Administrators must login to access protected routes:

1. **Login**: Navigate to `/admin/login`
2. **Dashboard**: View overview statistics and recent submissions
3. **Feedback Management**: Review, filter, and export all feedback
4. **Analytics**: Deep dive into feedback data with visualizations
5. **Profile**: Manage admin account settings

## 🗺️ Application Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Student feedback submission form |
| `/contact` | Public | Contact form for general inquiries |
| `/admin/login` | Public | Admin authentication page |
| `/admin/setup` | Public | First-time admin account creation |
| `/admin` | Protected | Admin dashboard overview |
| `/admin/feedback` | Protected | Feedback inbox and management |
| `/admin/analytics` | Protected | Analytics and data visualization |
| `/admin/profile` | Protected | Admin profile and settings |

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM 7.13.0
- **Styling**: Tailwind CSS 4.1.18
- **Code Quality**: ESLint
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

```
student-feedback-system/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, and media files
│   ├── components/      # Reusable React components
│   │   └── Navbar.jsx   # Navigation component
│   ├── pages/           # Page components (routes)
│   │   ├── AdminSetup.jsx
│   │   ├── Analytics.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FeedbackForm.jsx
│   │   ├── FeedbackList.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   └── Toast.jsx
│   ├── utils/           # Utility functions and helpers
│   │   ├── feedbackStore.js  # Feedback state management
│   │   └── storage.js        # localStorage utilities
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── eslint.config.js     # ESLint configuration
```

## 💾 Data Storage

This application uses browser localStorage for data persistence:

| Key | Description |
|-----|-------------|
| `users` | Admin account credentials and profiles |
| `user` | Current admin session data |
| `feedbacks` | All anonymous feedback submissions |

**⚠️ Important**: This is a demo application. All data is stored locally in the browser and will be lost if:
- Browser storage is cleared
- Browsing in incognito/private mode
- Cache is cleared
- Different browser or device is used

For production use, implement a backend API with database storage.

## 🔧 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint
```

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

The optimized production files will be generated in the `dist` directory.

### Deploy to Static Hosting

This application can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder or connect your Git repository
- **GitHub Pages**: Use GitHub Actions to deploy from the `dist` folder
- **Cloudflare Pages**: Connect your repository and set build command to `npm run build`

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check your terminal output for the actual port number.

### Data Not Persisting
Ensure you're not in private/incognito mode and that your browser allows localStorage.

### Admin Login Issues
If you forget your admin credentials, you can:
1. Open browser DevTools (F12)
2. Go to Application/Storage → Local Storage
3. Delete the `users` and `user` keys
4. Revisit `/admin/setup` to create a new admin account

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔮 Future Enhancements

- [ ] Backend API integration with database
- [ ] Email notifications for new feedback
- [ ] Sentiment analysis of feedback text
- [ ] Multi-language support
- [ ] File attachments in feedback
- [ ] Feedback response/reply system
- [ ] User authentication for students (optional)
- [ ] Dark mode toggle
- [ ] Export to multiple formats (PDF, Excel)
- [ ] Customizable feedback forms

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and passes ESLint checks.

## 📄 License

This project is open source and available for educational purposes.

## 📧 Contact

For questions, suggestions, or issues, please use the contact form at `/contact` or open an issue in the repository.

---

**Made with ❤️ for educational institutions**
