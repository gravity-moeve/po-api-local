# Requirements Document

## Introduction

This feature enhances the input datasets functionality by replacing mock responses with persistent data storage and updating the table structure to match the new initialStepsConfiguration. The system will store and retrieve actual dataset information for specific scenario and table combinations, allowing users to persist their input data and retrieve it later. The feature includes updating table definitions to support the new comprehensive set of tables including demand forecasts, stocks, production, imports, logistics costs, and vessel management. When no data exists for a given scenario/table combination, the system will return empty results instead of mock data.

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

### Requirement 5

**User Story:** As a developer, I want the table definitions to match the new initialStepsConfiguration structure, so that the system supports all required input tables with correct column definitions.

#### Acceptance Criteria

1. WHEN table definitions are updated THEN the system SHALL support all 15 table types from the new configuration
2. WHEN column names are updated THEN the system SHALL use 'periodId' instead of 'period' for consistency
3. WHEN new tables are added THEN the system SHALL include proper validation and type definitions
4. WHEN existing tables are modified THEN the system SHALL maintain backward compatibility where possible
5. WHEN table definitions are accessed THEN the system SHALL return the correct column definitions for each table type

### Requirement 6

**User Story:** As a user, I want dataset responses to include selector information for dropdown/filter functionality, so that I can have dynamic filtering options based on the data structure.

#### Acceptance Criteria

1. WHEN dataset data is retrieved THEN the system SHALL include a selectors object with the response
2. WHEN selectors are generated THEN the system SHALL identify appropriate columns for selector functionality (location, product, category, vessel, etc.)
3. WHEN selectors are created THEN each selector SHALL include dependencies and items arrays
4. WHEN mock data is generated THEN the system SHALL provide realistic selector values for testing
5. WHEN selectors are returned THEN they SHALL match column names from the table definition
6. WHEN not all columns need selectors THEN the system SHALL only include relevant columns (excluding numeric values, dates, and calculated fields)