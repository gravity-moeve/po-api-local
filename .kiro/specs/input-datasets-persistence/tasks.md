# Implementation Plan

- [x] 1. Extend DataService with input dataset persistence methods
  - Add private properties for input datasets storage and file path constants
  - Implement loadInputDatasets() method to read from JSON file with error handling
  - Implement saveInputDatasets() method to write to JSON file with error handling
  - Add generateDatasetKey() helper method to create composite keys from scenarioId and tableId
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 2. Implement core input dataset CRUD operations in DataService
  - Add getInputDataset() method to retrieve dataset by scenarioId and tableId
  - Add saveInputDataset() method to store dataset with timestamps and validation
  - Add inputDatasetExists() method to check if dataset exists for scenario/table combination
  - Add deleteInputDataset() method for cleanup operations
  - Initialize input datasets loading in DataService constructor
  - _Requirements: 1.1, 2.1, 2.2, 3.1_

- [x] 3. Create input dataset validation utilities
  - Create validation function to verify InputDataset payload structure (tableId, title, rows)
  - Add validation to ensure tableId in URL matches tableId in payload
  - Create helper function to validate TableId enum values
  - Add validation for required fields and data types
  - _Requirements: 1.4, 1.5_

- [x] 4. Update inputDatasetsController to use persistent storage for GET operations
  - Modify getInputDataset() method to use DataService instead of mock data
  - Update method to return null when no data exists instead of mock data
  - Maintain existing pagination functionality with persistent data
  - Add scenario existence validation before dataset retrieval
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 5. Implement saveInputDataset method in inputDatasetsController
  - Create new saveInputDataset() method that accepts scenarioId, tableId, and InputDataset
  - Add comprehensive validation using the validation utilities from task 3
  - Integrate with DataService to persist the dataset
  - Return appropriate success response with metadata (rowCount, updatedAt)
  - Handle all error scenarios with proper error responses
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2_

- [x] 6. Add PUT route handler for input dataset persistence
  - Create handleInputDatasetPutRoute() function in scenariosRoutes.ts
  - Parse request body and extract scenarioId/tableId from URL parameters
  - Integrate with saveInputDataset controller method
  - Add proper error handling for JSON parsing and validation errors
  - Return appropriate HTTP status codes (201 for creation, 200 for updates)
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 7. Integrate PUT route into main routing logic
  - Update server routing to handle PUT requests to /scenarios/{scenarioId}/inputs/{tableId}/dataset
  - Ensure proper URL parameter extraction for scenarioId and tableId
  - Add route to existing scenario-related routing structure
  - Test route integration with existing GET functionality
  - _Requirements: 1.1_

- [x] 8. Create comprehensive unit tests for DataService input dataset methods
  - Write tests for loadInputDatasets() with various file states (missing, invalid JSON, valid data)
  - Test saveInputDatasets() file writing operations and error handling
  - Test getInputDataset() with existing and non-existing data scenarios
  - Test saveInputDataset() with valid data and edge cases
  - Test inputDatasetExists() method accuracy
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 9. Create unit tests for controller layer input dataset operations
  - Test updated getInputDataset() method with persistent storage
  - Test saveInputDataset() method with valid and invalid payloads
  - Test pagination functionality with persistent data
  - Test error handling for scenario validation and data validation
  - Test edge cases like empty datasets and large row counts
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 10. Create integration tests for complete PUT and GET workflows
  - Test full PUT workflow from route to file system persistence
  - Test GET workflow retrieving previously stored data
  - Test scenario validation integration across the full stack
  - Test error propagation from service layer to HTTP responses
  - Test concurrent access scenarios and data consistency
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1_