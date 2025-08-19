import { inputDatasetsData } from '../data/inputDatasets';
import type { InputDataset, DatasetReplaceResult, UploadResult, SyncResult, DownloadLink } from '../types';

export const getInputDataset = (scenarioId: string, tableId: string, page: number = 1, pageSize: number = 100): InputDataset | null => {
  const dataset = inputDatasetsData[tableId];
  if (!dataset) return null;

  // Simple pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    ...dataset,
    rows: dataset.rows.slice(startIndex, endIndex)
  };
};

export const replaceInputDataset = (scenarioId: string, tableId: string, newDataset: InputDataset): DatasetReplaceResult => {
  const oldRowCount = inputDatasetsData[tableId]?.rows.length || 0;
  
  // Replace the dataset
  inputDatasetsData[tableId] = newDataset;
  
  return {
    tableId,
    replaced: oldRowCount,
    rows: newDataset.rows,
    warnings: []
  };
};

export const uploadCsvDataset = (scenarioId: string, tableId: string, csvData: string): UploadResult => {
  // Mock CSV processing
  const rows = csvData.split('\n').filter(line => line.trim()).map(line => {
    const [name, quantity, unit, cost] = line.split(',');
    return { name, quantity: parseFloat(quantity), unit, cost: parseFloat(cost) };
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
    replaced: inputDatasetsData[tableId]?.rows.length || 0,
    errors: [],
    warnings: []
  };
};

export const syncFromDatalake = (scenarioId: string, tableId: string): SyncResult => {
  // Mock sync operation
  const mockRows = [
    { name: "Synced Material 1", quantity: 100, unit: "kg", cost: 25.50 },
    { name: "Synced Material 2", quantity: 200, unit: "kg", cost: 30.75 }
  ];

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

export const generateDownloadLink = (scenarioId: string, tableId: string): DownloadLink => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
  
  return {
    url: `http://localhost:3001/api/scenarios/${scenarioId}/inputs/${tableId}/dataset/download-csv?token=mock-token`,
    format: "csv",
    expiresAt
  };
};
