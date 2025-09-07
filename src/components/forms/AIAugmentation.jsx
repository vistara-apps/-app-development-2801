import React, { useState } from 'react'
import { Upload, Play, FileText } from 'lucide-react'

export function AIAugmentation() {
  const [jobName, setJobName] = useState('')
  const [file, setFile] = useState(null)
  const [augmentationFactor, setAugmentationFactor] = useState(2)
  const [preserveDistribution, setPreserveDistribution] = useState(true)

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    setFile(uploadedFile)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate job creation
    alert('AI Augmentation job created successfully! Processing will begin shortly.')
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
              placeholder="Customer Data Augmentation"
              required
            />
          </div>
          
          <div>
            <label className="form-label">Augmentation Factor</label>
            <select
              value={augmentationFactor}
              onChange={(e) => setAugmentationFactor(parseInt(e.target.value))}
              className="form-input w-full"
              required
            >
              <option value={2}>2x (Double the data)</option>
              <option value={3}>3x (Triple the data)</option>
              <option value={5}>5x (5 times the data)</option>
              <option value={10}>10x (10 times the data)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Source Dataset</h3>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">Upload Dataset</label>
            <div className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".csv,.json,.xlsx"
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-dark-muted mx-auto mb-2" />
                <p className="text-dark-muted">
                  {file ? file.name : 'Click to upload CSV, JSON, or Excel file'}
                </p>
                <p className="text-xs text-dark-muted mt-1">Max file size: 100MB</p>
              </label>
            </div>
          </div>
          
          {file && (
            <div className="bg-dark-bg p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-dark-text">{file.name}</span>
                <span className="text-dark-muted text-sm">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">Augmentation Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="preserve-distribution"
              checked={preserveDistribution}
              onChange={(e) => setPreserveDistribution(e.target.checked)}
              className="w-4 h-4 text-accent bg-dark-surface border-dark-border rounded focus:ring-accent"
            />
            <label htmlFor="preserve-distribution" className="text-dark-text">
              Preserve statistical distribution
            </label>
          </div>
          
          <div>
            <label className="form-label">AI Model</label>
            <select className="form-input w-full">
              <option value="gpt-synthetic">GPT-Synthetic (Recommended)</option>
              <option value="tabular-gan">Tabular GAN</option>
              <option value="ctgan">CTGAN</option>
              <option value="copulagan">CopulaGAN</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary flex items-center space-x-2">
          <Play className="w-4 h-4" />
          <span>Start Augmentation</span>
        </button>
      </div>
    </form>
  )
}