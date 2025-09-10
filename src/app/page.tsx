'use client';

// TODO: Create a proper landing page instead of redirecting to login
// The landing page should showcase the job seeker app features and benefits
// Include hero section, features, testimonials, and call-to-action buttons
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect root path to login page
    router.replace('/login');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-600'>Redirecting to login...</p>
      </div>
    </div>
  );
}
