# Job Seeker Platform

A modern, comprehensive job application management platform built for job seekers to track applications, manage professional profiles, and organize their career journey with an intuitive, responsive interface.

## 🛠️ Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router and Turbopack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS 4** - Modern utility-first CSS framework

### UI Components & Design

- **shadcn/ui** - Beautifully designed, accessible components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Consistent, beautiful icon library
- **Framer Motion** - Smooth animations and transitions
- **Class Variance Authority** - Type-safe component variants

### Backend & Database

- **Firebase** - Complete backend-as-a-service platform
- **Firestore** - NoSQL database for real-time data synchronization
- **Firebase Auth** - Secure user authentication and session management
- **Firebase Storage** - Cloud file storage for resumes and images
- **Firebase Cloud Functions** - Serverless backend functions for AI analysis
- **Google Gemini AI** - Advanced AI integration for job description analysis
- **Real-time Token Tracking** - Live monitoring of AI API usage with 98.4% accuracy

### State Management & Data Flow

- **React Context** - Global state management for jobs, profiles, and auth
- **Custom Hooks** - Reusable logic for data fetching and form handling
- **Local Storage** - Client-side persistence for UI preferences
- **Real-time Updates** - Live data synchronization across devices

### Development & Code Quality

- **ESLint** - Advanced linting with TypeScript, React, and accessibility rules
- **Prettier** - Consistent code formatting across the project
- **Husky** - Git hooks for pre-commit quality checks
- **lint-staged** - Optimized linting on staged files only
- **TypeScript** - Strict type checking and IntelliSense support

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-seeker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase Cloud Functions (for AI features)**

   ```bash
   cd functions
   npm install
   ```

   Configure the Gemini API key secret:

   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```

   Deploy the functions:

   ```bash
   firebase deploy --only functions
   ```

   **Optional**: Use the automated deployment script:

   ```bash
   # For Windows PowerShell
   .\scripts\deploy-token-tracking.ps1
   ```

5. **Run the development server**

   ```bash
   cd .. # Return to project root
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start development server with Turbopack         |
| `npm run build`        | Build the application for production            |
| `npm run start`        | Start the production server                     |
| `npm run lint`         | Run ESLint to check for code issues             |
| `npm run lint:fix`     | Run ESLint and automatically fix issues         |
| `npm run format`       | Format all files with Prettier                  |
| `npm run format:check` | Check if files are formatted correctly          |
| `npm run type-check`   | Run TypeScript type checking                    |
| `npm run check-all`    | Run type-check, lint, and format-check together |

### Firebase Functions Scripts (run from `/functions` directory)

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run build`  | Build Cloud Functions for deployment |
| `npm run dev`    | Start Functions development server   |
| `npm run deploy` | Deploy functions to Firebase         |
| `npm run logs`   | View Cloud Functions logs            |

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Set up Firebase Storage
5. Configure security rules (see below)
6. Copy your Firebase configuration to `.env.local`

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Job applications - users can only access their own jobs
    match /jobs/{jobId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Resumes - users can only access their own resumes
    match /resumes/{resumeId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Profiles - users can only access their own profiles
    match /profiles/{profileId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // User profiles - users can only access their own profile
    match /userProfiles/{profileId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Global token usage tracking - read-only for authenticated users
    match /global/usage {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

### Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only upload and access their own files
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /profile-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── ai-analysis/        # AI-powered job description analysis
│   │   └── components/     # Analysis-specific components
│   ├── applications/       # Job application management
│   │   └── components/     # Application-specific components
│   ├── dashboard/          # Main dashboard with overview
│   │   └── components/     # Dashboard-specific components
│   │       └── hooks/      # Dashboard-specific hooks
│   ├── login/              # User authentication
│   ├── profile/            # Complete profile management
│   │   └── components/     # Profile-specific components
│   └── signup/             # User registration
├── components/             # Reusable UI components
│   ├── application-status/ # Application status components
│   │   └── hooks/          # Status-related hooks
│   ├── icons/              # Custom icon components
│   ├── layouts/            # Layout components
│   └── ui/                 # Base UI components (shadcn/ui)
├── contexts/               # React Context providers
├── firebase/               # Firebase configuration and services
│   └── services/           # Firebase service layer
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and shared code
│   ├── constants/          # Application constants
│   ├── types/              # Type definitions
│   └── utils/              # Specialized utility modules
└── types/                  # Global TypeScript type definitions

functions/                  # Firebase Cloud Functions
├── src/
│   └── services/           # Cloud Functions services
└── lib/                    # Compiled JavaScript output

scripts/                    # Deployment and utility scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore and Storage enabled

### Quick Start

1. Clone the repository and install dependencies
2. Set up your Firebase project and configure environment variables
3. Run the development server
4. Open [http://localhost:3000](http://localhost:3000) in your browser

For detailed setup instructions, see [TOKEN_TRACKING_SETUP.md](TOKEN_TRACKING_SETUP.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for job seekers everywhere!**

This comprehensive platform helps you stay organized, track your progress, and land your dream job. Perfect for managing your entire job search process from application to offer.
