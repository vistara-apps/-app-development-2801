import React from 'react'
import { Bell, Search, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-dark-surface border-b border-dark-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" />
            <input
              type="text"
              placeholder="Search jobs, datasets..."
              className="form-input pl-10 w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-dark-border rounded-md transition-colors">
            <Bell className="w-4 h-4 text-dark-muted" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="text-dark-text font-medium">John Doe</p>
              <p className="text-dark-muted">john@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}