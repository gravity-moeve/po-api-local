import type { InputDataset, TableId } from '../types';

// Valid TableId enum values
const VALID_TABLE_IDS: TableId[] = [
  "domesticDemandForecast",
  "importOpportunities", 
  "internationalDemandForecast",
  "productionPlan",
  "stockCapacities",
  "initialStock",
  "logisticsCosts"
];

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export function validateInputDataset(payload: any): ValidationResult {
  const errors: string[] = [];

  // Check if payload exists
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, errors: ['Invalid payload: must be an object'] };
  }

  // Validate required fields
  if (!payload.tableId || typeof payload.tableId !== 'string') {
    errors.push('Missing or invalid required field: tableId');
  }

  if (!payload.title || typeof payload.title !== 'string') {
    errors.push('Missing or invalid required field: title');
  }

  if (!Array.isArray(payload.rows)) {
    errors.push('Missing or invalid required field: rows (must be an array)');
  }

  // Validate tableId is a valid enum value
  if (payload.tableId && !isValidTableId(payload.tableId)) {
    errors.push(`Invalid tableId: ${payload.tableId}. Must be one of: ${VALID_TABLE_IDS.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTableIdMatch(urlTableId: string, payloadTableId: string): ValidationResult {
  if (urlTableId !== payloadTableId) {
    return {
      isValid: false,
      errors: [`TableId mismatch: URL contains '${urlTableId}' but payload contains '${payloadTableId}'`]
    };
  }

  return { isValid: true, errors: [] };
}

export function isValidTableId(tableId: string): tableId is TableId {
  return VALID_TABLE_IDS.includes(tableId as TableId);
}

export function validateRequiredFields(payload: any, requiredFields: string[]): ValidationResult {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!(field in payload) || payload[field] === null || payload[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}