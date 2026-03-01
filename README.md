# Student Feedback System

Anonymous student feedback with an admin-only analytics portal, served by Express with EJS templates.

## Features
- Server-rendered routes with EJS
- Anonymous feedback submission form for students
- Admin dashboard, feedback review, analytics, and profile pages
- Local admin setup/login flow in browser storage
- CSV export, demo seeding, and filter controls

## Routes
- `/` - student feedback form
- `/contact` - contact form
- `/admin/login` - admin login
- `/admin/setup` - create local admin account
- `/admin` - admin overview
- `/admin/feedback` - feedback review and filters
- `/admin/analytics` - analytics visualizations
- `/admin/profile` - admin account overview
- `*` - custom not found page

## Local Storage Keys
- `users` - local admin accounts
- `user` - current admin session
- `feedbacks` - anonymous feedback entries

## Run Locally
```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
