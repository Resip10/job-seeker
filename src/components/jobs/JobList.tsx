"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JobCard } from "./JobCard"
import { JobForm } from "./JobForm"
import { IJobDoc, IJobQueryOptions } from "@/firebase/services/types"
import { Plus, Search, Filter, X } from "lucide-react"

interface JobListProps {
  jobs: IJobDoc[]
  onAddJob: (job: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  onUpdateJob: (jobId: string, updates: Partial<IJobDoc>) => Promise<void>
  onDeleteJob: (jobId: string) => Promise<void>
  isLoading?: boolean
  onFilterChange?: (filters: IJobQueryOptions) => void
}

const STATUS_FILTERS = [
  { value: '', label: 'All Statuses' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
]

export function JobList({ 
  jobs, 
  onAddJob, 
  onUpdateJob, 
  onDeleteJob, 
  isLoading = false,
  onFilterChange 
}: JobListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<IJobDoc | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleAddJob = async (jobData: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    await onAddJob(jobData)
    setShowForm(false)
  }

  const handleEditJob = async (jobData: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (editingJob) {
      await onUpdateJob(editingJob.id, jobData)
      setEditingJob(null)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    await onDeleteJob(jobId)
  }

  const handleEdit = (job: IJobDoc) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // You could implement search logic here or pass it up to parent
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    if (onFilterChange) {
      onFilterChange({
        filters: value ? { status: value } : undefined
      })
    }
  }

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || job.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    const counts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Job Applications</h2>
          <p className="text-slate-600">Track and manage your job applications</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {STATUS_FILTERS.slice(1).map(status => (
          <Card key={status.value} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">
                {statusCounts[status.value] || 0}
              </div>
              <div className="text-sm text-slate-600">{status.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Search & Filter</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs by title or company..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  {STATUS_FILTERS.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <JobForm
              job={editingJob}
              onSave={editingJob ? handleEditJob : handleAddJob}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Plus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm || statusFilter ? 'No jobs found' : 'No jobs yet'}
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding your first job application'
              }
            </p>
            {!searchTerm && !statusFilter && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Job
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDeleteJob}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  )
}
