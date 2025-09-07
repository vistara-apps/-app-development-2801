import React, { useState } from 'react'
import { Plus, Trash2, Play } from 'lucide-react'

export function RuleBased() {
  const [jobName, setJobName] = useState('')
  const [fields, setFields] = useState([
    { name: 'user_id', type: 'integer', constraints: 'min:1, max:100000' },
    { name: 'email', type: 'email', constraints: 'domain:example.com' },
    { name: 'age', type: 'integer', constraints: 'min:18, max:80' },
  ])
  const [recordCount, setRecordCount] = useState(1000)

  const addField = () => {
    setFields([...fields, { name: '', type: 'string', constraints: '' }])
  }

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index, field, value) => {
    const newFields = [...fields]
    newFields[index][field] = value
    setFields(newFields)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate job creation
    alert('Rule-based job created successfully! You will be notified when it completes.')
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
              placeholder="Customer Demographics"
              required
            />
          </div>
          
          <div>
            <label className="form-label">Number of Records</label>
            <input
              type="number"
              value={recordCount}
              onChange={(e) => setRecordCount(parseInt(e.target.value))}
              className="form-input w-full"
              min="1"
              max="1000000"
              required
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-text">Data Schema</h3>
          <button
            type="button"
            onClick={addField}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-dark-bg rounded-md">
              <div>
                <label className="form-label">Field Name</label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  className="form-input w-full"
                  placeholder="field_name"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Data Type</label>
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, 'type', e.target.value)}
                  className="form-input w-full"
                  required
                >
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="float">Float</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="date">Date</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Constraints</label>
                <input
                  type="text"
                  value={field.constraints}
                  onChange={(e) => updateField(index, 'constraints', e.target.value)}
                  className="form-input w-full"
                  placeholder="min:1, max:100"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary flex items-center space-x-2">
          <Play className="w-4 h-4" />
          <span>Start Generation</span>
        </button>
      </div>
    </form>
  )
}