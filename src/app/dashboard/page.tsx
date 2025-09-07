"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, LogOut, User, AlertCircle } from "lucide-react"
import { signOutUser } from "@/lib/auth"
import { PrivateLayout } from "@/components/layouts/PrivateLayout"
import { JobsProvider, useJobs } from "@/contexts/JobsContext"
import { ProfileProvider } from "@/contexts/ProfileContext"
import { JobList } from "@/components/jobs/JobList"
import { ProfileSection } from "@/components/profile/ProfileSection"

function DashboardContent() {
  const router = useRouter()
  const { jobs, loading, error, addJob, updateJobById, deleteJobById } = useJobs()
  
  const handleLogout = async () => {
    try {
      await signOutUser()
      console.log("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/login")
    }
  }

  return (
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
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Welcome to Your Dashboard
              </CardTitle>
              <CardDescription className="text-slate-600">
                Track and manage your job applications in one place
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Section */}
        <ProfileSection />

        {/* Jobs Management */}
        <JobList
          jobs={jobs}
          onAddJob={addJob}
          onUpdateJob={updateJobById}
          onDeleteJob={deleteJobById}
          isLoading={loading}
        />
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <PrivateLayout>
      <ProfileProvider>
        <JobsProvider>
          <DashboardContent />
        </JobsProvider>
      </ProfileProvider>
    </PrivateLayout>
  )
}
