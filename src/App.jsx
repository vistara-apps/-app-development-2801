import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import JobCreator from './components/JobCreator'
import JobManager from './components/JobManager'
import Settings from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [jobs, setJobs] = useState([
    {
      id: 1,
      name: 'Customer Data Augmentation',
      type: 'augmentation',
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      recordsGenerated: 50000,
      outputSize: '15.2 MB'
    },
    {
      id: 2,
      name: 'HIPAA Compliant Synthetic Records',
      type: 'compliance',
      status: 'running',
      createdAt: '2024-01-16T14:22:00Z',
      progress: 67
    },
    {
      id: 3,
      name: 'Financial Transactions Test Data',
      type: 'rule-based',
      status: 'pending',
      createdAt: '2024-01-16T16:45:00Z'
    }
  ])

  const addJob = (newJob) => {
    const job = {
      ...newJob,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
    setJobs(prev => [job, ...prev])
    setActiveTab('jobs')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard jobs={jobs} />
      case 'create':
        return <JobCreator onJobCreate={addJob} />
      case 'jobs':
        return <JobManager jobs={jobs} setJobs={setJobs} />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard jobs={jobs} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-0 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App