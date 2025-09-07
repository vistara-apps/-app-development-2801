import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function DashboardLayout({ children, currentPage, onPageChange }) {
  return (
    <div className="flex h-screen">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}