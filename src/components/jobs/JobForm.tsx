"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Save, Plus } from "lucide-react"
import { IJobDoc } from "@/firebase/services/types"

interface JobFormProps {
  job?: IJobDoc | null
  onSave: (job: Omit<IJobDoc, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const JOB_STATUSES = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
]

export function JobForm({ job, onSave, onCancel, isLoading = false }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    link: job?.link || '',
    status: job?.status || 'applied',
    notes: job?.notes || ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.title.trim()) {
      setError('Job title is required')
      return
    }
    if (!formData.company.trim()) {
      setError('Company name is required')
      return
    }
    if (!formData.link.trim()) {
      setError('Job link is required')
      return
    }

    try {
      await onSave(formData)
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to save job')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {job ? (
                <>
                  <Save className="w-5 h-5" />
                  Edit Job
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add New Job
                </>
              )}
            </CardTitle>
            <CardDescription>
              {job ? 'Update job information' : 'Add a new job application to track'}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g. Tech Corp"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Job Link *</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              placeholder="https://company.com/job-posting"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent cursor-pointer"
            >
              {JOB_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any notes about this job application..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : (job ? 'Update Job' : 'Add Job')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
