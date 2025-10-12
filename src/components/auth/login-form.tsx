'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { signInWithEmail, type LoginData } from '@/lib/auth';
import { showToast } from '@/lib/toast';
import { Logo } from '@/components/icons/Logo';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmail(formData as LoginData);
      showToast.success('Welcome back!', 'You have successfully signed in.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      setError('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col items-center mb-2'>
          <Logo size={48} className='text-primary mb-3' />
          <h1 className='text-3xl font-bold text-slate-900 mb-1'>Applyo</h1>
        </div>
        <CardTitle className='text-xl text-center'>Login</CardTitle>
        <CardDescription className='text-center'>
          Welcome back! Continue your journey to success.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Password</Label>
            </div>
            <Input
              id='password'
              type='password'
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              required
            />
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className='mt-4 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='underline cursor-pointer'>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
