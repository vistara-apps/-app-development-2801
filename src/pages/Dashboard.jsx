import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Database, Shield, Zap, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const jobsData = [
  { name: 'Jan', jobs: 12 },
  { name: 'Feb', jobs: 19 },
  { name: 'Mar', jobs: 15 },
  { name: 'Apr', jobs: 25 },
  { name: 'May', jobs: 22 },
  { name: 'Jun', jobs: 30 },
]

const dataTypesData = [
  { name: 'User Data', value: 35, color: '#3B82F6' },
  { name: 'Financial', value: 25, color: '#10B981' },
  { name: 'Healthcare', value: 20, color: '#F59E0B' },
  { name: 'Marketing', value: 20, color: '#EF4444' },
]

const recentJobs = [
  { id: 1, name: 'Customer Demographics', type: 'Rule-Based', status: 'completed', createdAt: '2024-01-15' },
  { id: 2, name: 'Transaction History', type: 'AI Augmentation', status: 'running', createdAt: '2024-01-14' },
  { id: 3, name: 'Medical Records', type: 'Anonymization', status: 'completed', createdAt: '2024-01-13' },
  { id: 4, name: 'Marketing Analytics', type: 'Rule-Based', status: 'failed', createdAt: '2024-01-12' },
]

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-dark-text">Dashboard</h1>
        <p className="text-dark-muted">Monitor your synthetic data generation activity</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm">Total Jobs</p>
              <p className="text-2xl font-bold text-dark-text">143</p>
            </div>
            <Database className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm">Data Generated</p>
              <p className="text-2xl font-bold text-dark-text">2.4 GB</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm">Active Jobs</p>
              <p className="text-2xl font-bold text-dark-text">5</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-muted text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-dark-text">96%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Monthly Jobs</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Bar dataKey="jobs" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-text mb-4">Data Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataTypesData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {dataTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {dataTypesData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-dark-muted">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Jobs */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Jobs</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-2 text-dark-muted text-sm font-medium">Name</th>
                <th className="text-left py-2 text-dark-muted text-sm font-medium">Type</th>
                <th className="text-left py-2 text-dark-muted text-sm font-medium">Status</th>
                <th className="text-left py-2 text-dark-muted text-sm font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id} className="border-b border-dark-border">
                  <td className="py-3 text-dark-text">{job.name}</td>
                  <td className="py-3 text-dark-muted">{job.type}</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      {job.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {job.status === 'running' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {job.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <span className="text-sm text-dark-muted capitalize">{job.status}</span>
                    </div>
                  </td>
                  <td className="py-3 text-dark-muted">{job.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}