# Data Persistence Implementation

## Overview

The API now includes a robust data persistence system that automatically saves and loads scenario data to/from the file system. This ensures that all created, updated, and duplicated scenarios persist across server restarts.

## Architecture

### DataService (Singleton Pattern)
- **Location**: `src/services/dataService.ts`
- **Purpose**: Centralized data management with automatic persistence
- **Pattern**: Singleton to ensure single source of truth

### Key Features

1. **Automatic File-Based Storage**
   - Data stored in `data/scenarios.json`
   - Automatic directory creation
   - JSON format for easy inspection and debugging

2. **Default Data Initialization**
   - Ships with 7 pre-configured scenarios
   - Automatically creates initial data file if none exists
   - Graceful fallback to defaults on file corruption

3. **Real-time Persistence**
   - All CRUD operations immediately persist to disk
   - No manual save operations required
   - Atomic write operations

## API Operations with Persistence

### Create Scenario
```javascript
POST /api/scenarios
// Automatically persists new scenario to data/scenarios.json
```

### Update Scenario Name
```javascript
PUT /api/scenarios/{id}
// Updates scenario in memory and persists changes
```

### Duplicate Scenario
```javascript
POST /api/scenarios/{id}/duplicate
// Creates copy with "(Copy)" suffix and persists
```

### Cancel Simulation
```javascript
POST /api/scenarios/{id}/cancel
// Updates scenario status and persists changes
```

## File Structure

```
project/
├── data/                    # Auto-created data directory
│   └── scenarios.json      # Persisted scenario data
├── src/
│   ├── services/
│   │   └── dataService.ts  # Persistence service
│   └── controllers/
│       ├── scenariosController.ts    # Updated to use DataService
│       └── simulationController.ts   # Updated to use DataService
└── .gitignore              # Excludes data/ directory
```

## Data Format

The `data/scenarios.json` file stores an array of scenario objects:

```json
[
  {
    "id": "scenario_1704067200000",
    "name": "My Scenario",
    "creationDate": "2025-01-01",
    "statusId": "draft",
    "planning": {
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    }
  }
]
```

## Error Handling

- **File Read Errors**: Falls back to default scenarios
- **File Write Errors**: Logs error but continues operation
- **JSON Parse Errors**: Reinitializes with default data
- **Directory Creation**: Automatically creates missing directories

## Development Workflow

### First Run
1. Server starts
2. Checks for `data/scenarios.json`
3. If not found, creates directory and initializes with defaults
4. Logs initialization status

### Subsequent Runs
1. Server starts
2. Loads existing scenarios from `data/scenarios.json`
3. Logs number of scenarios loaded
4. Ready to serve requests

### Data Inspection
You can directly inspect the persisted data:
```bash
cat data/scenarios.json | jq .
```

## Testing Persistence

Use the provided test script:
```bash
node test-persistence.js
```

This script:
1. Gets initial scenario count
2. Creates a new scenario
3. Verifies persistence
4. Updates scenario name
5. Duplicates scenario
6. Confirms all operations persisted

## Benefits

1. **Data Durability**: Scenarios survive server restarts
2. **Development Friendly**: Easy to inspect and modify data
3. **No Database Required**: Simple file-based storage
4. **Automatic Backups**: JSON format allows easy version control
5. **Performance**: In-memory operations with async persistence

## Migration Path

If you need to migrate to a database later:
1. The DataService interface remains the same
2. Simply implement database operations in place of file operations
3. Controllers require no changes
4. Existing data can be imported from JSON

## Configuration

The persistence system uses these defaults:
- **Data Directory**: `data/`
- **Scenarios File**: `data/scenarios.json`
- **Encoding**: UTF-8
- **Format**: Pretty-printed JSON (2-space indentation)

These can be easily modified in `src/services/dataService.ts` if needed.