import React, { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Dashboard } from './pages/Dashboard'
import { NewJob } from './pages/NewJob'
import { Jobs } from './pages/Jobs'
import { Settings } from './pages/Settings'
import { Billing } from './pages/Billing'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'new-job':
        return <NewJob />
      case 'jobs':
        return <Jobs />
      case 'settings':
        return <Settings />
      case 'billing':
        return <Billing />
      default:
        return <Dashboard />
    }
  }

  return (
    <AppShell>
      <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </DashboardLayout>
    </AppShell>
  )
}

export default App