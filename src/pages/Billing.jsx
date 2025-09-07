import React, { useState } from 'react'
import { CreditCard, Download, Calendar, TrendingUp, Check } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    period: 'month',
    features: [
      '1GB data generation per month',
      'Rule-based generation',
      'Basic anonymization',
      'Email support',
      '7-day data retention'
    ],
    current: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    period: 'month',
    features: [
      '5GB data generation per month',
      'AI-powered augmentation',
      'Advanced anonymization',
      'Priority support',
      '30-day data retention',
      'API access'
    ],
    current: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited data generation',
      'Custom AI models',
      'Enterprise-grade security',
      'Dedicated support',
      'Custom retention policies',
      'On-premise deployment'
    ],
    current: false
  }
]

const invoices = [
  { id: 'INV-001', date: '2024-01-01', amount: 99, status: 'paid', plan: 'Pro' },
  { id: 'INV-002', date: '2023-12-01', amount: 99, status: 'paid', plan: 'Pro' },
  { id: 'INV-003', date: '2023-11-01', amount: 49, status: 'paid', plan: 'Basic' },
  { id: 'INV-004', date: '2023-10-01', amount: 49, status: 'paid', plan: 'Basic' },
]

export function Billing() {
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-dark-text">Billing & Subscription</h1>
        <p className="text-dark-muted">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-dark-text">Current Plan</h3>
          </div>
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">Pro</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-dark-muted text-sm">Monthly Cost</p>
            <p className="text-2xl font-bold text-dark-text">$99</p>
          </div>
          <div>
            <p className="text-dark-muted text-sm">Usage This Month</p>
            <p className="text-2xl font-bold text-dark-text">2.4 GB</p>
            <p className="text-dark-muted text-sm">of 5 GB limit</p>
          </div>
          <div>
            <p className="text-dark-muted text-sm">Next Billing Date</p>
            <p className="text-2xl font-bold text-dark-text">Feb 1</p>
            <p className="text-dark-muted text-sm">2024</p>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="btn-primary">Upgrade Plan</button>
          <button className="btn-secondary">Cancel Subscription</button>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-dark-surface p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-accent text-white' 
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'annual' 
                ? 'bg-accent text-white' 
                : 'text-dark-muted hover:text-dark-text'
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`card ${plan.current ? 'ring-2 ring-accent' : ''}`}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-dark-text mb-2">{plan.name}</h3>
              <div className="mb-4">
                {typeof plan.price === 'number' ? (
                  <span className="text-3xl font-bold text-dark-text">
                    ${billingCycle === 'annual' ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-dark-text">{plan.price}</span>
                )}
                {plan.period && (
                  <span className="text-dark-muted">
                    /{billingCycle === 'annual' ? 'year' : plan.period}
                  </span>
                )}
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-dark-muted text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              className={`w-full ${plan.current ? 'btn-secondary' : 'btn-primary'}`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-text">Billing History</h3>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Invoice</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Date</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Plan</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Amount</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Status</th>
                <th className="text-left py-3 text-dark-muted text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-dark-border">
                  <td className="py-3 text-dark-text font-medium">{invoice.id}</td>
                  <td className="py-3 text-dark-muted">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-dark-muted">{invoice.plan}</td>
                  <td className="py-3 text-dark-text">${invoice.amount}</td>
                  <td className="py-3">
                    <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-accent hover:text-blue-400 text-sm">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}