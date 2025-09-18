# Design Document

## Overview

This design implements persistent storage for input datasets, replacing the current mock data approach with a file-based persistence system that follows the same patterns established for scenarios and scenario periods. The system will store dataset data per scenario/table combination and provide both GET and PUT endpoints for data retrieval and storage.

## Architecture

The implementation follows the existing layered architecture:

```
Routes Layer (scenariosRoutes.ts)
    ↓
Controller Layer (inputDatasetsController.ts)
    ↓
Service Layer (dataService.ts)
    ↓
File System (data/inputDatasets.json)
```

### Key Design Decisions

1. **File-based Storage**: Following the existing pattern with scenarios, we'll use JSON files in the `data/` directory
2. **Composite Key Structure**: Data will be organized by `scenarioId-tableId` combinations to enable efficient lookups
3. **Service Layer Extension**: Extend the existing `DataService` class to handle input datasets
4. **Backward Compatibility**: Maintain existing API contracts while replacing mock behavior

## Components and Interfaces

### Data Storage Structure

The input datasets will be stored in `data/inputDatasets.json` with the following structure:

```typescript
type StoredInputDataset = {
  scenarioId: string;
  tableId: string;
  title: string;
  rows: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
};

type InputDatasetsStorage = {
  [key: string]: StoredInputDataset; // key format: "scenarioId-tableId"
};
```

### Service Layer Methods

Extend `DataService` class with new methods:

```typescript
class DataService {
  // New methods for input datasets
  public getInputDataset(scenarioId: string, tableId: string): StoredInputDataset | null
  public saveInputDataset(scenarioId: string, tableId: string, dataset: InputDataset): StoredInputDataset
  public deleteInputDataset(scenarioId: string, tableId: string): boolean
  public inputDatasetExists(scenarioId: string, tableId: string): boolean
  
  // Private helper methods
  private loadInputDatasets(): void
  private saveInputDatasets(): void
  private generateDatasetKey(scenarioId: string, tableId: string): string
}
```

### Controller Layer Updates

Update `inputDatasetsController.ts` to use the service layer:

```typescript
// Updated method signatures
export const getInputDataset = (scenarioId: string, tableId: TableId, page?: number, pageSize?: number): InputDatasetByTable | null

export const saveInputDataset = (scenarioId: string, tableId: TableId, dataset: InputDataset): { success: boolean; error?: string }
```

### Route Layer Updates

Add new PUT route handler in `scenariosRoutes.ts`:

```typescript
export const handleInputDatasetRoute = (req: Request, scenarioId: string, tableId: string): Response
```

## Data Models

### Request/Response Models

```typescript
// PUT request payload (already defined in types)
type InputDataset = {
  tableId: string;
  title: string;
  rows: Record<string, any>[];
};

// Success response for PUT
type DatasetSaveResponse = {
  scenarioId: string;
  tableId: string;
  rowCount: number;
  updatedAt: string;
};
```

### Validation Rules

1. **Scenario Validation**: Verify scenario exists before allowing dataset operations
2. **TableId Validation**: Ensure tableId is one of the valid TableId enum values
3. **Payload Validation**: Validate required fields (tableId, title, rows)
4. **Data Consistency**: Ensure tableId in URL matches tableId in payload

## Error Handling

### Error Scenarios and Responses

1. **Scenario Not Found (404)**:
   ```json
   { "code": 404, "message": "Scenario not found" }
   ```

2. **Invalid TableId (400)**:
   ```json
   { "code": 400, "message": "Invalid table ID" }
   ```

3. **Validation Error (422)**:
   ```json
   { "code": 422, "message": "Validation error: missing required fields" }
   ```

4. **TableId Mismatch (400)**:
   ```json
   { "code": 400, "message": "TableId in URL does not match payload" }
   ```

### File System Error Handling

- Follow existing patterns from scenario persistence
- Log errors and provide fallback behavior
- Graceful degradation when file operations fail

## Testing Strategy

### Unit Tests

1. **Service Layer Tests**:
   - Test CRUD operations for input datasets
   - Test file loading/saving operations
   - Test error scenarios (file not found, invalid JSON)

2. **Controller Layer Tests**:
   - Test GET endpoint with existing and non-existing data
   - Test PUT endpoint with valid and invalid payloads
   - Test pagination functionality

3. **Integration Tests**:
   - Test complete flow from route to file system
   - Test scenario validation integration
   - Test concurrent access scenarios

### Test Data

Create test fixtures that mirror the existing table structures:
- Sample datasets for each TableId type
- Edge cases (empty rows, large datasets)
- Invalid data scenarios

## Implementation Flow

### GET Endpoint Flow

1. Extract scenarioId and tableId from URL
2. Validate scenario exists using DataService
3. Attempt to retrieve dataset from storage
4. If found: return dataset with pagination
5. If not found: return null/empty response
6. Handle errors appropriately

### PUT Endpoint Flow

1. Extract scenarioId and tableId from URL
2. Parse and validate request payload
3. Validate scenario exists
4. Validate tableId matches between URL and payload
5. Save dataset using DataService
6. Return success response with metadata
7. Handle validation and storage errors

## Migration Strategy

### Phase 1: Infrastructure
- Extend DataService with input dataset methods
- Create data file structure
- Add validation utilities

### Phase 2: Controller Updates
- Update getInputDataset to use persistent storage
- Implement saveInputDataset method
- Maintain backward compatibility

### Phase 3: Route Integration
- Add PUT route handler
- Update existing GET route to use new controller
- Add comprehensive error handling

### Phase 4: Testing & Validation
- Comprehensive testing of all scenarios
- Performance validation with large datasets
- Error handling verification