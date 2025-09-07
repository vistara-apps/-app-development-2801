import mongoose from 'mongoose';

const anonymizationConfigSchema = new mongoose.Schema({
  configId: {
    type: String,
    unique: true,
    default: () => `config_${new mongoose.Types.ObjectId().toString()}`
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DatasetJob',
    required: [true, 'Job ID is required']
  },
  anonymizationMethod: {
    type: String,
    required: [true, 'Anonymization method is required'],
    enum: [
      'k-anonymity',
      'l-diversity',
      'differential-privacy',
      'data-masking',
      'pseudonymization',
      'generalization',
      'suppression',
      'perturbation'
    ]
  },
  fieldsToAnonymize: [{
    fieldName: {
      type: String,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    method: {
      type: String,
      required: true,
      enum: ['mask', 'hash', 'generalize', 'suppress', 'substitute', 'encrypt']
    },
    options: {
      // Masking options
      maskChar: {
        type: String,
        default: '*'
      },
      keepStart: {
        type: Number,
        default: 0
      },
      keepEnd: {
        type: Number,
        default: 0
      },
      
      // Generalization options
      range: Number,
      precision: Number,
      categories: [String],
      
      // Substitution options
      substitutions: mongoose.Schema.Types.Mixed,
      
      // Encryption options
      algorithm: {
        type: String,
        default: 'aes-256-gcm'
      },
      
      // Custom options
      customOptions: mongoose.Schema.Types.Mixed
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    }
  }],
  
  // Global anonymization settings
  globalSettings: {
    // K-anonymity settings
    kValue: {
      type: Number,
      default: 5,
      min: 2
    },
    
    // L-diversity settings
    lValue: {
      type: Number,
      default: 2,
      min: 2
    },
    
    // Differential privacy settings
    epsilon: {
      type: Number,
      default: 1.0,
      min: 0.1,
      max: 10.0
    },
    delta: {
      type: Number,
      default: 0.00001,
      min: 0.00001,
      max: 0.1
    },
    
    // Data utility preservation
    utilityThreshold: {
      type: Number,
      default: 0.8,
      min: 0.1,
      max: 1.0
    },
    
    // Privacy level
    privacyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'maximum'],
      default: 'medium'
    }
  },
  
  // Compliance settings
  complianceRequirements: {
    gdpr: {
      type: Boolean,
      default: false
    },
    hipaa: {
      type: Boolean,
      default: false
    },
    ccpa: {
      type: Boolean,
      default: false
    },
    pci: {
      type: Boolean,
      default: false
    },
    custom: [{
      name: String,
      requirements: [String],
      enabled: Boolean
    }]
  },
  
  // Quality metrics
  qualityMetrics: {
    dataUtility: {
      type: Number,
      min: 0,
      max: 100
    },
    privacyRisk: {
      type: Number,
      min: 0,
      max: 100
    },
    reidentificationRisk: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Validation rules
  validationRules: [{
    fieldName: String,
    rule: String,
    parameters: mongoose.Schema.Types.Mixed,
    errorMessage: String
  }],
  
  // Metadata
  description: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
anonymizationConfigSchema.index({ jobId: 1 });
anonymizationConfigSchema.index({ configId: 1 });
anonymizationConfigSchema.index({ anonymizationMethod: 1 });

// Virtual for privacy score calculation
anonymizationConfigSchema.virtual('privacyScore').get(function() {
  let score = 50; // Base score
  
  // Add points based on anonymization method
  const methodScores = {
    'differential-privacy': 25,
    'k-anonymity': 20,
    'l-diversity': 20,
    'data-masking': 15,
    'pseudonymization': 15,
    'generalization': 10,
    'suppression': 20,
    'perturbation': 10
  };
  
  score += methodScores[this.anonymizationMethod] || 0;
  
  // Add points for field-level anonymization
  const enabledFields = this.fieldsToAnonymize.filter(field => field.enabled);
  score += Math.min(enabledFields.length * 2, 20);
  
  // Add points for compliance requirements
  const complianceCount = Object.values(this.complianceRequirements).filter(Boolean).length;
  score += Math.min(complianceCount * 3, 15);
  
  return Math.min(100, score);
});

// Virtual for configuration summary
anonymizationConfigSchema.virtual('summary').get(function() {
  const enabledFields = this.fieldsToAnonymize.filter(field => field.enabled);
  return `${this.anonymizationMethod} anonymization for ${enabledFields.length} fields`;
});

// Pre-save middleware
anonymizationConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to validate configuration
anonymizationConfigSchema.methods.validateConfiguration = function() {
  const errors = [];
  
  // Check if at least one field is configured for anonymization
  const enabledFields = this.fieldsToAnonymize.filter(field => field.enabled);
  if (enabledFields.length === 0) {
    errors.push('At least one field must be enabled for anonymization');
  }
  
  // Validate k-anonymity settings
  if (this.anonymizationMethod === 'k-anonymity' && this.globalSettings.kValue < 2) {
    errors.push('K-value must be at least 2 for k-anonymity');
  }
  
  // Validate l-diversity settings
  if (this.anonymizationMethod === 'l-diversity' && this.globalSettings.lValue < 2) {
    errors.push('L-value must be at least 2 for l-diversity');
  }
  
  // Validate differential privacy settings
  if (this.anonymizationMethod === 'differential-privacy') {
    if (this.globalSettings.epsilon <= 0 || this.globalSettings.epsilon > 10) {
      errors.push('Epsilon must be between 0.1 and 10 for differential privacy');
    }
    if (this.globalSettings.delta <= 0 || this.globalSettings.delta > 0.1) {
      errors.push('Delta must be between 0.00001 and 0.1 for differential privacy');
    }
  }
  
  // Validate field-specific configurations
  for (const field of this.fieldsToAnonymize) {
    if (field.enabled) {
      switch (field.method) {
        case 'mask':
          if (!field.options.maskChar) {
            errors.push(`Mask character is required for field: ${field.fieldName}`);
          }
          break;
        case 'generalize':
          if (field.options.range && field.options.range <= 0) {
            errors.push(`Generalization range must be positive for field: ${field.fieldName}`);
          }
          break;
        case 'substitute':
          if (!field.options.substitutions) {
            errors.push(`Substitution mappings are required for field: ${field.fieldName}`);
          }
          break;
      }
    }
  }
  
  return errors;
};

// Instance method to apply anonymization to a value
anonymizationConfigSchema.methods.anonymizeValue = function(fieldName, value) {
  const fieldConfig = this.fieldsToAnonymize.find(f => f.fieldName === fieldName && f.enabled);
  
  if (!fieldConfig || value === null || value === undefined) {
    return value;
  }
  
  const { method, options } = fieldConfig;
  
  switch (method) {
    case 'mask':
      return this.maskValue(value, options);
    case 'hash':
      return this.hashValue(value);
    case 'generalize':
      return this.generalizeValue(value, options);
    case 'suppress':
      return null;
    case 'substitute':
      return this.substituteValue(value, options);
    case 'encrypt':
      return this.encryptValue(value, options);
    default:
      return value;
  }
};

// Helper methods for anonymization
anonymizationConfigSchema.methods.maskValue = function(value, options) {
  const str = String(value);
  const maskChar = options.maskChar || '*';
  const keepStart = options.keepStart || 0;
  const keepEnd = options.keepEnd || 0;
  
  if (str.length <= keepStart + keepEnd) {
    return maskChar.repeat(str.length);
  }
  
  const start = str.substring(0, keepStart);
  const end = str.substring(str.length - keepEnd);
  const middle = maskChar.repeat(str.length - keepStart - keepEnd);
  
  return start + middle + end;
};

anonymizationConfigSchema.methods.hashValue = function(value) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(String(value)).digest('hex').substring(0, 16);
};

anonymizationConfigSchema.methods.generalizeValue = function(value, options) {
  if (typeof value === 'number') {
    const range = options.range || 10;
    return Math.floor(value / range) * range;
  }
  
  if (value && !isNaN(Date.parse(value))) {
    const date = new Date(value);
    const precision = options.precision || 'month';
    
    switch (precision) {
      case 'year':
        return date.getFullYear().toString();
      case 'month':
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      case 'day':
        return date.toISOString().split('T')[0];
      default:
        return date.toISOString().split('T')[0];
    }
  }
  
  if (options.categories && Array.isArray(options.categories)) {
    // Map to category
    const categories = options.categories;
    const hash = this.hashValue(value);
    const index = parseInt(hash.substring(0, 8), 16) % categories.length;
    return categories[index];
  }
  
  return '[GENERALIZED]';
};

anonymizationConfigSchema.methods.substituteValue = function(value, options) {
  const substitutions = options.substitutions || {};
  return substitutions[value] || `[SUBSTITUTED_${this.hashValue(value).substring(0, 8)}]`;
};

anonymizationConfigSchema.methods.encryptValue = function(value, options) {
  const crypto = require('crypto');
  const algorithm = options.algorithm || 'aes-256-gcm';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(String(value), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
};

// Static method to create default configuration
anonymizationConfigSchema.statics.createDefault = function(jobId, fields = []) {
  const defaultFields = fields.map(fieldName => ({
    fieldName,
    enabled: true,
    method: 'mask',
    options: {
      maskChar: '*',
      keepStart: 2,
      keepEnd: 2
    },
    priority: 1
  }));
  
  return new this({
    jobId,
    anonymizationMethod: 'data-masking',
    fieldsToAnonymize: defaultFields,
    globalSettings: {
      privacyLevel: 'medium',
      utilityThreshold: 0.8
    }
  });
};

// Static method to create GDPR compliant configuration
anonymizationConfigSchema.statics.createGDPRCompliant = function(jobId, fields = []) {
  const gdprFields = fields.map(fieldName => ({
    fieldName,
    enabled: true,
    method: this.isPIIField(fieldName) ? 'hash' : 'generalize',
    options: this.isPIIField(fieldName) ? {} : { range: 10 },
    priority: this.isPIIField(fieldName) ? 10 : 5
  }));
  
  return new this({
    jobId,
    anonymizationMethod: 'k-anonymity',
    fieldsToAnonymize: gdprFields,
    globalSettings: {
      kValue: 5,
      privacyLevel: 'high',
      utilityThreshold: 0.7
    },
    complianceRequirements: {
      gdpr: true
    }
  });
};

// Helper method to identify PII fields
anonymizationConfigSchema.statics.isPIIField = function(fieldName) {
  const piiKeywords = [
    'name', 'email', 'phone', 'address', 'ssn', 'social', 'credit',
    'passport', 'license', 'id', 'birth', 'age', 'salary', 'income'
  ];
  
  const lowerFieldName = fieldName.toLowerCase();
  return piiKeywords.some(keyword => lowerFieldName.includes(keyword));
};

const AnonymizationConfig = mongoose.model('AnonymizationConfig', anonymizationConfigSchema);

export default AnonymizationConfig;
