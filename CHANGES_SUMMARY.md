# API Updates Summary

## Changes Made to Match OpenAPI Specification

### 1. New Endpoints Added

#### PUT /api/scenarios/{scenarioId}
- **Purpose**: Update scenario name
- **Request Body**: `{ name: string }` (max 95 characters)
- **Response**: `IdResponse` with scenario ID
- **Error Handling**: 
  - 422 for duplicate names
  - 400 for missing/invalid data
  - 404 for scenario not found

#### POST /api/scenarios/{scenarioId}/cancel
- **Purpose**: Cancel running simulation for a scenario
- **Response**: `IdResponse` with scenario ID
- **Error Handling**: 404 for scenario not found

#### POST /api/scenarios/{scenarioId}/duplicate
- **Purpose**: Create a copy of an existing scenario
- **Response**: `IdResponse` with new scenario ID
- **Error Handling**: 404 for scenario not found
- **Behavior**: Creates copy with "(Copy)" suffix and "draft" status

### 2. Enhanced Validation

#### POST /api/scenarios (Create Scenario)
- **Added**: Duplicate name validation
- **Error Response**: 422 with message "Validation error occurred while creating scenario: name already exists"
- **Maintains**: Existing 3-second delay for realistic simulation

### 3. Updated Controllers

#### scenariosController.ts
- **Added**: `updateScenarioName()` function
- **Added**: `duplicateScenario()` function
- **Enhanced**: Duplicate name checking in create and update operations

#### simulationController.ts
- **Added**: `cancelSimulation()` function
- **Updated**: `runSimulation()` to use proper date format (YYYY-MM-DD)
- **Enhanced**: Status management for canceled simulations

### 4. Route Updates

#### scenariosRoutes.ts
- **Enhanced**: `handleScenarioByIdRoute()` to support PUT method
- **Added**: `handleScenarioDuplicateRoute()` function
- **Added**: Comprehensive validation and error handling

#### simulationRoutes.ts
- **Added**: `handleSimulationCancelRoute()` function

### 5. Server Configuration

#### server.ts
- **Added**: Route matching for new endpoints:
  - `/api/scenarios/{id}/cancel`
  - `/api/scenarios/{id}/duplicate`
- **Updated**: Console logging to reflect all available endpoints
- **Maintained**: Existing `/api` prefix for all routes

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scenarios/statuses` | Get all scenario statuses |
| GET | `/api/scenarios` | Get scenarios (with optional filters) |
| POST | `/api/scenarios` | Create new scenario |
| GET | `/api/scenarios/{id}` | Get scenario general info |
| **PUT** | `/api/scenarios/{id}` | **Update scenario name** |
| GET | `/api/scenarios/inputs/definitions` | Get table definitions |
| GET | `/api/scenarios/{id}/inputs/{tableId}/dataset` | Get input dataset |
| PUT | `/api/scenarios/{id}/inputs/{tableId}/dataset` | Replace dataset |
| POST | `/api/scenarios/{id}/inputs/{tableId}/dataset/upload-csv` | Upload CSV |
| POST | `/api/scenarios/{id}/inputs/{tableId}/dataset/sync-from-datalake` | Sync from datalake |
| POST | `/api/scenarios/{id}/inputs/{tableId}/dataset/download-csv` | Generate download link |
| POST | `/api/scenarios/{id}/run` | Run simulation |
| **POST** | `/api/scenarios/{id}/cancel` | **Cancel simulation** |
| **POST** | `/api/scenarios/{id}/duplicate` | **Duplicate scenario** |

## Error Handling

All new endpoints follow the OpenAPI specification error format:
```json
{
  "code": number,
  "message": string
}
```

### Status Codes Used:
- **200**: Success
- **201**: Created (for POST /scenarios)
- **202**: Accepted (for simulation run)
- **400**: Bad Request (invalid data)
- **404**: Not Found (scenario doesn't exist)
- **405**: Method Not Allowed
- **422**: Validation Error (duplicate names)

## Data Persistence Implementation

### New Persistence Layer
- **DataService**: Singleton service for centralized data management
- **File-based Storage**: Scenarios automatically saved to `data/scenarios.json`
- **Real-time Persistence**: All CRUD operations immediately persist to disk
- **Default Data**: Ships with 7 pre-configured scenarios
- **Error Handling**: Graceful fallback to defaults on file issues

### Updated Controllers
- **scenariosController.ts**: Now uses DataService instead of in-memory array
- **simulationController.ts**: Updated to persist status changes
- **Validation**: Duplicate name checking now uses persistent data

### Benefits
- Data survives server restarts
- Easy to inspect and modify (JSON format)
- No database setup required
- Automatic directory and file creation
- Thread-safe singleton pattern

## Testing

Two test scripts have been created:
- `test-api.js`: Verifies all API endpoints work correctly
- `test-persistence.js`: Tests data persistence functionality

The implementation maintains backward compatibility while adding robust data persistence and the new functionality specified in the OpenAPI document.