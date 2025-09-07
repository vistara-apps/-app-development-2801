import { faker } from 'faker';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import csvWriter from 'csv-writer';
import csvParser from 'csv-parser';
import { createReadStream, createWriteStream } from 'fs';

import DatasetJob from '../models/DatasetJob.js';
import GenerationRule from '../models/GenerationRule.js';
import AnonymizationConfig from '../models/AnonymizationConfig.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DataGenerationEngine {
  constructor() {
    this.activeJobs = new Map();
    this.templates = new Map();
    this.loadTemplates();
  }

  async loadTemplates() {
    try {
      const templatesPath = path.join(__dirname, '../templates');
      const templateFiles = await fs.readdir(templatesPath);
      
      for (const file of templateFiles) {
        if (file.endsWith('.json')) {
          const templateData = await fs.readFile(path.join(templatesPath, file), 'utf8');
          const template = JSON.parse(templateData);
          this.templates.set(template.id, template);
        }
      }
      
      logger.info(`Loaded ${this.templates.size} data generation templates`);
    } catch (error) {
      logger.warn('Failed to load templates:', error.message);
    }
  }

  async processJob(jobId) {
    try {
      const job = await DatasetJob.findById(jobId).populate('userId');
      if (!job) {
        throw new Error(`Job not found: ${jobId}`);
      }

      // Check if job is already being processed
      if (this.activeJobs.has(jobId)) {
        throw new Error(`Job ${jobId} is already being processed`);
      }

      // Mark job as active
      this.activeJobs.set(jobId, { startTime: Date.now(), status: 'running' });
      
      // Update job status
      job.status = 'running';
      job.startedAt = new Date();
      await job.save();

      logger.info(`Starting data generation job: ${jobId} (${job.jobType})`);

      let result;
      switch (job.jobType) {
        case 'rule-based':
          result = await this.processRuleBasedGeneration(job);
          break;
        case 'augmentation':
          result = await this.processDataAugmentation(job);
          break;
        case 'anonymization':
          result = await this.processAnonymization(job);
          break;
        case 'compliance':
          result = await this.processComplianceGeneration(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.jobType}`);
      }

      // Mark job as completed
      await job.markCompleted(result);
      
      // Update user usage statistics
      const user = job.userId;
      user.usage.dataGenerated += result.outputSize / (1024 * 1024 * 1024); // Convert to GB
      user.usage.jobsCreated += 1;
      await user.save();

      logger.info(`Completed data generation job: ${jobId}`);
      return result;

    } catch (error) {
      logger.error(`Failed to process job ${jobId}:`, error);
      
      const job = await DatasetJob.findById(jobId);
      if (job) {
        await job.markFailed(error);
      }
      
      throw error;
    } finally {
      this.activeJobs.delete(jobId);
    }
  }

  async processRuleBasedGeneration(job) {
    const rules = await GenerationRule.findByJob(job._id);
    if (rules.length === 0) {
      throw new Error('No generation rules found for job');
    }

    const recordCount = job.configuration.recordCount;
    const outputFormat = job.configuration.outputFormat;
    const seed = job.configuration.seed;
    
    // Set faker seed for reproducible results
    faker.seed(seed);

    const data = [];
    const fieldNames = rules.map(rule => rule.fieldName);
    
    logger.info(`Generating ${recordCount} records with ${rules.length} fields`);

    for (let i = 0; i < recordCount; i++) {
      const record = {};
      const context = {}; // For field references
      
      // Generate data for each field based on rules
      for (const rule of rules) {
        try {
          const value = await rule.execute(context);
          record[rule.fieldName] = value;
          context[rule.fieldName] = value; // Add to context for references
        } catch (error) {
          logger.warn(`Failed to execute rule for field ${rule.fieldName}:`, error.message);
          record[rule.fieldName] = null;
        }
      }
      
      data.push(record);
      
      // Update progress every 100 records
      if (i % 100 === 0) {
        const progress = Math.floor((i / recordCount) * 90); // Reserve 10% for file writing
        await job.updateProgress(progress, `Generated ${i}/${recordCount} records`);
      }
    }

    // Write data to file
    const outputPath = await this.writeDataToFile(data, outputFormat, job.jobId);
    const outputSize = await this.getFileSize(outputPath);
    
    // Calculate quality metrics
    const qualityScore = this.calculateQualityScore(data, rules);
    const privacyScore = this.calculatePrivacyScore(data, rules);

    await job.updateProgress(100, 'Generation completed');

    return {
      outputUrl: `/uploads/${path.basename(outputPath)}`,
      outputSize,
      recordsGenerated: data.length,
      processingTime: Date.now() - job.startedAt.getTime(),
      qualityScore,
      privacyScore
    };
  }

  async processDataAugmentation(job) {
    const inputFile = job.configuration.inputFile;
    if (!inputFile) {
      throw new Error('Input file required for data augmentation');
    }

    // Read input data
    const inputData = await this.readDataFromFile(inputFile.path, inputFile.mimetype);
    const originalCount = inputData.length;
    
    if (originalCount === 0) {
      throw new Error('Input file contains no data');
    }

    const augmentationFactor = Math.ceil(job.configuration.recordCount / originalCount);
    const augmentedData = [];

    logger.info(`Augmenting ${originalCount} records by factor of ${augmentationFactor}`);

    // Analyze data structure
    const fieldTypes = this.analyzeDataStructure(inputData);
    
    for (let factor = 0; factor < augmentationFactor; factor++) {
      for (let i = 0; i < inputData.length; i++) {
        const originalRecord = inputData[i];
        const augmentedRecord = {};

        // Generate variations for each field
        for (const [fieldName, fieldType] of Object.entries(fieldTypes)) {
          const originalValue = originalRecord[fieldName];
          
          if (factor === 0) {
            // Keep original data for first iteration
            augmentedRecord[fieldName] = originalValue;
          } else {
            // Generate variations
            augmentedRecord[fieldName] = this.generateVariation(originalValue, fieldType);
          }
        }

        augmentedData.push(augmentedRecord);
        
        // Update progress
        const totalProcessed = factor * originalCount + i + 1;
        const totalTarget = augmentationFactor * originalCount;
        const progress = Math.floor((totalProcessed / totalTarget) * 90);
        
        if (totalProcessed % 100 === 0) {
          await job.updateProgress(progress, `Augmented ${totalProcessed}/${totalTarget} records`);
        }
      }
    }

    // Trim to exact count if needed
    const finalData = augmentedData.slice(0, job.configuration.recordCount);

    // Write augmented data to file
    const outputPath = await this.writeDataToFile(finalData, job.configuration.outputFormat, job.jobId);
    const outputSize = await this.getFileSize(outputPath);

    const qualityScore = this.calculateAugmentationQuality(inputData, finalData);
    const privacyScore = 85; // Augmentation maintains reasonable privacy

    await job.updateProgress(100, 'Augmentation completed');

    return {
      outputUrl: `/uploads/${path.basename(outputPath)}`,
      outputSize,
      recordsGenerated: finalData.length,
      processingTime: Date.now() - job.startedAt.getTime(),
      qualityScore,
      privacyScore
    };
  }

  async processAnonymization(job) {
    const inputFile = job.configuration.inputFile;
    if (!inputFile) {
      throw new Error('Input file required for anonymization');
    }

    // Get anonymization configuration
    const anonymizationConfig = await AnonymizationConfig.findOne({ jobId: job._id });
    if (!anonymizationConfig) {
      throw new Error('Anonymization configuration not found');
    }

    // Read input data
    const inputData = await this.readDataFromFile(inputFile.path, inputFile.mimetype);
    
    if (inputData.length === 0) {
      throw new Error('Input file contains no data');
    }

    logger.info(`Anonymizing ${inputData.length} records`);

    const anonymizedData = [];
    
    for (let i = 0; i < inputData.length; i++) {
      const record = inputData[i];
      const anonymizedRecord = {};

      // Apply anonymization to each field
      for (const [fieldName, value] of Object.entries(record)) {
        const fieldConfig = anonymizationConfig.fieldsToAnonymize.find(f => f.fieldName === fieldName);
        
        if (fieldConfig && fieldConfig.enabled) {
          anonymizedRecord[fieldName] = this.applyAnonymization(value, fieldConfig.method, fieldConfig.options);
        } else {
          anonymizedRecord[fieldName] = value;
        }
      }

      anonymizedData.push(anonymizedRecord);
      
      // Update progress
      if (i % 100 === 0) {
        const progress = Math.floor((i / inputData.length) * 90);
        await job.updateProgress(progress, `Anonymized ${i}/${inputData.length} records`);
      }
    }

    // Write anonymized data to file
    const outputPath = await this.writeDataToFile(anonymizedData, job.configuration.outputFormat, job.jobId);
    const outputSize = await this.getFileSize(outputPath);

    const qualityScore = this.calculateAnonymizationQuality(inputData, anonymizedData);
    const privacyScore = this.calculateAnonymizationPrivacyScore(anonymizationConfig);

    await job.updateProgress(100, 'Anonymization completed');

    return {
      outputUrl: `/uploads/${path.basename(outputPath)}`,
      outputSize,
      recordsGenerated: anonymizedData.length,
      processingTime: Date.now() - job.startedAt.getTime(),
      qualityScore,
      privacyScore
    };
  }

  async processComplianceGeneration(job) {
    // Generate fully synthetic data that mimics real data patterns but contains no actual PII
    const recordCount = job.configuration.recordCount;
    const complianceLevel = job.configuration.complianceLevel || 'GDPR';
    
    // Use predefined compliance templates
    const template = this.getComplianceTemplate(complianceLevel);
    if (!template) {
      throw new Error(`No template found for compliance level: ${complianceLevel}`);
    }

    const data = [];
    faker.seed(job.configuration.seed);

    logger.info(`Generating ${recordCount} compliance-ready records for ${complianceLevel}`);

    for (let i = 0; i < recordCount; i++) {
      const record = {};
      
      // Generate data based on compliance template
      for (const field of template.fields) {
        record[field.name] = this.generateComplianceField(field);
      }
      
      data.push(record);
      
      if (i % 100 === 0) {
        const progress = Math.floor((i / recordCount) * 90);
        await job.updateProgress(progress, `Generated ${i}/${recordCount} compliant records`);
      }
    }

    // Write data to file
    const outputPath = await this.writeDataToFile(data, job.configuration.outputFormat, job.jobId);
    const outputSize = await this.getFileSize(outputPath);

    const qualityScore = 95; // High quality for template-based generation
    const privacyScore = 100; // Perfect privacy for fully synthetic data

    await job.updateProgress(100, 'Compliance generation completed');

    return {
      outputUrl: `/uploads/${path.basename(outputPath)}`,
      outputSize,
      recordsGenerated: data.length,
      processingTime: Date.now() - job.startedAt.getTime(),
      qualityScore,
      privacyScore
    };
  }

  // Helper methods

  async readDataFromFile(filePath, mimeType) {
    const data = [];
    
    if (mimeType === 'text/csv' || filePath.endsWith('.csv')) {
      return new Promise((resolve, reject) => {
        createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row) => data.push(row))
          .on('end', () => resolve(data))
          .on('error', reject);
      });
    } else if (mimeType === 'application/json' || filePath.endsWith('.json')) {
      const fileContent = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileContent);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  }

  async writeDataToFile(data, format, jobId) {
    const uploadsDir = path.join(__dirname, '../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const timestamp = Date.now();
    const filename = `${jobId}_${timestamp}.${format}`;
    const outputPath = path.join(uploadsDir, filename);

    switch (format) {
      case 'csv':
        await this.writeCSV(data, outputPath);
        break;
      case 'json':
        await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
        break;
      case 'xlsx':
        await this.writeExcel(data, outputPath);
        break;
      default:
        throw new Error(`Unsupported output format: ${format}`);
    }

    return outputPath;
  }

  async writeCSV(data, outputPath) {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).map(key => ({ id: key, title: key }));
    const writer = csvWriter.createObjectCsvWriter({
      path: outputPath,
      header: headers
    });
    
    await writer.writeRecords(data);
  }

  async writeExcel(data, outputPath) {
    // For now, write as CSV (in production, use a proper Excel library like xlsx)
    await this.writeCSV(data, outputPath.replace('.xlsx', '.csv'));
  }

  async getFileSize(filePath) {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  analyzeDataStructure(data) {
    const fieldTypes = {};
    const sample = data[0];
    
    for (const [fieldName, value] of Object.entries(sample)) {
      if (typeof value === 'number') {
        fieldTypes[fieldName] = 'number';
      } else if (typeof value === 'boolean') {
        fieldTypes[fieldName] = 'boolean';
      } else if (value && !isNaN(Date.parse(value))) {
        fieldTypes[fieldName] = 'date';
      } else if (typeof value === 'string' && value.includes('@')) {
        fieldTypes[fieldName] = 'email';
      } else {
        fieldTypes[fieldName] = 'string';
      }
    }
    
    return fieldTypes;
  }

  generateVariation(originalValue, fieldType) {
    if (originalValue === null || originalValue === undefined) {
      return originalValue;
    }

    switch (fieldType) {
      case 'number':
        // Add small random variation (±10%)
        const variation = originalValue * 0.1 * (Math.random() - 0.5) * 2;
        return Math.round((originalValue + variation) * 100) / 100;
        
      case 'email':
        // Generate similar email structure
        const [localPart, domain] = originalValue.split('@');
        return `${faker.internet.userName()}@${domain}`;
        
      case 'date':
        // Vary date by ±30 days
        const originalDate = new Date(originalValue);
        const dayVariation = (Math.random() - 0.5) * 60; // ±30 days
        const newDate = new Date(originalDate.getTime() + dayVariation * 24 * 60 * 60 * 1000);
        return newDate.toISOString().split('T')[0];
        
      case 'string':
        // Generate similar string based on pattern
        if (originalValue.length <= 3) {
          return faker.random.alphaNumeric(originalValue.length);
        }
        return faker.lorem.words(Math.ceil(originalValue.split(' ').length));
        
      default:
        return originalValue;
    }
  }

  applyAnonymization(value, method, options = {}) {
    if (value === null || value === undefined) {
      return value;
    }

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
      default:
        return value;
    }
  }

  maskValue(value, options) {
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
  }

  hashValue(value) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(String(value)).digest('hex').substring(0, 8);
  }

  generalizeValue(value, options) {
    if (typeof value === 'number') {
      const range = options.range || 10;
      return Math.floor(value / range) * range;
    }
    
    if (value && !isNaN(Date.parse(value))) {
      const date = new Date(value);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    return '[GENERALIZED]';
  }

  substituteValue(value, options) {
    const substitutions = options.substitutions || {};
    return substitutions[value] || faker.random.word();
  }

  calculateQualityScore(data, rules) {
    if (data.length === 0) return 0;
    
    let totalScore = 0;
    let fieldCount = 0;
    
    for (const rule of rules) {
      const fieldName = rule.fieldName;
      const fieldValues = data.map(record => record[fieldName]);
      
      // Check for null values
      const nullCount = fieldValues.filter(v => v === null || v === undefined).length;
      const nullRatio = nullCount / fieldValues.length;
      
      // Check for uniqueness if required
      const uniqueValues = new Set(fieldValues);
      const uniqueRatio = uniqueValues.size / fieldValues.length;
      
      // Calculate field score
      let fieldScore = 100;
      fieldScore -= nullRatio * 30; // Penalize excessive nulls
      
      if (rule.ruleDefinition.unique && uniqueRatio < 0.9) {
        fieldScore -= (1 - uniqueRatio) * 40; // Penalize non-unique values when uniqueness is required
      }
      
      totalScore += Math.max(0, fieldScore);
      fieldCount++;
    }
    
    return Math.round(totalScore / fieldCount);
  }

  calculatePrivacyScore(data, rules) {
    // Simple privacy scoring based on rule types and data characteristics
    let privacyScore = 100;
    
    for (const rule of rules) {
      const fieldName = rule.fieldName;
      
      // Check if field might contain PII
      if (this.isPotentialPII(fieldName)) {
        privacyScore -= 10;
      }
      
      // Bonus for anonymization-friendly rule types
      if (['faker', 'pattern', 'range'].includes(rule.ruleType)) {
        privacyScore += 5;
      }
    }
    
    return Math.max(0, Math.min(100, privacyScore));
  }

  calculateAugmentationQuality(originalData, augmentedData) {
    // Compare statistical properties
    const originalStats = this.calculateDataStats(originalData);
    const augmentedStats = this.calculateDataStats(augmentedData);
    
    // Simple similarity score
    let similarity = 0;
    let fieldCount = 0;
    
    for (const field of Object.keys(originalStats)) {
      if (augmentedStats[field]) {
        const originalMean = originalStats[field].mean || 0;
        const augmentedMean = augmentedStats[field].mean || 0;
        
        if (originalMean !== 0) {
          const difference = Math.abs(originalMean - augmentedMean) / originalMean;
          similarity += Math.max(0, 1 - difference);
        } else {
          similarity += 1;
        }
        fieldCount++;
      }
    }
    
    return Math.round((similarity / fieldCount) * 100);
  }

  calculateDataStats(data) {
    const stats = {};
    
    if (data.length === 0) return stats;
    
    const fields = Object.keys(data[0]);
    
    for (const field of fields) {
      const values = data.map(record => record[field]).filter(v => v !== null && v !== undefined);
      const numericValues = values.filter(v => !isNaN(Number(v))).map(Number);
      
      stats[field] = {
        count: values.length,
        nullCount: data.length - values.length,
        uniqueCount: new Set(values).size
      };
      
      if (numericValues.length > 0) {
        stats[field].mean = numericValues.reduce((sum, v) => sum + v, 0) / numericValues.length;
        stats[field].min = Math.min(...numericValues);
        stats[field].max = Math.max(...numericValues);
      }
    }
    
    return stats;
  }

  calculateAnonymizationQuality(originalData, anonymizedData) {
    // Check data utility preservation
    const originalStats = this.calculateDataStats(originalData);
    const anonymizedStats = this.calculateDataStats(anonymizedData);
    
    let utilityScore = 0;
    let fieldCount = 0;
    
    for (const field of Object.keys(originalStats)) {
      if (anonymizedStats[field]) {
        // Compare statistical properties
        const originalCount = originalStats[field].count;
        const anonymizedCount = anonymizedStats[field].count;
        
        if (originalCount > 0) {
          utilityScore += anonymizedCount / originalCount;
        }
        fieldCount++;
      }
    }
    
    return Math.round((utilityScore / fieldCount) * 100);
  }

  calculateAnonymizationPrivacyScore(config) {
    let privacyScore = 50; // Base score
    
    for (const field of config.fieldsToAnonymize) {
      if (field.enabled) {
        switch (field.method) {
          case 'suppress':
            privacyScore += 15;
            break;
          case 'hash':
            privacyScore += 12;
            break;
          case 'mask':
            privacyScore += 8;
            break;
          case 'generalize':
            privacyScore += 6;
            break;
          case 'substitute':
            privacyScore += 10;
            break;
        }
      }
    }
    
    return Math.min(100, privacyScore);
  }

  isPotentialPII(fieldName) {
    const piiKeywords = [
      'name', 'email', 'phone', 'address', 'ssn', 'social', 'credit',
      'passport', 'license', 'id', 'birth', 'age', 'salary', 'income'
    ];
    
    const lowerFieldName = fieldName.toLowerCase();
    return piiKeywords.some(keyword => lowerFieldName.includes(keyword));
  }

  getComplianceTemplate(complianceLevel) {
    const templates = {
      GDPR: {
        fields: [
          { name: 'user_id', type: 'faker', method: 'datatype.uuid' },
          { name: 'first_name', type: 'faker', method: 'name.firstName' },
          { name: 'last_name', type: 'faker', method: 'name.lastName' },
          { name: 'email', type: 'faker', method: 'internet.email' },
          { name: 'country', type: 'faker', method: 'address.country' },
          { name: 'registration_date', type: 'faker', method: 'date.past' },
          { name: 'consent_given', type: 'faker', method: 'datatype.boolean' }
        ]
      },
      HIPAA: {
        fields: [
          { name: 'patient_id', type: 'faker', method: 'datatype.uuid' },
          { name: 'age_group', type: 'range', min: 18, max: 90, step: 5 },
          { name: 'gender', type: 'list', values: ['M', 'F', 'O'] },
          { name: 'diagnosis_code', type: 'pattern', pattern: 'ICD-{digit}{digit}{digit}' },
          { name: 'treatment_date', type: 'faker', method: 'date.recent' },
          { name: 'provider_id', type: 'faker', method: 'datatype.uuid' }
        ]
      }
    };
    
    return templates[complianceLevel];
  }

  generateComplianceField(field) {
    switch (field.type) {
      case 'faker':
        const methodParts = field.method.split('.');
        let fakerMethod = faker;
        for (const part of methodParts) {
          fakerMethod = fakerMethod[part];
        }
        return fakerMethod();
        
      case 'range':
        return Math.floor(Math.random() * (field.max - field.min + 1)) + field.min;
        
      case 'list':
        return field.values[Math.floor(Math.random() * field.values.length)];
        
      case 'pattern':
        return field.pattern.replace(/\{(\w+)\}/g, (match, type) => {
          switch (type) {
            case 'digit': return Math.floor(Math.random() * 10).toString();
            case 'letter': return String.fromCharCode(65 + Math.floor(Math.random() * 26));
            default: return match;
          }
        });
        
      default:
        return null;
    }
  }

  getJobStatus(jobId) {
    return this.activeJobs.get(jobId) || null;
  }

  cancelJob(jobId) {
    if (this.activeJobs.has(jobId)) {
      this.activeJobs.delete(jobId);
      return true;
    }
    return false;
  }
}

export default new DataGenerationEngine();
