import React from 'react'
import { Shield, BarChart3, Plus, FileText, Settings, CreditCard, Database, Users } from 'lucide-react'
import { clsx } from 'clsx'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'new-job', label: 'New Job', icon: Plus },
  { id: 'jobs', label: 'My Jobs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export function Sidebar({ currentPage, onPageChange }) {
  return (
    <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-accent" />
          <div>
            <h1 className="text-lg font-bold text-dark-text">SampleShield Pro</h1>
            <p className="text-xs text-dark-muted">Synthetic Data Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    currentPage === item.id
                      ? 'bg-accent text-white'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-border'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-dark-border">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark-text">Pro Plan</p>
              <p className="text-xs text-dark-muted">5GB / month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}