import React, { useState } from 'react'
import { User, Shield, Bell, Database, Save } from 'lucide-react'

export function Settings() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@company.com',
    company: 'Acme Corp',
    role: 'Data Scientist'
  })

  const [notifications, setNotifications] = useState({
    jobComplete: true,
    jobFailed: true,
    weeklyReport: true,
    securityAlerts: true
  })

  const [privacy, setPrivacy] = useState({
    dataRetention: '30',
    autoDelete: true,
    encryptionLevel: 'aes256'
  })

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-dark-text">Settings</h1>
        <p className="text-dark-muted">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-dark-text">Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="form-input w-full"
                />
              </div>
              
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="form-input w-full"
                />
              </div>
              
              <div>
                <label className="form-label">Company</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                  className="form-input w-full"
                />
              </div>
              
              <div>
                <label className="form-label">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                  className="form-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-dark-text">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-text">
                      {key === 'jobComplete' && 'Job Completion'}
                      {key === 'jobFailed' && 'Job Failures'}
                      {key === 'weeklyReport' && 'Weekly Reports'}
                      {key === 'securityAlerts' && 'Security Alerts'}
                    </p>
                    <p className="text-dark-muted text-sm">
                      {key === 'jobComplete' && 'Get notified when your jobs complete'}
                      {key === 'jobFailed' && 'Get notified when jobs fail'}
                      {key === 'weeklyReport' && 'Receive weekly usage summaries'}
                      {key === 'securityAlerts' && 'Important security notifications'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    className="w-4 h-4 text-accent bg-dark-surface border-dark-border rounded focus:ring-accent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-dark-text">Privacy & Security</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Data Retention (days)</label>
                <select
                  value={privacy.dataRetention}
                  onChange={(e) => setPrivacy({...privacy, dataRetention: e.target.value})}
                  className="form-input w-full"
                >
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Encryption Level</label>
                <select
                  value={privacy.encryptionLevel}
                  onChange={(e) => setPrivacy({...privacy, encryptionLevel: e.target.value})}
                  className="form-input w-full"
                >
                  <option value="aes128">AES-128</option>
                  <option value="aes256">AES-256</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="auto-delete"
                  checked={privacy.autoDelete}
                  onChange={(e) => setPrivacy({...privacy, autoDelete: e.target.checked})}
                  className="w-4 h-4 text-accent bg-dark-surface border-dark-border rounded focus:ring-accent"
                />
                <label htmlFor="auto-delete" className="text-dark-text">
                  Auto-delete completed jobs after retention period
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-dark-text">API Access</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">API Key</label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value="sk-1234567890abcdef"
                    readOnly
                    className="form-input flex-1"
                  />
                  <button className="btn-secondary">Copy</button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-dark-muted">
                  Use this API key to integrate SampleShield Pro with your applications.
                </p>
              </div>
              
              <button className="btn-primary w-full">
                Generate New Key
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-dark-text mb-4">Usage Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-muted">Jobs this month</span>
                <span className="text-dark-text font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">Data generated</span>
                <span className="text-dark-text font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-muted">API calls</span>
                <span className="text-dark-text font-medium">1,247</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}