import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  MoreVertical
} from 'lucide-react'

const JobManager = ({ jobs, setJobs }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedJobs, setSelectedJobs] = useState([])

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    running: { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    failed: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleJobAction = (jobId, action) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        switch (action) {
          case 'start':
            return { ...job, status: 'running', progress: 0 }
          case 'pause':
            return { ...job, status: 'pending' }
          case 'delete':
            return null
          default:
            return job
        }
      }
      return job
    }).filter(Boolean))
  }

  const handleSelectJob = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const handleSelectAll = () => {
    setSelectedJobs(
      selectedJobs.length === filteredJobs.length 
        ? [] 
        : filteredJobs.map(job => job.id)
    )
  }

  const getTypeDisplayName = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    if (typeof bytes === 'string') return bytes
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Manager</h1>
          <p className="text-gray-400">Monitor and manage your data generation jobs</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {filteredJobs.length} of {jobs.length} jobs
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-dark-card rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-primary border-b border-gray-700">
              <tr>
                <th className="text-left p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                    onChange={handleSelectAll}
                    className="text-accent focus:ring-accent focus:ring-2 bg-gray-700 border-gray-600 rounded"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Job Name</th>
                <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Created</th>
                <th className="text-left p-4 text-gray-300 font-medium">Output</th>
                <th className="text-left p-4 text-gray-300 font-medium w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredJobs.map((job) => {
                const StatusIcon = statusConfig[job.status]?.icon || Clock
                const statusColor = statusConfig[job.status]?.color || 'text-gray-500'
                const statusBg = statusConfig[job.status]?.bg || 'bg-gray-500/10'

                return (
                  <tr key={job.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={() => handleSelectJob(job.id)}
                        className="text-accent focus:ring-accent focus:ring-2 bg-gray-700 border-gray-600 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{job.name}</div>
                        {job.description && (
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {job.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        {getTypeDisplayName(job.type)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-full ${statusBg}`}>
                          <StatusIcon className={`w-3 h-3 ${statusColor}`} />
                        </div>
                        <span className={`text-sm font-medium capitalize ${statusColor}`}>
                          {job.status}
                        </span>
                        {job.status === 'running' && job.progress && (
                          <div className="flex items-center gap-2 ml-2">
                            <div className="w-16 bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-accent h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{job.progress}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {job.recordsGenerated ? `${job.recordsGenerated.toLocaleString()} records` : '-'}
                      {job.outputSize && (
                        <div className="text-xs text-gray-500">{formatFileSize(job.outputSize)}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {job.status === 'pending' && (
                          <button
                            onClick={() => handleJobAction(job.id, 'start')}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors"
                            title="Start Job"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'running' && (
                          <button
                            onClick={() => handleJobAction(job.id, 'pause')}
                            className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded transition-colors"
                            title="Pause Job"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'completed' && (
                          <button
                            className="p-2 text-accent hover:text-accent/80 hover:bg-accent/10 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleJobAction(job.id, 'delete')}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              {searchTerm || filterStatus !== 'all' ? (
                <p>No jobs match your current filters.</p>
              ) : (
                <p>No jobs created yet. Create your first job to get started.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-dark-card border border-gray-700 rounded-lg p-4 shadow-lg animate-slide-up">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button 
                onClick={() => setSelectedJobs([])}
                className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobManager