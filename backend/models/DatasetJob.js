import mongoose from 'mongoose';

const datasetJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    unique: true,
    default: () => `job_${new mongoose.Types.ObjectId().toString()}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Job name is required'],
    trim: true,
    maxlength: [100, 'Job name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['rule-based', 'augmentation', 'anonymization', 'compliance']
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  configuration: {
    // Input data configuration
    inputSource: {
      type: String,
      enum: ['upload', 'template', 'api'],
      required: true
    },
    inputFile: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String
    },
    
    // Output configuration
    outputFormat: {
      type: String,
      enum: ['csv', 'json', 'xlsx', 'parquet'],
      default: 'csv'
    },
    recordCount: {
      type: Number,
      min: 1,
      max: 1000000,
      default: 1000
    },
    
    // Generation settings
    seed: {
      type: Number,
      default: () => Math.floor(Math.random() * 1000000)
    },
    locale: {
      type: String,
      default: 'en'
    }
  },
  
  // Results and metrics
  results: {
    outputUrl: String,
    outputSize: Number, // in bytes
    recordsGenerated: Number,
    processingTime: Number, // in milliseconds
    qualityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    privacyScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Error handling
  error: {
    message: String,
    code: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: Date
  },
  
  // Execution tracking
  startedAt: Date,
  completedAt: Date,
  estimatedDuration: Number, // in milliseconds
  
  // Metadata
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
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
datasetJobSchema.index({ userId: 1, createdAt: -1 });
datasetJobSchema.index({ jobId: 1 });
datasetJobSchema.index({ status: 1 });
datasetJobSchema.index({ jobType: 1 });
datasetJobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for duration
datasetJobSchema.virtual('duration').get(function() {
  if (this.startedAt && this.completedAt) {
    return this.completedAt - this.startedAt;
  }
  return null;
});

// Virtual for status display
datasetJobSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending',
    running: 'In Progress',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for file size display
datasetJobSchema.virtual('outputSizeDisplay').get(function() {
  if (!this.results?.outputSize) return null;
  
  const bytes = this.results.outputSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
});

// Pre-save middleware to update timestamps
datasetJobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set startedAt when status changes to running
  if (this.isModified('status') && this.status === 'running' && !this.startedAt) {
    this.startedAt = new Date();
  }
  
  // Set completedAt when status changes to completed or failed
  if (this.isModified('status') && ['completed', 'failed', 'cancelled'].includes(this.status) && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Instance method to update progress
datasetJobSchema.methods.updateProgress = function(progress, message) {
  this.progress = Math.min(100, Math.max(0, progress));
  if (message) {
    this.statusMessage = message;
  }
  return this.save();
};

// Instance method to mark as completed
datasetJobSchema.methods.markCompleted = function(results) {
  this.status = 'completed';
  this.progress = 100;
  this.completedAt = new Date();
  if (results) {
    this.results = { ...this.results, ...results };
  }
  return this.save();
};

// Instance method to mark as failed
datasetJobSchema.methods.markFailed = function(error) {
  this.status = 'failed';
  this.completedAt = new Date();
  this.error = {
    message: error.message || 'Unknown error',
    code: error.code || 'UNKNOWN_ERROR',
    details: error.details || {},
    timestamp: new Date()
  };
  return this.save();
};

// Instance method to cancel job
datasetJobSchema.methods.cancel = function(reason) {
  if (['completed', 'failed'].includes(this.status)) {
    throw new Error('Cannot cancel a job that is already completed or failed');
  }
  
  this.status = 'cancelled';
  this.completedAt = new Date();
  if (reason) {
    this.error = {
      message: reason,
      code: 'CANCELLED',
      timestamp: new Date()
    };
  }
  return this.save();
};

// Static method to find jobs by user
datasetJobSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ userId });
  
  if (options.status) {
    query.where('status', options.status);
  }
  
  if (options.jobType) {
    query.where('jobType', options.jobType);
  }
  
  if (options.limit) {
    query.limit(options.limit);
  }
  
  return query.sort({ createdAt: -1 });
};

// Static method to find active jobs
datasetJobSchema.statics.findActive = function() {
  return this.find({ status: { $in: ['pending', 'running'] } })
    .sort({ priority: -1, createdAt: 1 });
};

// Static method to cleanup expired jobs
datasetJobSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
    status: { $in: ['completed', 'failed', 'cancelled'] }
  });
};

const DatasetJob = mongoose.model('DatasetJob', datasetJobSchema);

export default DatasetJob;
