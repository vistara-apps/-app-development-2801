import React from 'react'
import { 
  TrendingUp, 
  Database, 
  Shield, 
  Activity,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = ({ jobs }) => {
  const stats = [
    {
      label: 'Total Datasets Generated',
      value: '847',
      icon: Database,
      change: '+12.5%',
      trend: 'up'
    },
    {
      label: 'Privacy Score',
      value: '98.7%',
      icon: Shield,
      change: '+2.1%',
      trend: 'up'
    },
    {
      label: 'Active Jobs',
      value: jobs.filter(j => j.status === 'running').length.toString(),
      icon: Activity,
      change: '+5',
      trend: 'up'
    },
    {
      label: 'Data Volume (GB)',
      value: '152.3',
      icon: TrendingUp,
      change: '+8.9%',
      trend: 'up'
    }
  ]

  const weeklyData = [
    { day: 'Mon', generated: 25, anonymized: 18 },
    { day: 'Tue', generated: 32, anonymized: 28 },
    { day: 'Wed', generated: 18, anonymized: 15 },
    { day: 'Thu', generated: 45, anonymized: 38 },
    { day: 'Fri', generated: 38, anonymized: 32 },
    { day: 'Sat', generated: 22, anonymized: 19 },
    { day: 'Sun', generated: 15, anonymized: 12 }
  ]

  const statusData = [
    { name: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: '#10B981' },
    { name: 'Running', value: jobs.filter(j => j.status === 'running').length, color: '#3B82F6' },
    { name: 'Pending', value: jobs.filter(j => j.status === 'pending').length, color: '#F59E0B' },
    { name: 'Failed', value: jobs.filter(j => j.status === 'failed').length, color: '#EF4444' }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Monitor your synthetic data generation activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-dark-card rounded-lg p-6 border border-gray-700 hover:border-accent/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-lg">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-dark-card rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Bar dataKey="generated" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="anonymized" fill="#10B981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Status Distribution */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Job Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-dark-card rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Jobs</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {jobs.slice(0, 5).map((job) => (
            <div key={job.id} className="p-6 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusIcon(job.status)}
                  <div>
                    <h4 className="font-medium text-white">{job.name}</h4>
                    <p className="text-sm text-gray-400 capitalize">{job.type.replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {job.status === 'running' && job.progress && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{job.progress}%</span>
                    </div>
                  )}
                  {job.status === 'completed' && (
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent rounded-md hover:bg-accent/30 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Download</span>
                    </button>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard