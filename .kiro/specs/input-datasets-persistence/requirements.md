# Requirements Document

## Introduction

This feature enhances the input datasets functionality by replacing mock responses with persistent data storage. The system will store and retrieve actual dataset information for specific scenario and table combinations, allowing users to persist their input data and retrieve it later. When no data exists for a given scenario/table combination, the system will return empty results instead of mock data.

## Requirements

### Requirement 1

**User Story:** As a user, I want to store input dataset data for specific scenarios and tables, so that my data persists between sessions and API calls.

#### Acceptance Criteria

1. WHEN a PUT request is made to `/scenarios/{scenarioId}/inputs/{tableId}/dataset` with valid payload THEN the system SHALL persist the dataset data
2. WHEN the payload contains tableId, title, and rows fields THEN the system SHALL validate and store all provided data
3. WHEN the dataset is successfully stored THEN the system SHALL return a success response
4. IF the payload is missing required fields THEN the system SHALL return a 422 validation error
5. IF the scenarioId does not exist THEN the system SHALL return a 404 error

### Requirement 2

**User Story:** As a user, I want to retrieve previously stored input dataset data for specific scenarios and tables, so that I can access my persisted data.

#### Acceptance Criteria

1. WHEN a GET request is made to `/scenarios/{scenarioId}/inputs/{tableId}/dataset` THEN the system SHALL look up stored data for that scenario/table combination
2. IF data exists for the scenario/table combination THEN the system SHALL return the stored dataset
3. IF no data exists for the scenario/table combination THEN the system SHALL return an empty response or null
4. WHEN data is retrieved THEN the system SHALL return it in the same format as stored (tableId, title, rows)
5. IF the scenarioId does not exist THEN the system SHALL return a 404 error

### Requirement 3

**User Story:** As a developer, I want the dataset storage to follow the same persistence patterns as scenarios, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. WHEN implementing dataset persistence THEN the system SHALL use the same file-based storage approach as scenarios
2. WHEN storing datasets THEN the system SHALL create appropriate data files in the data directory
3. WHEN accessing datasets THEN the system SHALL use the same service layer patterns as existing functionality
4. WHEN validating requests THEN the system SHALL use consistent error handling and response formats

### Requirement 4

**User Story:** As a user, I want to update existing dataset data for a scenario/table combination, so that I can modify my input data as needed.

#### Acceptance Criteria

1. WHEN a PUT request is made for an existing scenario/table combination THEN the system SHALL overwrite the existing data
2. WHEN data is updated THEN the system SHALL maintain data integrity and consistency
3. WHEN an update occurs THEN the system SHALL return the same success response as initial creation