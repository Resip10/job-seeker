'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  Lock,
  AlertCircle,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { JobSeekerHero } from '@/components/jobSeekerHero';
import { signUpWithEmail, type SignupData } from '@/lib/auth';
import { showToast } from '@/lib/toast';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { APP_VERSION } from '@/lib/constants/version';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      setIsLoading(false);

      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
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
    <PublicLayout>
      <div className='min-h-screen bg-gray-50 flex'>
        <JobSeekerHero />

        {/* Right Side - Registration Form */}
        <div className='flex-1 flex items-center justify-center p-4 lg:p-8'>
          <div className='w-full max-w-md'>
            {/* Mobile Header */}
            <div className='text-center mb-8 lg:hidden'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4'>
                <Briefcase className='w-8 h-8 text-white' />
              </div>
              <h1 className='text-3xl font-bold text-slate-900 mb-2'>
                Create Account
              </h1>
              <p className='text-slate-600'>
                Join our community of job seekers
              </p>
            </div>

            <Card className='border shadow-lg bg-white'>
              <CardHeader className='space-y-1 pb-6'>
                <CardTitle className='text-2xl font-semibold text-slate-900 hidden lg:block'>
                  Create Your Account
                </CardTitle>
                <CardDescription className='text-slate-600 hidden lg:block'>
                  Join thousands of professionals finding their dream careers
                </CardDescription>
                <CardTitle className='text-xl font-semibold text-slate-900 lg:hidden'>
                  Sign Up
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-6'>
                {error && (
                  <Alert
                    variant='destructive'
                    className='border-red-200 bg-red-50'
                  >
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className='space-y-5'>
                  {/* Name Fields */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='firstName'
                        className='text-sm font-medium text-slate-700'
                      >
                        First Name
                      </Label>
                      <div className='relative group'>
                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors' />
                        <Input
                          id='firstName'
                          type='text'
                          placeholder='First name'
                          value={formData.firstName}
                          onChange={e =>
                            handleInputChange('firstName', e.target.value)
                          }
                          className='pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                          required
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='lastName'
                        className='text-sm font-medium text-slate-700'
                      >
                        Last Name
                      </Label>
                      <div className='relative group'>
                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors' />
                        <Input
                          id='lastName'
                          type='text'
                          placeholder='Last name'
                          value={formData.lastName}
                          onChange={e =>
                            handleInputChange('lastName', e.target.value)
                          }
                          className='pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='text-sm font-medium text-slate-700'
                    >
                      Email Address
                    </Label>
                    <div className='relative group'>
                      <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors' />
                      <Input
                        id='email'
                        type='email'
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
                        }
                        className='pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='password'
                      className='text-sm font-medium text-slate-700'
                    >
                      Password
                    </Label>
                    <div className='relative group'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors' />
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create a password'
                        value={formData.password}
                        onChange={e =>
                          handleInputChange('password', e.target.value)
                        }
                        className='pl-10 pr-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='confirmPassword'
                      className='text-sm font-medium text-slate-700'
                    >
                      Confirm Password
                    </Label>
                    <div className='relative group'>
                      <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors' />
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm your password'
                        value={formData.confirmPassword}
                        onChange={e =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        className='pl-10 pr-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
                        required
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='agreeToTerms'
                      checked={formData.agreeToTerms}
                      onCheckedChange={checked =>
                        handleInputChange('agreeToTerms', checked as boolean)
                      }
                      className='border-slate-300'
                      required
                    />
                    <Label
                      htmlFor='agreeToTerms'
                      className='text-sm text-slate-600 cursor-pointer'
                    >
                      I agree to the terms and conditions
                    </Label>
                  </div>

                  {/* Create Account Button */}
                  <Button
                    type='submit'
                    disabled={
                      isLoading ||
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.email ||
                      !formData.password ||
                      !formData.confirmPassword ||
                      !formData.agreeToTerms
                    }
                    className='w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium'
                  >
                    {isLoading ? (
                      <div className='flex items-center space-x-2'>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className='text-center pt-4'>
                  <p className='text-sm text-slate-600'>
                    Already have an account?{' '}
                    <Link
                      href='/login'
                      className='font-medium text-slate-900 hover:text-slate-700 transition-colors'
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>

                {/* Version */}
                <div className='text-center pt-2 border-t border-slate-100'>
                  <p className='text-xs text-slate-400'>
                    Version {APP_VERSION}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
