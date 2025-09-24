import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { DataService } from '../services/dataService';
import type { InputDataset } from '../types';

const TEST_DATA_DIR = 'test-data';
const TEST_INPUT_DATASETS_FILE = join(TEST_DATA_DIR, 'inputDatasets.json');

// Mock the data directory for tests
const originalDataDir = process.env.DATA_DIR;

describe('DataService Input Datasets', () => {
  let dataService: DataService;

  beforeEach(() => {
    // Clean up any existing test files
    if (existsSync(TEST_INPUT_DATASETS_FILE)) {
      unlinkSync(TEST_INPUT_DATASETS_FILE);
    }
    
    // Get a fresh instance for each test
    // Note: In a real test setup, we'd want to mock the singleton pattern
    dataService = DataService.getInstance();
  });

  afterEach(() => {
    // Clean up test files
    if (existsSync(TEST_INPUT_DATASETS_FILE)) {
      unlinkSync(TEST_INPUT_DATASETS_FILE);
    }
  });

  describe('loadInputDatasets', () => {
    test('should initialize empty datasets when file does not exist', () => {
      // The constructor should have already loaded empty datasets
      const dataset = dataService.getInputDataset('test-scenario', 'domesticDemandForecast');
      expect(dataset).toBeNull();
    });

    test('should load existing datasets from file', () => {
      // Create a test file with sample data
      const testData = {
        'scenario1-domesticDemandForecast': {
          scenarioId: 'scenario1',
          tableId: 'domesticDemandForecast',
          title: 'Test Dataset',
          rows: [{ periodId: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }],
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
        }
      };
      
      // Note: This test would need proper file mocking in a real test environment
      // For now, we'll test the behavior assuming the file operations work
    });

    test('should handle invalid JSON gracefully', () => {
      // This would test error handling when JSON.parse fails
      // Implementation would depend on proper file mocking
    });
  });

  describe('getInputDataset', () => {
    test('should return null for non-existent dataset', () => {
      const result = dataService.getInputDataset('non-existent-scenario', 'domesticDemandForecast');
      expect(result).toBeNull();
    });

    test('should return dataset when it exists', () => {
      // First save a dataset
      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: [{ periodId: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }],
        selectors: { location: { dependencies: [], items: ['Madrid'] }, product: { dependencies: [], items: ['Gasoline'] } }
      };

      const saved = dataService.saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);
      
      // Then retrieve it
      const retrieved = dataService.getInputDataset('test-scenario', 'domesticDemandForecast');
      
      expect(retrieved).not.toBeNull();
      expect(retrieved?.scenarioId).toBe('test-scenario');
      expect(retrieved?.tableId).toBe('domesticDemandForecast');
      expect(retrieved?.title).toBe('Test Dataset');
      expect(retrieved?.rows).toHaveLength(1);
    });
  });

  describe('saveInputDataset', () => {
    test('should save new dataset with timestamps', () => {
      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'New Dataset',
        rows: [
          { periodId: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 },
          { periodId: 2, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 }
        ],
        selectors: { location: { dependencies: [], items: ['Madrid', 'Barcelona'] }, product: { dependencies: [], items: ['Gasoline', 'Diesel'] } }
      };

      const result = dataService.saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);

      expect(result.scenarioId).toBe('test-scenario');
      expect(result.tableId).toBe('domesticDemandForecast');
      expect(result.title).toBe('New Dataset');
      expect(result.rows).toHaveLength(2);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    test('should update existing dataset preserving createdAt', async () => {
      const originalDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Original Dataset',
        rows: [{ periodId: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }],
        selectors: { location: { dependencies: [], items: ['Madrid'] }, product: { dependencies: [], items: ['Gasoline'] } }
      };

      // Save original
      const original = dataService.saveInputDataset('test-scenario', 'domesticDemandForecast', originalDataset);
      
      // Wait a bit to ensure different timestamps
      const originalCreatedAt = original.createdAt;
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Update with new data
      const updatedDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Updated Dataset',
        rows: [
          { periodId: 1, location: 'Madrid', product: 'Gasoline', volume: 1500, price: 1.6, minVolume: 600 },
          { periodId: 2, location: 'Barcelona', product: 'Diesel', volume: 2500, price: 1.4, minVolume: 900 }
        ],
        selectors: { location: { dependencies: [], items: ['Madrid', 'Barcelona'] }, product: { dependencies: [], items: ['Gasoline', 'Diesel'] } }
      };

      const updated = dataService.saveInputDataset('test-scenario', 'domesticDemandForecast', updatedDataset);

      expect(updated.createdAt).toBe(originalCreatedAt);
      expect(updated.updatedAt).not.toBe(original.updatedAt);
      expect(updated.title).toBe('Updated Dataset');
      expect(updated.rows).toHaveLength(2);
    });
  });

  describe('inputDatasetExists', () => {
    test('should return false for non-existent dataset', () => {
      const exists = dataService.inputDatasetExists('non-existent-scenario', 'domesticDemandForecast');
      expect(exists).toBe(false);
    });

    test('should return true for existing dataset', () => {
      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: []
      };

      dataService.saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);
      
      const exists = dataService.inputDatasetExists('test-scenario', 'domesticDemandForecast');
      expect(exists).toBe(true);
    });
  });

  describe('deleteInputDataset', () => {
    test('should return false for non-existent dataset', () => {
      const deleted = dataService.deleteInputDataset('non-existent-scenario', 'domesticDemandForecast');
      expect(deleted).toBe(false);
    });

    test('should delete existing dataset and return true', () => {
      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: []
      };

      // Save dataset
      dataService.saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);
      
      // Verify it exists
      expect(dataService.inputDatasetExists('test-scenario', 'domesticDemandForecast')).toBe(true);
      
      // Delete it
      const deleted = dataService.deleteInputDataset('test-scenario', 'domesticDemandForecast');
      expect(deleted).toBe(true);
      
      // Verify it's gone
      expect(dataService.inputDatasetExists('test-scenario', 'domesticDemandForecast')).toBe(false);
    });
  });

  describe('generateDatasetKey', () => {
    test('should generate consistent keys', () => {
      // This tests the private method indirectly through public methods
      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: []
      };

      // Save with same scenario/table combination
      dataService.saveInputDataset('scenario1', 'domesticDemandForecast', testDataset);
      
      // Should be able to retrieve with same combination
      const retrieved = dataService.getInputDataset('scenario1', 'domesticDemandForecast');
      expect(retrieved).not.toBeNull();
      
      // Should not be retrievable with different combination
      const notFound = dataService.getInputDataset('scenario2', 'domesticDemandForecast');
      expect(notFound).toBeNull();
    });
  });
});