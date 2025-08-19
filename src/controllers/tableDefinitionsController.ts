import { tableDefinitionsData } from '../data/tableDefinitions';
import type { TableDefinition } from '../types';

export const getTableDefinitions = (scenarioId: string): TableDefinition[] => {
  // In a real app, this would filter by scenarioId
  // For now, return all table definitions
  return tableDefinitionsData;
};
