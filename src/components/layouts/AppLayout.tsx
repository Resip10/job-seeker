'use client';

import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='flex h-screen bg-slate-50'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-y-auto'>{children}</main>
      </div>
    </div>
  );
}
