# Student Feedback System

Anonymous student feedback with an admin-only analytics portal, served by Express with EJS templates.

## Features
- Server-rendered routes with EJS
- Anonymous feedback submission form for students
- Admin dashboard, feedback review, analytics, and profile pages
- Email/password login for students and admin users
- Google Sign-In for student and admin login flows
- CSV export, demo seeding, and filter controls

## Routes
- `/` - student login
- `/feedback` - student feedback form (authenticated student only)
- `/contact` - contact form
- `/admin/login` - admin login

- `/admin` - admin overview
- `/admin/feedback` - feedback review and filters
- `/admin/analytics` - analytics visualizations
- `/admin/profile` - admin account overview
- `*` - custom not found page

## Local Storage Keys
- `feedbacks` - anonymous feedback entries cache used by the UI

## Environment Variables
Create a `.env` file in the project root:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/student-feedback-system
JWT_SECRET=replace-with-a-strong-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

Google Sign-In requires a Web OAuth Client from Google Cloud Console.
Add your local origin (for example `http://localhost:3000`) to Authorized JavaScript origins.

## Run Locally
```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
