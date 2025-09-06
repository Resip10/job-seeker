"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink, Calendar, Building2, FileText } from "lucide-react"
import { IJobDoc } from "@/firebase/services/types"
import { formatDate } from "@/lib/utils/date"

interface JobCardProps {
  job: IJobDoc
  onEdit: (job: IJobDoc) => void
  onDelete: (jobId: string) => void
  isLoading?: boolean
}

const STATUS_LABELS = {
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'applied': return 'blue'
    case 'interview': return 'yellow'
    case 'offer': return 'green'
    case 'rejected': return 'red'
    case 'withdrawn': return 'gray'
    default: return 'gray'
  }
}

export function JobCard({ job, onEdit, onDelete, isLoading = false }: JobCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      onDelete(job.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-slate-900 truncate">
              {job.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="truncate">{job.company}</span>
            </CardDescription>
          </div>
          <Badge 
            variant="soft"
            color={getStatusColor(job.status)}
            className="ml-2"
          >
            {STATUS_LABELS[job.status as keyof typeof STATUS_LABELS] || job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Job Link */}
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
            >
              View Job Posting
            </a>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-500 mt-0.5" />
              <p className="text-sm text-slate-600 line-clamp-2">{job.notes}</p>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {formatDate(job.createdAt)}</span>
            </div>
            {job.updatedAt && job.updatedAt !== job.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {formatDate(job.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(job)}
              disabled={isLoading}
              className="flex-1"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
