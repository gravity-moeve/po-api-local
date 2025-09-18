import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { getInputDataset, saveInputDataset } from '../controllers/inputDatasetsController';
import { DataService } from '../services/dataService';
import type { InputDataset, TableId } from '../types';

// Mock the DataService
const mockDataService = {
  scenarioExists: mock(() => true),
  getInputDataset: mock(() => null),
  saveInputDataset: mock(() => ({
    scenarioId: 'test-scenario',
    tableId: 'domesticDemandForecast',
    title: 'Test Dataset',
    rows: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }))
};

// Mock DataService.getInstance()
mock.module('../services/dataService', () => ({
  DataService: {
    getInstance: () => mockDataService
  }
}));

describe('InputDatasetsController', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockDataService.scenarioExists.mockClear();
    mockDataService.getInputDataset.mockClear();
    mockDataService.saveInputDataset.mockClear();
  });

  describe('getInputDataset', () => {
    test('should return null when scenario does not exist', () => {
      mockDataService.scenarioExists.mockReturnValue(false);

      const result = getInputDataset('non-existent-scenario', 'domesticDemandForecast');

      expect(result).toBeNull();
      expect(mockDataService.scenarioExists).toHaveBeenCalledWith('non-existent-scenario');
    });

    test('should return null when dataset does not exist', () => {
      mockDataService.scenarioExists.mockReturnValue(true);
      mockDataService.getInputDataset.mockReturnValue(null);

      const result = getInputDataset('test-scenario', 'domesticDemandForecast');

      expect(result).toBeNull();
      expect(mockDataService.getInputDataset).toHaveBeenCalledWith('test-scenario', 'domesticDemandForecast');
    });

    test('should return paginated dataset when it exists', () => {
      const mockStoredDataset = {
        scenarioId: 'test-scenario',
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 },
          { period: 2, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 },
          { period: 3, location: 'Valencia', product: 'Gasoline', volume: 1500, price: 1.4, minVolume: 600 }
        ],
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      };

      mockDataService.scenarioExists.mockReturnValue(true);
      mockDataService.getInputDataset.mockReturnValue(mockStoredDataset);

      const result = getInputDataset('test-scenario', 'domesticDemandForecast', 1, 2);

      expect(result).not.toBeNull();
      expect(result?.tableId).toBe('domesticDemandForecast');
      expect(result?.title).toBe('Test Dataset');
      expect(result?.rows).toHaveLength(2); // Paginated to 2 items
      expect(result?.rows[0]).toEqual(mockStoredDataset.rows[0]);
      expect(result?.rows[1]).toEqual(mockStoredDataset.rows[1]);
    });

    test('should handle pagination correctly', () => {
      const mockStoredDataset = {
        scenarioId: 'test-scenario',
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: Array.from({ length: 10 }, (_, i) => ({ 
          period: i + 1, 
          location: `Location${i}`, 
          product: 'Gasoline', 
          volume: 1000 + i, 
          price: 1.5, 
          minVolume: 500 
        })),
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      };

      mockDataService.scenarioExists.mockReturnValue(true);
      mockDataService.getInputDataset.mockReturnValue(mockStoredDataset);

      // Test page 2 with page size 3
      const result = getInputDataset('test-scenario', 'domesticDemandForecast', 2, 3);

      expect(result?.rows).toHaveLength(3);
      expect(result?.rows[0]?.period).toBe(4); // Should start from index 3 (page 2, size 3)
      expect(result?.rows[1]?.period).toBe(5);
      expect(result?.rows[2]?.period).toBe(6);
    });
  });

  describe('saveInputDataset', () => {
    test('should return 404 when scenario does not exist', () => {
      mockDataService.scenarioExists.mockReturnValue(false);

      const testDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: []
      };

      const result = saveInputDataset('non-existent-scenario', 'domesticDemandForecast', testDataset);

      expect(result.success).toBe(false);
      expect(result.success === false && result.code).toBe(404);
      expect(result.success === false && result.error).toBe('Scenario not found');
    });

    test('should return 422 for invalid payload structure', () => {
      mockDataService.scenarioExists.mockReturnValue(true);

      const invalidDataset = {
        // Missing tableId
        title: 'Test Dataset',
        rows: []
      };

      const result = saveInputDataset('test-scenario', 'domesticDemandForecast', invalidDataset);

      expect(result.success).toBe(false);
      expect(result.success === false && result.code).toBe(422);
      expect(result.success === false && result.error).toContain('Validation error');
    });

    test('should return 400 for tableId mismatch', () => {
      mockDataService.scenarioExists.mockReturnValue(true);

      const testDataset = {
        tableId: 'importOpportunities', // Different from URL parameter
        title: 'Test Dataset',
        rows: []
      };

      const result = saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);

      expect(result.success).toBe(false);
      expect(result.success === false && result.code).toBe(400);
      expect(result.success === false && result.error).toContain('TableId mismatch');
    });

    test('should save valid dataset successfully', () => {
      mockDataService.scenarioExists.mockReturnValue(true);
      
      const mockSavedDataset = {
        scenarioId: 'test-scenario',
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }
        ],
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z'
      };

      mockDataService.saveInputDataset.mockReturnValue(mockSavedDataset);

      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }
        ]
      };

      const result = saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scenarioId).toBe('test-scenario');
        expect(result.data.tableId).toBe('domesticDemandForecast');
        expect(result.data.rowCount).toBe(1);
        expect(result.data.updatedAt).toBe('2025-01-01T12:00:00.000Z');
      }

      expect(mockDataService.saveInputDataset).toHaveBeenCalledWith('test-scenario', 'domesticDemandForecast', testDataset);
    });

    test('should handle service layer errors', () => {
      mockDataService.scenarioExists.mockReturnValue(true);
      mockDataService.saveInputDataset.mockImplementation(() => {
        throw new Error('Database error');
      });

      const testDataset: InputDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: []
      };

      const result = saveInputDataset('test-scenario', 'domesticDemandForecast', testDataset);

      expect(result.success).toBe(false);
      expect(result.success === false && result.code).toBe(500);
      expect(result.success === false && result.error).toBe('Failed to save dataset');
    });

    test('should validate all required fields', () => {
      mockDataService.scenarioExists.mockReturnValue(true);

      const testCases = [
        { payload: { title: 'Test', rows: [] }, expectedError: 'tableId' },
        { payload: { tableId: 'domesticDemandForecast', rows: [] }, expectedError: 'title' },
        { payload: { tableId: 'domesticDemandForecast', title: 'Test' }, expectedError: 'rows' },
        { payload: { tableId: 'domesticDemandForecast', title: 'Test', rows: 'not-array' }, expectedError: 'rows' }
      ];

      testCases.forEach(({ payload, expectedError }) => {
        const result = saveInputDataset('test-scenario', 'domesticDemandForecast', payload);
        
        expect(result.success).toBe(false);
        expect(result.success === false && result.code).toBe(422);
        expect(result.success === false && result.error).toContain(expectedError);
      });
    });

    test('should validate tableId enum values', () => {
      mockDataService.scenarioExists.mockReturnValue(true);

      const invalidDataset = {
        tableId: 'invalidTableId',
        title: 'Test Dataset',
        rows: []
      };

      const result = saveInputDataset('test-scenario', 'domesticDemandForecast', invalidDataset);

      expect(result.success).toBe(false);
      expect(result.success === false && result.code).toBe(422);
      expect(result.success === false && result.error).toContain('Invalid tableId');
    });
  });
});