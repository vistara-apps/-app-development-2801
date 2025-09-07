import React from 'react'
import { 
  Shield, 
  Home, 
  Plus, 
  Layers, 
  Settings, 
  BarChart3,
  Database,
  Lock,
  Sparkles
} from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'create', icon: Plus, label: 'Create Job' },
    { id: 'jobs', icon: Layers, label: 'Job Manager' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-50 w-64 h-full bg-dark-secondary border-r border-gray-700 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SampleShield</h1>
            <p className="text-xs text-gray-400">Pro</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Features highlight */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-br from-accent/20 to-purple-600/20 rounded-lg p-4 border border-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-white">Pro Features</span>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                <span>Advanced Anonymization</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>GDPR Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                <span>AI-Powered Generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar