# Job Seeker Platform

A modern, responsive web application built for job seekers to manage their career journey. Track job applications, manage application status, and organize your job search process with a clean, intuitive interface.

## 🛠️ Technologies Used

### Frontend
- **Next.js** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind** - Utility-first CSS framework

### UI Components
- **Radix UI** - Accessible component primitives and themes
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variant management

### Backend & Database
- **Firebase** - Authentication and database services
- **Firestore** - NoSQL database for job application storage
- **Firebase Auth** - User authentication and session management

### State Management
- **React Context** - Global state management for jobs and authentication
- **Custom Hooks** - Reusable logic for data fetching and state updates

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

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
    match /jobs/{jobId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   └── signup/           # Registration page
├── components/            # Reusable UI components
│   ├── jobs/             # Job management components
│   ├── layouts/          # Layout components
│   └── ui/               # Base UI components
├── contexts/             # React Context providers
├── firebase/             # Firebase configuration and services
│   └── services/         # Firestore service layer
├── lib/                  # Utility functions and shared code
└── types/                # TypeScript type definitions
```

---

**Note**: This is a fully functional job application tracker with authentication, CRUD operations, and a modern user interface. Perfect for managing your job search process!