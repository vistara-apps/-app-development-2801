import React, { useState } from 'react'
import { Upload, Play, Shield, Eye, EyeOff } from 'lucide-react'

export function AnonymizationSettings() {
  const [jobName, setJobName] = useState('')
  const [file, setFile] = useState(null)
  const [anonymizationMethod, setAnonymizationMethod] = useState('k-anonymity')
  const [fields, setFields] = useState([
    { name: 'email', method: 'hash', enabled: true },
    { name: 'phone', method: 'mask', enabled: true },
    { name: 'ssn', method: 'redact', enabled: true },
    { name: 'address', method: 'generalize', enabled: false },
  ])

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    setFile(uploadedFile)
  }

  const toggleField = (index) => {
    const newFields = [...fields]
    newFields[index].enabled = !newFields[index].enabled
    setFields(newFields)
  }

  const updateFieldMethod = (index, method) => {
    const newFields = [...fields]
    newFields[index].method = method
    setFields(newFields)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate job creation
    alert('Anonymization job created successfully! Your data will be processed securely.')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Job Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Job Name</label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="form-input w-full"
              placeholder="Patient Data Anonymization"
              required
            />
          </div>
          
          <div>
            <label className="form-label">Anonymization Method</label>
            <select
              value={anonymizationMethod}
              onChange={(e) => setAnonymizationMethod(e.target.value)}
              className="form-input w-full"
              required
            >
              <option value="k-anonymity">k-Anonymity</option>
              <option value="l-diversity">l-Diversity</option>
              <option value="t-closeness">t-Closeness</option>
              <option value="differential-privacy">Differential Privacy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Source Dataset</h3>
        
        <div>
          <label className="form-label">Upload Dataset</label>
          <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".csv,.json,.xlsx"
              className="hidden"
              id="anon-file-upload"
              required
            />
            <label htmlFor="anon-file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-dark-muted mx-auto mb-2" />
              <p className="text-dark-muted">
                {file ? file.name : 'Click to upload CSV, JSON, or Excel file'}
              </p>
              <p className="text-xs text-dark-muted mt-1">Sensitive data will be processed securely</p>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Field Anonymization</h3>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-dark-bg rounded-md">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => toggleField(index)}
                  className={`p-1 rounded ${field.enabled ? 'text-green-400' : 'text-dark-muted'}`}
                >
                  {field.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <span className="text-dark-text font-medium">{field.name}</span>
              </div>
              
              <div>
                <select
                  value={field.method}
                  onChange={(e) => updateFieldMethod(index, e.target.value)}
                  className="form-input w-full"
                  disabled={!field.enabled}
                >
                  <option value="hash">Hash</option>
                  <option value="mask">Mask</option>
                  <option value="redact">Redact</option>
                  <option value="generalize">Generalize</option>
                  <option value="substitute">Substitute</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <Shield className={`w-4 h-4 ${field.enabled ? 'text-green-400' : 'text-dark-muted'}`} />
                <span className={`ml-2 text-sm ${field.enabled ? 'text-green-400' : 'text-dark-muted'}`}>
                  {field.enabled ? 'Protected' : 'Skipped'}
                </span>
              </div>
              
              <div className="text-xs text-dark-muted">
                {field.method === 'hash' && 'One-way hash function'}
                {field.method === 'mask' && 'Partial masking (***-**-1234)'}
                {field.method === 'redact' && 'Complete removal'}
                {field.method === 'generalize' && 'Reduce precision'}
                {field.method === 'substitute' && 'Fake replacement'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary flex items-center space-x-2">
          <Play className="w-4 h-4" />
          <span>Start Anonymization</span>
        </button>
      </div>
    </form>
  )
}