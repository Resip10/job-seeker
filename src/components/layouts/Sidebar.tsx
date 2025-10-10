'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  Settings,
  PanelLeft,
  LogOut,
  Brain,
} from 'lucide-react';
import { signOutUser } from '@/lib/auth';
import { APP_VERSION } from '@/lib/constants/version';
import { Logo } from '@/components/icons/Logo';

interface SidebarProps {
  className?: string;
}

const mainMenuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    enabled: true,
  },
  {
    title: 'Applications',
    href: '/applications',
    icon: Briefcase,
    enabled: true,
  },
  {
    title: 'AI Job Analysis',
    href: '/ai-analysis',
    icon: Brain,
    enabled: true,
  },
  {
    title: 'Saved Jobs',
    href: '/saved-jobs',
    icon: Bookmark,
    enabled: false, // No saved jobs page yet
  },
];

const otherMenuItems = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    enabled: false, // No settings page yet
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-slate-200'>
        {!isCollapsed && (
          <div className='flex items-center space-x-3'>
            <Logo size={32} className='text-slate-900' />
            <h1 className='text-lg font-bold text-slate-900'>Applyo</h1>
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='h-8 w-8 p-0 cursor-pointer'
        >
          <PanelLeft className='w-4 h-4' />
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className='flex-1 p-4 space-y-2'>
        <div className='space-y-1'>
          {mainMenuItems.map(item => {
            const isActive = pathname === item.href;
            const isDisabled = !item.enabled;

            if (isDisabled) {
              return (
                <div
                  key={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <item.icon className='w-5 h-5 flex-shrink-0' />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  isCollapsed && 'justify-center'
                )}
              >
                <item.icon className='w-5 h-5 flex-shrink-0' />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>

        <Separator className='my-4' />

        {/* Other Menu Items */}
        <div className='space-y-1'>
          {otherMenuItems.map(item => {
            const isActive = pathname === item.href;
            const isDisabled = !item.enabled;

            if (isDisabled) {
              return (
                <div
                  key={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-not-allowed',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <item.icon className='w-5 h-5 flex-shrink-0' />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  isCollapsed && 'justify-center'
                )}
              >
                <item.icon className='w-5 h-5 flex-shrink-0' />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className='p-4 border-t border-slate-200 space-y-3'>
        {!isCollapsed && (
          <div className='px-3 text-xs text-slate-400'>
            Version {APP_VERSION}
          </div>
        )}
        <Button
          variant='ghost'
          onClick={handleLogout}
          className={cn(
            'w-full justify-start text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className='w-5 h-5 flex-shrink-0' />
          {!isCollapsed && <span className='ml-3'>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
