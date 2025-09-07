import mongoose from 'mongoose';

const generationRuleSchema = new mongoose.Schema({
  ruleId: {
    type: String,
    unique: true,
    default: () => `rule_${new mongoose.Types.ObjectId().toString()}`
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DatasetJob',
    required: [true, 'Job ID is required']
  },
  fieldName: {
    type: String,
    required: [true, 'Field name is required'],
    trim: true
  },
  ruleType: {
    type: String,
    required: [true, 'Rule type is required'],
    enum: [
      'faker', // Use Faker.js methods
      'pattern', // Regex or pattern-based
      'range', // Numeric range
      'list', // Pick from predefined list
      'reference', // Reference another field
      'formula', // Mathematical formula
      'conditional', // Conditional logic
      'custom' // Custom function
    ]
  },
  ruleDefinition: {
    // Faker.js configuration
    fakerMethod: String, // e.g., 'name.firstName', 'internet.email'
    fakerLocale: {
      type: String,
      default: 'en'
    },
    
    // Pattern configuration
    pattern: String, // Regex pattern or template
    
    // Range configuration
    min: Number,
    max: Number,
    step: Number,
    dataType: {
      type: String,
      enum: ['integer', 'float', 'date', 'string'],
      default: 'integer'
    },
    
    // List configuration
    values: [mongoose.Schema.Types.Mixed],
    weights: [Number], // Probability weights for values
    
    // Reference configuration
    referenceField: String,
    referenceTransform: String, // Function to transform referenced value
    
    // Formula configuration
    formula: String, // Mathematical expression
    variables: [String], // Field names used in formula
    
    // Conditional configuration
    conditions: [{
      field: String,
      operator: {
        type: String,
        enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex']
      },
      value: mongoose.Schema.Types.Mixed,
      result: mongoose.Schema.Types.Mixed
    }],
    defaultValue: mongoose.Schema.Types.Mixed,
    
    // Custom function configuration
    customFunction: String, // JavaScript function as string
    
    // Common options
    nullable: {
      type: Boolean,
      default: false
    },
    nullProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    unique: {
      type: Boolean,
      default: false
    },
    format: String, // Output format (e.g., date format)
    
    // Validation rules
    validation: {
      required: Boolean,
      minLength: Number,
      maxLength: Number,
      regex: String,
      customValidator: String
    }
  },
  
  // Metadata
  description: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Performance tracking
  executionStats: {
    averageExecutionTime: Number, // in milliseconds
    totalExecutions: {
      type: Number,
      default: 0
    },
    errorCount: {
      type: Number,
      default: 0
    },
    lastError: {
      message: String,
      timestamp: Date
    }
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
generationRuleSchema.index({ jobId: 1 });
generationRuleSchema.index({ ruleId: 1 });
generationRuleSchema.index({ ruleType: 1 });
generationRuleSchema.index({ fieldName: 1 });

// Virtual for rule summary
generationRuleSchema.virtual('summary').get(function() {
  const typeDescriptions = {
    faker: `Generate ${this.fieldName} using Faker.js method: ${this.ruleDefinition.fakerMethod}`,
    pattern: `Generate ${this.fieldName} matching pattern: ${this.ruleDefinition.pattern}`,
    range: `Generate ${this.fieldName} in range ${this.ruleDefinition.min}-${this.ruleDefinition.max}`,
    list: `Generate ${this.fieldName} from list of ${this.ruleDefinition.values?.length || 0} values`,
    reference: `Generate ${this.fieldName} based on ${this.ruleDefinition.referenceField}`,
    formula: `Generate ${this.fieldName} using formula: ${this.ruleDefinition.formula}`,
    conditional: `Generate ${this.fieldName} with ${this.ruleDefinition.conditions?.length || 0} conditions`,
    custom: `Generate ${this.fieldName} using custom function`
  };
  
  return typeDescriptions[this.ruleType] || `Generate ${this.fieldName}`;
});

// Pre-save middleware
generationRuleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to validate rule definition
generationRuleSchema.methods.validateDefinition = function() {
  const errors = [];
  
  switch (this.ruleType) {
    case 'faker':
      if (!this.ruleDefinition.fakerMethod) {
        errors.push('Faker method is required for faker rule type');
      }
      break;
      
    case 'pattern':
      if (!this.ruleDefinition.pattern) {
        errors.push('Pattern is required for pattern rule type');
      }
      break;
      
    case 'range':
      if (this.ruleDefinition.min === undefined || this.ruleDefinition.max === undefined) {
        errors.push('Min and max values are required for range rule type');
      }
      if (this.ruleDefinition.min >= this.ruleDefinition.max) {
        errors.push('Min value must be less than max value');
      }
      break;
      
    case 'list':
      if (!this.ruleDefinition.values || this.ruleDefinition.values.length === 0) {
        errors.push('Values array is required for list rule type');
      }
      if (this.ruleDefinition.weights && this.ruleDefinition.weights.length !== this.ruleDefinition.values.length) {
        errors.push('Weights array must have same length as values array');
      }
      break;
      
    case 'reference':
      if (!this.ruleDefinition.referenceField) {
        errors.push('Reference field is required for reference rule type');
      }
      break;
      
    case 'formula':
      if (!this.ruleDefinition.formula) {
        errors.push('Formula is required for formula rule type');
      }
      break;
      
    case 'conditional':
      if (!this.ruleDefinition.conditions || this.ruleDefinition.conditions.length === 0) {
        errors.push('Conditions array is required for conditional rule type');
      }
      break;
      
    case 'custom':
      if (!this.ruleDefinition.customFunction) {
        errors.push('Custom function is required for custom rule type');
      }
      break;
  }
  
  return errors;
};

// Instance method to execute rule
generationRuleSchema.methods.execute = async function(context = {}) {
  const startTime = Date.now();
  
  try {
    let result;
    
    // Handle null probability
    if (this.ruleDefinition.nullable && Math.random() < this.ruleDefinition.nullProbability) {
      return null;
    }
    
    switch (this.ruleType) {
      case 'faker':
        result = await this.executeFaker();
        break;
      case 'pattern':
        result = await this.executePattern();
        break;
      case 'range':
        result = await this.executeRange();
        break;
      case 'list':
        result = await this.executeList();
        break;
      case 'reference':
        result = await this.executeReference(context);
        break;
      case 'formula':
        result = await this.executeFormula(context);
        break;
      case 'conditional':
        result = await this.executeConditional(context);
        break;
      case 'custom':
        result = await this.executeCustom(context);
        break;
      default:
        throw new Error(`Unknown rule type: ${this.ruleType}`);
    }
    
    // Update execution stats
    const executionTime = Date.now() - startTime;
    this.executionStats.totalExecutions += 1;
    this.executionStats.averageExecutionTime = 
      ((this.executionStats.averageExecutionTime || 0) * (this.executionStats.totalExecutions - 1) + executionTime) / 
      this.executionStats.totalExecutions;
    
    return result;
    
  } catch (error) {
    this.executionStats.errorCount += 1;
    this.executionStats.lastError = {
      message: error.message,
      timestamp: new Date()
    };
    throw error;
  }
};

// Helper methods for rule execution
generationRuleSchema.methods.executeFaker = async function() {
  const { faker } = await import('@faker-js/faker');
  const method = this.ruleDefinition.fakerMethod;
  const locale = this.ruleDefinition.fakerLocale || 'en';
  
  faker.locale = locale;
  
  // Navigate to the faker method (e.g., 'name.firstName' -> faker.name.firstName)
  const methodParts = method.split('.');
  let fakerMethod = faker;
  
  for (const part of methodParts) {
    if (fakerMethod[part]) {
      fakerMethod = fakerMethod[part];
    } else {
      throw new Error(`Faker method not found: ${method}`);
    }
  }
  
  if (typeof fakerMethod !== 'function') {
    throw new Error(`Invalid faker method: ${method}`);
  }
  
  return fakerMethod();
};

generationRuleSchema.methods.executePattern = function() {
  const pattern = this.ruleDefinition.pattern;
  
  // Simple pattern replacement (can be extended with more sophisticated pattern matching)
  return pattern.replace(/\{(\w+)\}/g, (match, type) => {
    switch (type) {
      case 'digit': return Math.floor(Math.random() * 10).toString();
      case 'letter': return String.fromCharCode(65 + Math.floor(Math.random() * 26));
      case 'uuid': return require('crypto').randomUUID();
      default: return match;
    }
  });
};

generationRuleSchema.methods.executeRange = function() {
  const { min, max, step = 1, dataType = 'integer' } = this.ruleDefinition;
  
  switch (dataType) {
    case 'integer':
      return Math.floor(Math.random() * (max - min + 1)) + min;
    case 'float':
      return Math.random() * (max - min) + min;
    case 'date':
      const minDate = new Date(min);
      const maxDate = new Date(max);
      const randomTime = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
      return new Date(randomTime);
    default:
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

generationRuleSchema.methods.executeList = function() {
  const { values, weights } = this.ruleDefinition;
  
  if (!weights) {
    return values[Math.floor(Math.random() * values.length)];
  }
  
  // Weighted random selection
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < values.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return values[i];
    }
  }
  
  return values[values.length - 1];
};

generationRuleSchema.methods.executeReference = function(context) {
  const { referenceField, referenceTransform } = this.ruleDefinition;
  const referencedValue = context[referenceField];
  
  if (referencedValue === undefined) {
    throw new Error(`Referenced field not found: ${referenceField}`);
  }
  
  if (referenceTransform) {
    // Simple transform functions (can be extended)
    switch (referenceTransform) {
      case 'uppercase':
        return String(referencedValue).toUpperCase();
      case 'lowercase':
        return String(referencedValue).toLowerCase();
      case 'reverse':
        return String(referencedValue).split('').reverse().join('');
      default:
        return referencedValue;
    }
  }
  
  return referencedValue;
};

generationRuleSchema.methods.executeFormula = function(context) {
  const { formula, variables } = this.ruleDefinition;
  
  // Simple formula evaluation (in production, use a proper expression evaluator)
  let expression = formula;
  
  for (const variable of variables || []) {
    const value = context[variable];
    if (value !== undefined) {
      expression = expression.replace(new RegExp(`\\b${variable}\\b`, 'g'), value);
    }
  }
  
  try {
    // Note: In production, use a safe expression evaluator instead of eval
    return eval(expression);
  } catch (error) {
    throw new Error(`Formula evaluation failed: ${error.message}`);
  }
};

generationRuleSchema.methods.executeConditional = function(context) {
  const { conditions, defaultValue } = this.ruleDefinition;
  
  for (const condition of conditions) {
    const fieldValue = context[condition.field];
    let conditionMet = false;
    
    switch (condition.operator) {
      case 'eq':
        conditionMet = fieldValue === condition.value;
        break;
      case 'ne':
        conditionMet = fieldValue !== condition.value;
        break;
      case 'gt':
        conditionMet = fieldValue > condition.value;
        break;
      case 'gte':
        conditionMet = fieldValue >= condition.value;
        break;
      case 'lt':
        conditionMet = fieldValue < condition.value;
        break;
      case 'lte':
        conditionMet = fieldValue <= condition.value;
        break;
      case 'in':
        conditionMet = Array.isArray(condition.value) && condition.value.includes(fieldValue);
        break;
      case 'nin':
        conditionMet = Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        break;
      case 'regex':
        conditionMet = new RegExp(condition.value).test(String(fieldValue));
        break;
    }
    
    if (conditionMet) {
      return condition.result;
    }
  }
  
  return defaultValue;
};

generationRuleSchema.methods.executeCustom = function(context) {
  const { customFunction } = this.ruleDefinition;
  
  try {
    // Note: In production, use a safe code execution environment
    const func = new Function('context', customFunction);
    return func(context);
  } catch (error) {
    throw new Error(`Custom function execution failed: ${error.message}`);
  }
};

// Static method to find rules by job
generationRuleSchema.statics.findByJob = function(jobId) {
  return this.find({ jobId, isActive: true }).sort({ fieldName: 1 });
};

const GenerationRule = mongoose.model('GenerationRule', generationRuleSchema);

export default GenerationRule;
