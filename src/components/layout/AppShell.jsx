import React from 'react'

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}