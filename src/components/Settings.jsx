import React, { useState } from 'react'
import { 
  User, 
  CreditCard, 
  Shield, 
  Bell, 
  Download, 
  Trash2,
  Key,
  Globe,
  Moon,
  Sun,
  Check
} from 'lucide-react'

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      company: 'DataTech Solutions',
      role: 'Data Scientist'
    },
    subscription: {
      plan: 'Pro',
      status: 'active',
      nextBilling: '2024-02-15',
      usage: {
        dataGenerated: 3.2,
        limit: 5.0
      }
    },
    notifications: {
      jobComplete: true,
      jobFailed: true,
      weeklyReport: false,
      marketing: false
    },
    privacy: {
      dataRetention: '90',
      shareUsageStats: false,
      twoFactorAuth: true
    }
  })

  const settingSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Key },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ]

  const subscriptionPlans = [
    {
      name: 'Basic',
      price: '$49',
      features: ['1GB data generation', 'Basic anonymization', 'Email support'],
      current: false
    },
    {
      name: 'Pro',
      price: '$99',
      features: ['5GB data generation', 'Advanced anonymization', 'Priority support', 'API access'],
      current: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited data', 'Custom compliance', 'Dedicated support', 'SSO integration'],
      current: false
    }
  ]

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={settings.profile.company}
                    onChange={(e) => handleInputChange('profile', 'company', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={settings.profile.role}
                    onChange={(e) => handleInputChange('profile', 'role', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <button className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )

      case 'subscription':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Current Subscription</h3>
              <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">Pro Plan</h4>
                    <p className="text-gray-400">$99/month</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Data Usage</span>
                    <span className="text-white">{settings.subscription.usage.dataGenerated}GB / {settings.subscription.usage.limit}GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(settings.subscription.usage.dataGenerated / settings.subscription.usage.limit) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">Next billing: {new Date(settings.subscription.nextBilling).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.name} className={`rounded-lg p-6 border-2 transition-all ${
                    plan.current 
                      ? 'border-accent bg-accent/5' 
                      : 'border-gray-700 bg-dark-card hover:border-gray-600'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                      {plan.current && <Check className="w-5 h-5 text-accent" />}
                    </div>
                    <p className="text-2xl font-bold text-white mb-4">{plan.price}<span className="text-sm text-gray-400">/mo</span></p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        plan.current
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-accent text-white hover:bg-accent/90'
                      }`}
                      disabled={plan.current}
                    >
                      {plan.current ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg border border-gray-700">
                  <div>
                    <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.twoFactorAuth}
                      onChange={(e) => handleInputChange('privacy', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="p-4 bg-dark-card rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-dark-card rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">API Keys</h4>
                  <p className="text-sm text-gray-400 mb-3">Manage your API keys for programmatic access</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value="sk-***************************"
                      readOnly
                      className="flex-1 px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-gray-400"
                    />
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries({
                  jobComplete: 'Job completion notifications',
                  jobFailed: 'Job failure alerts',
                  weeklyReport: 'Weekly usage reports',
                  marketing: 'Marketing and promotional emails'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-dark-card rounded-lg border border-gray-700">
                    <div>
                      <h4 className="font-medium text-white">{label}</h4>
                      <p className="text-sm text-gray-400">Receive notifications about {label.toLowerCase()}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications[key]}
                        onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-card rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Data Retention Period</h4>
                  <p className="text-sm text-gray-400 mb-3">How long to keep your generated datasets</p>
                  <select
                    value={settings.privacy.dataRetention}
                    onChange={(e) => handleInputChange('privacy', 'dataRetention', e.target.value)}
                    className="w-full px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                  >
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg border border-gray-700">
                  <div>
                    <h4 className="font-medium text-white">Share Usage Statistics</h4>
                    <p className="text-sm text-gray-400">Help improve our services by sharing anonymized usage data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareUsageStats}
                      onChange={(e) => handleInputChange('privacy', 'shareUsageStats', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <h4 className="font-medium text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-gray-400 mb-3">These actions cannot be undone</p>
                  <div className="space-y-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Export All Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">App Preferences</h3>
              <div className="space-y-4">
                <div className="p-4 bg-dark-card rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-3">Theme</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-3 p-3 bg-accent/20 border border-accent rounded-lg">
                      <Moon className="w-5 h-5 text-accent" />
                      <span className="text-white">Dark</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 bg-gray-700 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                      <Sun className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Light</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-dark-card rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Default Output Format</h4>
                  <select className="w-full px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none">
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="parquet">Parquet</option>
                    <option value="xlsx">Excel</option>
                  </select>
                </div>

                <div className="p-4 bg-dark-card rounded-lg border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Language</h4>
                  <select className="w-full px-4 py-2 bg-dark-primary border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {settingSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-accent text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-dark-card rounded-lg p-6 sm:p-8 border border-gray-700">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings