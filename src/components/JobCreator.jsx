import React, { useState } from 'react'
import { 
  Upload, 
  FileText, 
  Settings2, 
  Shield, 
  Sparkles,
  Database,
  Plus,
  X
} from 'lucide-react'

const JobCreator = ({ onJobCreate }) => {
  const [activeStep, setActiveStep] = useState(1)
  const [jobType, setJobType] = useState('')
  const [jobData, setJobData] = useState({
    name: '',
    description: '',
    dataSource: null,
    rules: [],
    anonymization: {
      enabled: false,
      methods: [],
      fields: []
    },
    outputFormat: 'csv',
    recordCount: 1000
  })

  const jobTypes = [
    {
      id: 'rule-based',
      title: 'Rule-Based Generation',
      description: 'Generate data based on custom rules and constraints',
      icon: Settings2,
      features: ['Custom schemas', 'Data validation', 'Constraint enforcement']
    },
    {
      id: 'augmentation',
      title: 'AI-Powered Augmentation',
      description: 'Enhance existing datasets with AI-generated variations',
      icon: Sparkles,
      features: ['ML-driven generation', 'Pattern recognition', 'Smart variations']
    },
    {
      id: 'anonymization',
      title: 'Anonymization & Masking',
      description: 'Apply privacy techniques to sensitive data',
      icon: Shield,
      features: ['PII masking', 'K-anonymity', 'Differential privacy']
    },
    {
      id: 'compliance',
      title: 'Compliance Synthesis',
      description: 'Generate fully compliant synthetic datasets',
      icon: Database,
      features: ['GDPR compliant', 'HIPAA ready', 'Zero real data']
    }
  ]

  const anonymizationMethods = [
    'K-Anonymity',
    'Differential Privacy',
    'Data Masking',
    'Pseudonymization',
    'Generalization',
    'Suppression'
  ]

  const handleStepForward = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1)
  }

  const handleStepBack = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1)
  }

  const addRule = () => {
    setJobData(prev => ({
      ...prev,
      rules: [...prev.rules, { field: '', type: 'string', constraint: '' }]
    }))
  }

  const removeRule = (index) => {
    setJobData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }))
  }

  const updateRule = (index, field, value) => {
    setJobData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }))
  }

  const handleSubmit = () => {
    if (!jobData.name.trim()) {
      alert('Please enter a job name')
      return
    }

    const newJob = {
      ...jobData,
      type: jobType,
      status: 'pending'
    }

    onJobCreate(newJob)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Choose Generation Type</h3>
              <p className="text-gray-400">Select the type of synthetic data generation you need</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setJobType(type.id)}
                    className={`p-6 rounded-lg border-2 text-left transition-all duration-300 ${
                      jobType === type.id
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-700 bg-dark-card hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        jobType === type.id ? 'bg-accent' : 'bg-gray-700'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-white">{type.title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{type.description}</p>
                    <div className="space-y-1">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <span className="text-xs text-gray-500">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Job Configuration</h3>
              <p className="text-gray-400">Set up your data generation parameters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Name *
                  </label>
                  <input
                    type="text"
                    value={jobData.name}
                    onChange={(e) => setJobData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    placeholder="e.g., Customer Data for Testing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none resize-none"
                    placeholder="Describe the purpose of this synthetic data..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Records
                  </label>
                  <input
                    type="number"
                    value={jobData.recordCount}
                    onChange={(e) => setJobData(prev => ({ ...prev, recordCount: parseInt(e.target.value) || 1000 }))}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                    min="1"
                    max="1000000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {(jobType === 'augmentation' || jobType === 'anonymization') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Source Data
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 mb-2">Drop your CSV or JSON file here</p>
                      <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors">
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Output Format
                  </label>
                  <select
                    value={jobData.outputFormat}
                    onChange={(e) => setJobData(prev => ({ ...prev, outputFormat: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="parquet">Parquet</option>
                    <option value="xlsx">Excel</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Data Rules & Schema</h3>
              <p className="text-gray-400">Define the structure and constraints for your synthetic data</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Field Rules</h4>
                <button
                  onClick={addRule}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>

              {jobData.rules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No rules defined yet. Add rules to configure your data schema.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobData.rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-dark-card rounded-lg border border-gray-700">
                      <input
                        type="text"
                        placeholder="Field name"
                        value={rule.field}
                        onChange={(e) => updateRule(index, 'field', e.target.value)}
                        className="flex-1 px-3 py-2 bg-dark-primary border border-gray-600 rounded text-white text-sm focus:border-accent focus:outline-none"
                      />
                      <select
                        value={rule.type}
                        onChange={(e) => updateRule(index, 'type', e.target.value)}
                        className="px-3 py-2 bg-dark-primary border border-gray-600 rounded text-white text-sm focus:border-accent focus:outline-none"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Constraints"
                        value={rule.constraint}
                        onChange={(e) => updateRule(index, 'constraint', e.target.value)}
                        className="flex-1 px-3 py-2 bg-dark-primary border border-gray-600 rounded text-white text-sm focus:border-accent focus:outline-none"
                      />
                      <button
                        onClick={() => removeRule(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Privacy & Anonymization</h3>
              <p className="text-gray-400">Configure privacy protection and anonymization settings</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg border border-gray-700">
                <div>
                  <h4 className="font-medium text-white">Enable Anonymization</h4>
                  <p className="text-sm text-gray-400">Apply privacy protection techniques to your data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobData.anonymization.enabled}
                    onChange={(e) => setJobData(prev => ({
                      ...prev,
                      anonymization: { ...prev.anonymization, enabled: e.target.checked }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              {jobData.anonymization.enabled && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-3">Anonymization Methods</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {anonymizationMethods.map((method) => (
                        <label key={method} className="flex items-center gap-3 p-3 bg-dark-card rounded-lg border border-gray-700 cursor-pointer hover:border-accent/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={jobData.anonymization.methods.includes(method)}
                            onChange={(e) => {
                              const methods = e.target.checked
                                ? [...jobData.anonymization.methods, method]
                                : jobData.anonymization.methods.filter(m => m !== method)
                              setJobData(prev => ({
                                ...prev,
                                anonymization: { ...prev.anonymization, methods }
                              }))
                            }}
                            className="text-accent focus:ring-accent focus:ring-2 focus:ring-offset-0 bg-gray-700 border-gray-600 rounded"
                          />
                          <span className="text-sm text-white">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Sensitive Fields</h4>
                    <input
                      type="text"
                      placeholder="Enter field names separated by commas (e.g., email, ssn, phone)"
                      value={jobData.anonymization.fields.join(', ')}
                      onChange={(e) => setJobData(prev => ({
                        ...prev,
                        anonymization: {
                          ...prev.anonymization,
                          fields: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                        }
                      }))}
                      className="w-full px-4 py-2 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Job</h1>
        <p className="text-gray-400">Generate synthetic data with advanced privacy protection</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              activeStep >= step
                ? 'bg-accent text-white'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 transition-all duration-300 ${
                activeStep > step ? 'bg-accent' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-dark-card rounded-lg p-6 sm:p-8 border border-gray-700 min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleStepBack}
          disabled={activeStep === 1}
          className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {activeStep < 4 ? (
            <button
              onClick={handleStepForward}
              disabled={activeStep === 1 && !jobType}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Job
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobCreator