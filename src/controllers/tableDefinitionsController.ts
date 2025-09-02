import { tableDefinitionsData } from '../data/tableDefinitions';
import type { TableDefinition } from '../types';

export const getTableDefinitions = (): TableDefinition[] => {
  return tableDefinitionsData;
};
