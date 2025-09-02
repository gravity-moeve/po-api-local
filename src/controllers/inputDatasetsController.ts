import { inputDatasetsData } from '../data/inputDatasets';
import type { InputDataset, DatasetReplaceResult, UploadResult, SyncResult, DownloadLink, InputDatasetByTable, TableId } from '../types';

export const getInputDataset = (scenarioId: string, tableId: TableId, page: number = 1, pageSize: number = 100): InputDatasetByTable | null => {
  const dataset = inputDatasetsData[tableId];
  if (!dataset) return null;

  // Simple pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    ...dataset,
    rows: dataset.rows.slice(startIndex, endIndex)
  } as InputDatasetByTable;
};

export const replaceInputDataset = (scenarioId: string, tableId: TableId, newDataset: InputDataset): DatasetReplaceResult => {
  const oldRowCount = inputDatasetsData[tableId]?.rows.length || 0;
  
  // Replace the dataset (cast to match the expected type)
  inputDatasetsData[tableId] = newDataset as InputDatasetByTable;
  
  return {
    tableId,
    replaced: oldRowCount,
    rows: newDataset.rows,
    warnings: []
  };
};

export const uploadCsvDataset = (scenarioId: string, tableId: TableId, csvData: string): UploadResult => {
  // Mock CSV processing - in reality this would parse based on table schema
  const lines = csvData.split('\n').filter(line => line.trim());
  const rows = lines.slice(1).map(line => { // Skip header
    const values = line.split(',');
    // This is a simplified mock - real implementation would map to proper schema
    const row: Record<string, any> = {};
    values.forEach((value, index) => {
      row[`field_${index}`] = isNaN(Number(value)) ? value : Number(value);
    });
    return row;
  });

  const newDataset: InputDataset = {
    tableId,
    title: `${tableId} Dataset`,
    rows
  };

  replaceInputDataset(scenarioId, tableId, newDataset);

  return {
    tableId,
    processed: rows.length,
    replaced: rows.length,
    errors: [],
    warnings: []
  };
};

export const syncFromDatalake = (scenarioId: string, tableId: TableId): SyncResult => {
  // Mock sync operation - would fetch from actual datalake
  const existingDataset = inputDatasetsData[tableId];
  const mockRows = existingDataset ? existingDataset.rows.slice(0, 2) : []; // Take first 2 rows as mock

  const newDataset: InputDataset = {
    tableId,
    title: `${tableId} Dataset (Synced)`,
    rows: mockRows
  };

  replaceInputDataset(scenarioId, tableId, newDataset);

  return {
    tableId,
    source: "datalake",
    replaced: mockRows.length,
    warnings: []
  };
};

export const generateDownloadLink = (scenarioId: string, tableId: TableId): DownloadLink => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]!; // YYYY-MM-DD format
  
  return {
    url: `http://localhost:3003/api/scenarios/${scenarioId}/inputs/${tableId}/dataset/download-csv?token=mock-token`,
    format: "csv",
    expiresAt
  };
};
