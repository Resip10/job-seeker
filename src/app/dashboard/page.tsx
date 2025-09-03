"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, LogOut, User } from "lucide-react"
import { signOutUser } from "@/lib/auth"
import { PrivateLayout } from "@/components/layouts/PrivateLayout"

export default function DashboardPage() {
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await signOutUser()
      console.log("Logged out successfully")
      // Redirect to login page after logout
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect even if logout fails
      router.push("/login")
    }
  }

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Title */}
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Job Seeker</h1>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-10 px-4 border-slate-200 hover:bg-slate-50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900">
                Welcome to Your Dashboard
              </CardTitle>
              <CardDescription className="text-lg text-slate-600">
                You&#39;re successfully logged in! This is your personal job seeker dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">
                  🎉 Congratulations!
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  You&#39;ve successfully accessed your dashboard. This is where you&#39;ll be able to:
                </p>
                <ul className="mt-4 text-left text-slate-600 space-y-2 max-w-md mx-auto">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Browse and search for job opportunities
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Track your job applications
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Manage your profile and resume
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                    Connect with potential employers
                  </li>
                </ul>
              </div>

              <div className="text-sm text-slate-500">
                <p>
                  More features coming soon! Stay tuned for updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </PrivateLayout>
  )
}
