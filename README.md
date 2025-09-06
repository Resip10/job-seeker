# Job Seeker Platform

A modern, responsive web application built for job seekers to manage their career journey. This MVP (Minimum Viable Product) provides essential authentication features and a clean dashboard interface.

## 🛠️ Technologies Used

### Frontend
- **Next.js** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind** - Utility-first CSS framework

### UI Components
- **Radix UI** - Accessible component primitives
  - Checkbox, Label, Separator, Slot
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variant management

### Authentication
- **Firebase 12.2.1** - Backend authentication service

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
   # Add other Firebase config variables
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
3. Copy your Firebase configuration to `.env.local`

---

**Note**: This is an MVP version focused on core authentication features. Additional job-seeking features will be added in future iterations.