"use client"

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

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'applied': return 'default'
    case 'interview': return 'secondary'
    case 'offer': return 'default'
    case 'rejected': return 'destructive'
    case 'withdrawn': return 'outline'
    default: return 'outline'
  }
}

const getStatusClassName = (status: string) => {
  switch (status) {
    case 'applied': return 'bg-primary/10 text-primary border-primary/20'
    case 'interview': return 'bg-warning/10 text-warning border-warning/20'
    case 'offer': return 'bg-success/10 text-success border-success/20'
    case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'withdrawn': return 'bg-text-light/10 text-text-light border-text-light/20'
    default: return 'bg-text-light/10 text-text-light border-text-light/20'
  }
}

export function JobCard({ job, onEdit, onDelete, isLoading = false }: JobCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      onDelete(job.id)
    }
  }

  return (
    <Card className="hover:shadow-card transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-h3 text-text-dark truncate">
              {job.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Building2 className="w-4 h-4 text-text-light" />
              <span className="truncate text-text-medium">{job.company}</span>
            </CardDescription>
          </div>
          <Badge 
            variant={getStatusVariant(job.status)}
            className={`ml-2 ${getStatusClassName(job.status)}`}
          >
            {STATUS_LABELS[job.status as keyof typeof STATUS_LABELS] || job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Job Link */}
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-text-light" />
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-primary hover:text-primary/80 hover:underline truncate"
            >
              View Job Posting
            </a>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-text-light mt-0.5" />
              <p className="text-body text-text-medium line-clamp-2">{job.notes}</p>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-4 text-caption text-text-light">
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
          <div className="flex gap-2 pt-2 border-t border-border">
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
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
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
