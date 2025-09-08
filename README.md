# Job Seeker Platform

A modern, responsive web application built for job seekers to manage their career journey. Track job applications, manage application status, organize your job search process, and maintain your professional profiles with a clean, intuitive interface.

## 🛠️ Technologies Used

### Frontend
- **Next.js** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - Beautifully designed, accessible components built with Radix UI primitives
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variant management

### Backend & Database
- **Firebase** - Complete backend-as-a-service platform
- **Firestore** - NoSQL database for job applications, profiles, and resumes
- **Firebase Auth** - User authentication and session management
- **Firebase Storage** - Cloud file storage for resume uploads

### State Management
- **React Context** - Global state management for jobs, profiles, and authentication
- **Custom Hooks** - Reusable logic for data fetching and state updates
- **Context Providers** - JobsContext, ProfileContext, and AuthContext for organized state management

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
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check for code issues |

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Set up Firestore security rules (see below)
5. Copy your Firebase configuration to `.env.local`

### Firestore Security Rules
Add these rules to your Firestore database for secure data access:

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
  }
}
```

### Firebase Storage Security Rules
Add these rules to your Firebase Storage for secure file access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only upload and access their own resume files
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page with job management
│   ├── login/            # User login page with authentication
│   ├── signup/           # User registration page
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing page
├── components/            # Reusable UI components
│   ├── jobs/             # Job management components
│   │   ├── JobCard.tsx   # Individual job application card
│   │   ├── JobForm.tsx   # Add/edit job application form
│   │   └── JobList.tsx   # Job applications list with search/filter
│   ├── profile/          # Profile management components
│   │   └── ProfileSection.tsx # Professional profiles management
│   ├── layouts/          # Layout components
│   │   ├── PrivateLayout.tsx  # Authenticated user layout
│   │   ├── PublicLayout.tsx   # Public pages layout
│   │   ├── DashboardLayout.tsx # Dashboard layout with sidebar
│   │   └── Sidebar.tsx        # Collapsible navigation sidebar
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── SummaryCard.tsx    # Job application statistics
│   │   └── StatusItem.tsx     # Status indicator component
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── jobSeekerHero.tsx # Landing page hero component
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state management
│   ├── JobsContext.tsx   # Job applications state management
│   └── ProfileContext.tsx # Profiles and resumes state management
├── firebase/             # Firebase configuration and services
│   ├── config.ts         # Firebase app configuration
│   └── services/         # Firebase service layer
│       ├── firestore.ts  # Firestore database operations
│       ├── storage.ts    # Firebase Storage operations
│       ├── types.ts      # TypeScript interfaces for data models
│       ├── constants.ts  # Application constants
│       ├── validation.ts # Data validation utilities
│       └── error-handling.ts # Error handling utilities
├── lib/                  # Utility functions and shared code
│   ├── auth.ts           # Authentication utilities
│   ├── utils.ts          # General utility functions
│   └── utils/            # Specialized utility modules
│       ├── date.ts       # Date formatting utilities
│       ├── validation.ts # Form validation utilities
│       └── error-handling.ts # Error handling utilities
└── types/                # Global TypeScript type definitions
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

### First Steps
1. **Sign Up** - Create a new account with your email
2. **Add Job Applications** - Start tracking your job applications
3. **Upload Resumes** - Store different versions of your resume
4. **Manage Profiles** - Add your professional profile links
5. **Track Progress** - Monitor your application status and statistics

---

**Note**: This is a comprehensive job application management platform. Perfect for organizing and tracking your entire job search process!