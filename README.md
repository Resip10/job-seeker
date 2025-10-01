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
│   │   ├── components/     # Analysis-specific components
│   │   │   ├── AIAnalysisPageContent.tsx # Main analysis page content
│   │   │   ├── AnalysisResults.tsx       # Display analysis results
│   │   │   ├── JobInputForm.tsx          # Job description input form
│   │   │   └── TokenUsageDisplay.tsx     # Real-time token usage tracking
│   │   ├── utils.ts        # Analysis utility functions
│   │   └── page.tsx        # Main AI analysis page
│   ├── applications/       # Job application management page
│   ├── dashboard/          # Main dashboard with overview
│   ├── login/             # User authentication
│   ├── profile/           # Complete profile management
│   ├── signup/            # User registration
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── OverviewSection.tsx      # Stats and quick actions
│   │   ├── ProfileCompletionCard.tsx # Profile progress tracking
│   │   ├── SummaryCard.tsx          # Application statistics
│   │   └── StatusItem.tsx           # Status indicators
│   ├── jobs/              # Job management components
│   │   ├── JobCard.tsx    # Individual job application card
│   │   ├── JobForm.tsx    # Add/edit job application form
│   │   └── JobList.tsx    # Job applications list with filtering
│   ├── profile/           # Profile management components
│   │   ├── EducationSection.tsx     # Education management
│   │   ├── ExperienceSection.tsx    # Work experience management
│   │   ├── ProfileHeader.tsx        # Personal information
│   │   ├── ProfileLinksSection.tsx  # Additional profile links
│   │   ├── ProfilePageContent.tsx   # Main profile page layout
│   │   ├── ResumeSection.tsx        # Resume management
│   │   ├── SkillsSection.tsx        # Skills management
│   │   └── SocialLinksSection.tsx   # Social media links
│   ├── layouts/           # Layout components
│   │   ├── AppLayout.tsx  # Main application layout with sidebar
│   │   ├── PrivateLayout.tsx        # Authenticated user layout
│   │   ├── PublicLayout.tsx         # Public pages layout
│   │   └── Sidebar.tsx              # Navigation sidebar
│   ├── icons/             # Custom icon components
│   │   ├── GitHubIcon.tsx
│   │   ├── LinkedInIcon.tsx
│   │   └── XIcon.tsx
│   ├── ui/                # Base UI components (shadcn/ui)
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── card-actions.tsx
│   │   ├── checkbox.tsx
│   │   ├── empty-state.tsx
│   │   ├── form-field.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading-state.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   └── jobSeekerHero.tsx  # Landing page hero component
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state management
│   ├── JobsContext.tsx    # Job applications state management
│   └── ProfileContext.tsx # Profiles and resumes state management
├── firebase/              # Firebase configuration and services
│   ├── config.ts          # Firebase app configuration
│   └── services/          # Firebase service layer
│       ├── aiAnalysis.ts  # AI job analysis service
│       ├── constants.ts   # Application constants
│       ├── error-handling.ts # Error handling utilities
│       ├── index.ts       # Service exports
│       ├── jobs.ts        # Job applications service
│       ├── profiles.ts    # User profiles service
│       ├── resumes.ts     # Resume management service
│       ├── storage.ts     # Firebase Storage operations
│       ├── tokenUsage.ts  # Real-time token usage tracking
│       ├── types.ts       # TypeScript interfaces
│       ├── userProfiles.ts # User profile data service
│       └── validation.ts  # Data validation utilities
├── hooks/                 # Custom React hooks
│   ├── useForm.ts         # Form state management hook
│   └── useTokenUsage.ts   # Real-time token usage tracking hook
├── lib/                   # Utility functions and shared code
│   ├── auth.ts            # Authentication utilities
│   ├── utils.ts           # General utility functions
│   └── utils/             # Specialized utility modules
│       ├── date.ts        # Date formatting utilities
│       ├── error-handling.ts # Error handling utilities
│       ├── form.ts        # Form validation utilities
│       └── validation.ts  # Data validation utilities
└── types/                 # Global TypeScript type definitions

# Configuration Files
├── .prettierrc           # Prettier code formatting configuration
├── .prettierignore       # Files to ignore for Prettier formatting
├── .lintstagedrc.json    # lint-staged configuration for pre-commit hooks
├── .husky/               # Git hooks directory
│   └── pre-commit        # Pre-commit hook for code quality checks
├── eslint.config.mjs     # ESLint configuration with strict rules
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts

# Firebase Cloud Functions
functions/
├── src/
│   ├── index.ts           # Main Cloud Functions entry point
│   ├── helpers.ts         # Utility functions for job processing
│   ├── prompts.ts         # AI prompt templates and formatting
│   └── services/          # Cloud Functions services
│       └── tokenTracker.ts # Token usage tracking and management
├── package.json           # Functions dependencies
├── tsconfig.json          # TypeScript configuration for functions
└── .eslintrc.js          # ESLint configuration for functions

# Additional Files
├── scripts/               # Deployment and utility scripts
│   └── deploy-token-tracking.ps1 # Automated deployment script
├── IMPLEMENTATION_SUMMARY.md      # Technical implementation details
└── TOKEN_TRACKING_SETUP.md       # Token tracking setup guide
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
