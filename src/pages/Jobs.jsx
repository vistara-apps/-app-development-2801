import React, { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Download, Eye, MoreVertical, Filter } from 'lucide-react'

const jobs = [
  {
    id: 1,
    name: 'Customer Demographics',
    type: 'Rule-Based',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:45:00Z',
    recordCount: 10000,
    fileSize: '2.4 MB',
    downloadUrl: '#'
  },
  {
    id: 2,
    name: 'Transaction History Augmentation',
    type: 'AI Augmentation',
    status: 'running',
    createdAt: '2024-01-14T15:20:00Z',
    progress: 65,
    recordCount: 50000,
  },
  {
    id: 3,
    name: 'Medical Records Anonymization',
    type: 'Anonymization',
    status: 'completed',
    createdAt: '2024-01-13T09:15:00Z',
    completedAt: '2024-01-13T09:32:00Z',
    recordCount: 5000,
    fileSize: '1.8 MB',
    downloadUrl: '#'
  },
  {
    id: 4,
    name: 'Marketing Analytics Data',
    type: 'Rule-Based',
    status: 'failed',
    createdAt: '2024-01-12T14:45:00Z',
    error: 'Invalid schema configuration',
    recordCount: 25000,
  },
  {
    id: 5,
    name: 'Financial Dataset Enhancement',
    type: 'AI Augmentation',
    status: 'queued',
    createdAt: '2024-01-11T11:30:00Z',
    recordCount: 75000,
  },
]

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20' },
  running: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
  failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-900/20' },
  queued: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-900/20' },
}

export function Jobs() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true
    return job.status === filter
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark-text">My Jobs</h1>
          <p className="text-dark-muted">Manage and monitor your data generation jobs</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-dark-muted" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Job Name</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Type</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Status</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Records</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Created</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => {
                const StatusIcon = statusConfig[job.status].icon
                return (
                  <tr key={job.id} className="border-b border-dark-border hover:bg-dark-border/30 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="text-dark-text font-medium">{job.name}</p>
                        {job.status === 'failed' && job.error && (
                          <p className="text-red-400 text-xs mt-1">{job.error}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-dark-muted">{job.type}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${statusConfig[job.status].bg}`}>
                          <StatusIcon className={`w-3 h-3 ${statusConfig[job.status].color}`} />
                        </div>
                        <span className="text-sm text-dark-muted capitalize">{job.status}</span>
                        {job.status === 'running' && job.progress && (
                          <span className="text-xs text-dark-muted">({job.progress}%)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-dark-muted">{job.recordCount.toLocaleString()}</td>
                    <td className="py-4 text-dark-muted">{formatDate(job.createdAt)}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        {job.status === 'completed' && (
                          <>
                            <button className="p-1 hover:bg-dark-border rounded transition-colors">
                              <Eye className="w-4 h-4 text-dark-muted" />
                            </button>
                            <button className="p-1 hover:bg-dark-border rounded transition-colors">
                              <Download className="w-4 h-4 text-dark-muted" />
                            </button>
                          </>
                        )}
                        <button className="p-1 hover:bg-dark-border rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-dark-muted" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}