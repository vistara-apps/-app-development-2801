import React, { useState } from 'react'
import { RuleBased } from '../components/forms/RuleBased'
import { AIAugmentation } from '../components/forms/AIAugmentation'
import { AnonymizationSettings } from '../components/forms/AnonymizationSettings'
import { Database, Cpu, Shield, ArrowRight } from 'lucide-react'

const jobTypes = [
  {
    id: 'rule-based',
    title: 'Rule-Based Generation',
    description: 'Create synthetic data using predefined rules and constraints',
    icon: Database,
    color: 'text-blue-500',
  },
  {
    id: 'ai-augmentation',
    title: 'AI-Powered Augmentation',
    description: 'Enhance existing datasets with AI-generated variations',
    icon: Cpu,
    color: 'text-green-500',
  },
  {
    id: 'anonymization',
    title: 'Anonymization & Masking',
    description: 'Apply privacy techniques to sensitive data',
    icon: Shield,
    color: 'text-purple-500',
  },
]

export function NewJob() {
  const [selectedType, setSelectedType] = useState(null)
  const [step, setStep] = useState(1)

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-dark-text mb-2">Choose Job Type</h2>
            <p className="text-dark-muted">Select the type of data generation or processing you need</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id)
                    setStep(2)
                  }}
                  className="card hover:bg-dark-border transition-colors text-left p-6"
                >
                  <Icon className={`w-8 h-8 ${type.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-dark-text mb-2">{type.title}</h3>
                  <p className="text-dark-muted text-sm">{type.description}</p>
                  <ArrowRight className="w-4 h-4 text-dark-muted mt-4" />
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-dark-text">Configure Job</h2>
              <p className="text-dark-muted">Set up your data generation parameters</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              Back to Selection
            </button>
          </div>
          
          {selectedType === 'rule-based' && <RuleBased />}
          {selectedType === 'ai-augmentation' && <AIAugmentation />}
          {selectedType === 'anonymization' && <AnonymizationSettings />}
        </div>
      )
    }
  }

  return (
    <div className="animate-fade-in">
      {renderStep()}
    </div>
  )
}