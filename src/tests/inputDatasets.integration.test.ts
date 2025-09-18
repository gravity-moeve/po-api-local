import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

// Integration tests for the complete input datasets workflow
// These tests would run against a test server instance

const TEST_BASE_URL = 'http://localhost:3002'; // Use different port for tests
const TEST_DATA_DIR = 'test-data';

describe('Input Datasets Integration Tests', () => {
  let testServer: any;

  beforeAll(async () => {
    // In a real test setup, we would start a test server here
    // For now, we'll document the test structure
    console.log('Integration tests would start test server on port 3002');
  });

  afterAll(async () => {
    // Clean up test server
    if (testServer) {
      testServer.stop();
    }
    
    // Clean up test data files
    const testFiles = [
      join(TEST_DATA_DIR, 'scenarios.json'),
      join(TEST_DATA_DIR, 'scenarioPeriods.json'),
      join(TEST_DATA_DIR, 'inputDatasets.json')
    ];
    
    testFiles.forEach(file => {
      if (existsSync(file)) {
        unlinkSync(file);
      }
    });
  });

  beforeEach(async () => {
    // Reset test data before each test
    // In a real setup, we'd reset the test database/files
  });

  describe('Complete PUT Workflow', () => {
    test('should save dataset through full stack', async () => {
      // This test would verify the complete flow:
      // Route -> Controller -> Service -> File System
      
      const testDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Integration Test Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 },
          { period: 2, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 }
        ]
      };

      // Mock fetch request to test server
      const response = await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDataset)
      });

      expect(response.status).toBe(201);
      
      const responseData = await response.json();
      expect(responseData.scenarioId).toBe('1');
      expect(responseData.tableId).toBe('domesticDemandForecast');
      expect(responseData.rowCount).toBe(2);
      expect(responseData.updatedAt).toBeDefined();

      // Verify file was created
      const dataFile = join(TEST_DATA_DIR, 'inputDatasets.json');
      expect(existsSync(dataFile)).toBe(true);
    });

    test('should handle validation errors in full stack', async () => {
      const invalidDataset = {
        tableId: 'importOpportunities', // Mismatch with URL
        title: 'Invalid Dataset',
        rows: []
      };

      const response = await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidDataset)
      });

      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.message).toContain('TableId mismatch');
    });

    test('should handle scenario not found', async () => {
      const testDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Test Dataset',
        rows: []
      };

      const response = await fetch(`${TEST_BASE_URL}/api/scenarios/non-existent/inputs/domesticDemandForecast/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDataset)
      });

      expect(response.status).toBe(404);
    });

    test('should handle invalid JSON body', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });

      expect(response.status).toBe(400);
      
      const errorData = await response.json();
      expect(errorData.message).toBe('Invalid JSON body');
    });
  });

  describe('Complete GET Workflow', () => {
    test('should retrieve previously stored dataset', async () => {
      // First, store a dataset
      const testDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Retrieval Test Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 },
          { period: 2, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 },
          { period: 3, location: 'Valencia', product: 'Gasoline', volume: 1500, price: 1.4, minVolume: 600 }
        ]
      };

      await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDataset)
      });

      // Then retrieve it
      const getResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`);
      
      expect(getResponse.status).toBe(200);
      
      const retrievedData = await getResponse.json();
      expect(retrievedData.tableId).toBe('domesticDemandForecast');
      expect(retrievedData.title).toBe('Retrieval Test Dataset');
      expect(retrievedData.rows).toHaveLength(3);
    });

    test('should handle pagination correctly', async () => {
      // Store dataset with multiple rows
      const testDataset = {
        tableId: 'domesticDemandForecast',
        title: 'Pagination Test Dataset',
        rows: Array.from({ length: 10 }, (_, i) => ({
          period: i + 1,
          location: `Location${i}`,
          product: 'Gasoline',
          volume: 1000 + i,
          price: 1.5,
          minVolume: 500
        }))
      };

      await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDataset)
      });

      // Test pagination
      const getResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset?page=2&pageSize=3`);
      
      expect(getResponse.status).toBe(200);
      
      const paginatedData = await getResponse.json();
      expect(paginatedData.rows).toHaveLength(3);
      expect(paginatedData.rows[0].period).toBe(4); // Second page, starting from period 4
    });

    test('should return 404 for non-existent dataset', async () => {
      const getResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/1/inputs/importOpportunities/dataset`);
      
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 for non-existent scenario', async () => {
      const getResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/non-existent/inputs/domesticDemandForecast/dataset`);
      
      expect(getResponse.status).toBe(404);
    });
  });

  describe('Data Consistency Tests', () => {
    test('should maintain data consistency across multiple operations', async () => {
      const scenarioId = 'consistency-test';
      const tableId = 'domesticDemandForecast';
      
      // Create initial dataset
      const initialDataset = {
        tableId,
        title: 'Initial Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }
        ]
      };

      const createResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/${scenarioId}/inputs/${tableId}/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initialDataset)
      });

      expect(createResponse.status).toBe(201);
      const createData = await createResponse.json();
      const initialUpdatedAt = createData.updatedAt;

      // Update the dataset
      const updatedDataset = {
        tableId,
        title: 'Updated Dataset',
        rows: [
          { period: 1, location: 'Madrid', product: 'Gasoline', volume: 1500, price: 1.6, minVolume: 600 },
          { period: 2, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 }
        ]
      };

      const updateResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/${scenarioId}/inputs/${tableId}/dataset`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDataset)
      });

      expect(updateResponse.status).toBe(201);
      const updateData = await updateResponse.json();
      expect(updateData.rowCount).toBe(2);
      expect(updateData.updatedAt).not.toBe(initialUpdatedAt);

      // Verify the update persisted
      const getResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/${scenarioId}/inputs/${tableId}/dataset`);
      const retrievedData = await getResponse.json();
      
      expect(retrievedData.title).toBe('Updated Dataset');
      expect(retrievedData.rows).toHaveLength(2);
      expect(retrievedData.rows[0].volume).toBe(1500);
    });

    test('should handle concurrent access scenarios', async () => {
      // This test would verify behavior under concurrent access
      // In a real implementation, we'd test race conditions and data integrity
      
      const scenarioId = 'concurrent-test';
      const tableId = 'domesticDemandForecast';
      
      const dataset1 = {
        tableId,
        title: 'Concurrent Dataset 1',
        rows: [{ period: 1, location: 'Madrid', product: 'Gasoline', volume: 1000, price: 1.5, minVolume: 500 }]
      };

      const dataset2 = {
        tableId,
        title: 'Concurrent Dataset 2',
        rows: [{ period: 1, location: 'Barcelona', product: 'Diesel', volume: 2000, price: 1.3, minVolume: 800 }]
      };

      // Simulate concurrent requests
      const [response1, response2] = await Promise.all([
        fetch(`${TEST_BASE_URL}/api/scenarios/${scenarioId}/inputs/${tableId}/dataset`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataset1)
        }),
        fetch(`${TEST_BASE_URL}/api/scenarios/${scenarioId}/inputs/${tableId}/dataset`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataset2)
        })
      ]);

      // Both should succeed
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);

      // Final state should be consistent (last write wins)
      const getResponse = await fetch(`${TEST_BASE_URL}/api/scenarios/${scenarioId}/inputs/${tableId}/dataset`);
      const finalData = await getResponse.json();
      
      // Should have one of the two datasets
      expect(['Concurrent Dataset 1', 'Concurrent Dataset 2']).toContain(finalData.title);
    });
  });

  describe('Error Propagation Tests', () => {
    test('should propagate service layer errors to HTTP responses', async () => {
      // Test various error scenarios and ensure proper HTTP status codes
      
      const testCases = [
        {
          scenario: 'invalid-table-id',
          url: `${TEST_BASE_URL}/api/scenarios/1/inputs/invalidTableId/dataset`,
          expectedStatus: 400,
          expectedMessage: 'Invalid table ID'
        },
        {
          scenario: 'missing-required-fields',
          url: `${TEST_BASE_URL}/api/scenarios/1/inputs/domesticDemandForecast/dataset`,
          body: { title: 'Missing tableId' },
          expectedStatus: 422,
          expectedMessage: 'Validation error'
        }
      ];

      for (const testCase of testCases) {
        const response = await fetch(testCase.url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.body || {})
        });

        expect(response.status).toBe(testCase.expectedStatus);
        
        const errorData = await response.json();
        expect(errorData.message).toContain(testCase.expectedMessage);
      }
    });
  });
});

// Helper function to create test scenarios
async function createTestScenario(scenarioId: string) {
  const testScenario = {
    name: `Test Scenario ${scenarioId}`,
    periods: [
      { id: 1, startDate: '2025-01-01', endDate: '2025-03-31' }
    ]
  };

  return fetch(`${TEST_BASE_URL}/api/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testScenario)
  });
}