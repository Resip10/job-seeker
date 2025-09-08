"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, LogOut, AlertCircle, Plus } from "lucide-react"
import { signOutUser } from "@/lib/auth"
import { PrivateLayout } from "@/components/layouts/PrivateLayout"
import { JobsProvider, useJobs } from "@/contexts/JobsContext"
import { ProfileProvider } from "@/contexts/ProfileContext"
import { useAuth } from "@/contexts/AuthContext"
import { JobList } from "@/components/jobs/JobList"
import { JobForm } from "@/components/jobs/JobForm"
import { ProfileSection } from "@/components/profile/ProfileSection"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { IJobDoc } from "@/firebase/services/types"
import { formatWeekdayDate, getTimeOfDay } from "@/lib/utils/date"

function DashboardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { jobs, loading, error, addJob, updateJobById, deleteJobById } = useJobs()
  const [showJobForm, setShowJobForm] = useState(false)
  
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

  // Get status counts for the welcome section
  const getStatusCounts = () => {
    const counts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return counts
  }

  const statusCounts = getStatusCounts()
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User'

  const handleAddJob = async (jobData: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    await addJob(jobData)
    setShowJobForm(false)
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
        <div className="mb-6">
          {/* Date and Greeting Row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-text-light mb-1">
                {formatWeekdayDate()}
              </div>
              <h1 className="text-3xl font-bold text-text-dark">
                Good {getTimeOfDay()}, {userName}
              </h1>
            </div>
            <Button size="sm" className="h-9" onClick={() => setShowJobForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Button>
          </div>

          {/* Summary Card */}
          <SummaryCard statusCounts={statusCounts} />
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

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <JobForm
                onSave={handleAddJob}
                onCancel={() => setShowJobForm(false)}
                isLoading={loading}
              />
            </div>
          </div>
        )}

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
