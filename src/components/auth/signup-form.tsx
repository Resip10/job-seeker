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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { signUpWithEmail, type SignupData } from '@/lib/auth';
import { showToast } from '@/lib/toast';
import { Logo } from '@/components/icons/Logo';

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setIsLoading(false);

      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
      setIsLoading(false);

      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions.');
      setIsLoading(false);

      return;
    }

    try {
      await signUpWithEmail(formData as SignupData);
      showToast.success(
        'Welcome!',
        'Your account has been created successfully.'
      );
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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
        <CardTitle className='text-xl text-center'>Sign Up</CardTitle>
        <CardDescription className='text-center'>
          Start your journey to success today.
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
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='firstName'>First name</Label>
              <Input
                id='firstName'
                type='text'
                placeholder='John'
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='lastName'>Last name</Label>
              <Input
                id='lastName'
                type='text'
                placeholder='Doe'
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
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
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              placeholder='At least 6 characters'
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input
              id='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={e =>
                handleInputChange('confirmPassword', e.target.value)
              }
              required
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='terms'
              checked={formData.agreeToTerms}
              onCheckedChange={checked =>
                handleInputChange('agreeToTerms', checked as boolean)
              }
            />
            <Label
              htmlFor='terms'
              className='text-sm font-normal cursor-pointer'
            >
              I agree to the terms and conditions
            </Label>
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <div className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <Link href='/login' className='underline cursor-pointer'>
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
