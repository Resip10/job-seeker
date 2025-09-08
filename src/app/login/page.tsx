"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Briefcase, Mail, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { JobSeekerHero } from "@/components/jobSeekerHero"
import { signInWithEmail, type LoginData } from "@/lib/auth"
import { PublicLayout } from "@/components/layouts/PublicLayout"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmail(formData as LoginData)
      console.log("Login successful", userCredential.user)
      
      // Redirect to dashboard after successful login
      router.push("/dashboard")
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Invalid email or password. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex">
        <JobSeekerHero />

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-600">Sign in to continue your job search</p>
            </div>

            <Card className="border shadow-lg bg-white">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-slate-900 hidden lg:block">Welcome Back</CardTitle>
                <CardDescription className="text-slate-600 hidden lg:block">
                  Sign in to access your job seeker dashboard
                </CardDescription>
                <CardTitle className="text-xl font-semibold text-slate-900 lg:hidden">Sign In</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-slate-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>


                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.password}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-600">
                  New to our platform?{" "}
                  <Link href="/signup" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
                    Create your free account
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
          </div>

        </div>
      </div>
    </PublicLayout>
  )
}
