import { DataService } from '../services/dataService';
import { validateInputDataset, validateTableIdMatch } from '../utils/inputDatasetValidation';
import { generateSelectorsForTable } from '../utils/selectorUtils';
import type { InputDataset, DatasetReplaceResult, UploadResult, SyncResult, DownloadLink, InputDatasetByTable, TableId } from '../types';

const dataService = DataService.getInstance();

export type DatasetSaveResponse = {
  scenarioId: string;
  tableId: string;
  rowCount: number;
  updatedAt: string;
};

export type SaveResult = {
  success: true;
  data: DatasetSaveResponse;
} | {
  success: false;
  error: string;
  code: number;
};

export const getInputDataset = (scenarioId: string, tableId: TableId, page: number = 1, pageSize: number = 100): InputDatasetByTable | null => {
  // Validate scenario exists
  if (!dataService.scenarioExists(scenarioId)) {
    return null;
  }

  // Get dataset from persistent storage
  const storedDataset = dataService.getInputDataset(scenarioId, tableId);
  if (!storedDataset) {
    return null;
  }

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Generate selectors for this table type
  const selectors = generateSelectorsForTable(tableId);
  
  return {
    tableId: storedDataset.tableId,
    title: storedDataset.title,
    rows: storedDataset.rows.slice(startIndex, endIndex),
    selectors
  } as InputDatasetByTable;
};

export const saveInputDataset = (scenarioId: string, tableId: TableId, dataset: any): SaveResult => {
  // Validate scenario exists
  if (!dataService.scenarioExists(scenarioId)) {
    return { success: false, error: "Scenario not found", code: 404 };
  }

  // Validate payload structure
  const payloadValidation = validateInputDataset(dataset);
  if (!payloadValidation.isValid) {
    return { 
      success: false, 
      error: `Validation error: ${payloadValidation.errors.join(', ')}`, 
      code: 422 
    };
  }

  // Validate tableId matches between URL and payload
  const tableIdValidation = validateTableIdMatch(tableId, dataset.tableId);
  if (!tableIdValidation.isValid) {
    return { 
      success: false, 
      error: tableIdValidation.errors[0]!, 
      code: 400 
    };
  }

  try {
    // Ensure selectors are included (generate if not provided)
    const datasetWithSelectors: InputDataset = {
      ...dataset,
      selectors: dataset.selectors || generateSelectorsForTable(tableId)
    };
    
    // Save the dataset
    const storedDataset = dataService.saveInputDataset(scenarioId, tableId, datasetWithSelectors);
    
    return {
      success: true,
      data: {
        scenarioId: storedDataset.scenarioId,
        tableId: storedDataset.tableId,
        rowCount: storedDataset.rows.length,
        updatedAt: storedDataset.updatedAt
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: "Failed to save dataset", 
      code: 500 
    };
  }
};

export const replaceInputDataset = (scenarioId: string, tableId: TableId, newDataset: InputDataset): DatasetReplaceResult => {
  // Get old row count from persistent storage
  const existingDataset = dataService.getInputDataset(scenarioId, tableId);
  const oldRowCount = existingDataset?.rows.length || 0;
  
  // Save the new dataset using persistent storage
  dataService.saveInputDataset(scenarioId, tableId, newDataset);
  
  return {
    tableId,
    replaced: oldRowCount,
    rows: newDataset.rows,
    warnings: []
  };
};

export const uploadCsvDataset = (scenarioId: string, tableId: TableId, csvData: string): UploadResult => {
  // Validate scenario exists
  if (!dataService.scenarioExists(scenarioId)) {
    return {
      tableId,
      processed: 0,
      replaced: 0,
      errors: ['Scenario not found'],
      warnings: []
    };
  }

  try {
    // Get current row count before replacement
    const existingDataset = dataService.getInputDataset(scenarioId, tableId);
    const oldRowCount = existingDataset?.rows.length || 0;

    // Parse CSV data
    const lines = csvData.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {
        tableId,
        processed: 0,
        replaced: 0,
        errors: ['CSV file is empty'],
        warnings: []
      };
    }

    // Extract header and data rows
    const headerLine = lines[0];
    const dataLines = lines.slice(1);
    
    if (!headerLine) {
      return {
        tableId,
        processed: 0,
        replaced: 0,
        errors: ['CSV file has no header'],
        warnings: []
      };
    }

    // Parse header to get column names
    const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse data rows
    const rows: Record<string, any>[] = [];
    const errors: string[] = [];
    
    dataLines.forEach((line, index) => {
      if (!line.trim()) return; // Skip empty lines
      
      try {
        const values = parseCsvLine(line);
        
        if (values.length !== headers.length) {
          errors.push(`Row ${index + 2}: Expected ${headers.length} columns, got ${values.length}`);
          return;
        }

        const row: Record<string, any> = {};
        headers.forEach((header, colIndex) => {
          const value = values[colIndex]?.trim() || '';
          // Try to convert to appropriate type
          row[header] = convertCsvValue(value);
        });
        
        rows.push(row);
      } catch (error) {
        errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    });

    // If there are too many errors, don't proceed
    if (errors.length > 0 && errors.length >= dataLines.length / 2) {
      return {
        tableId,
        processed: dataLines.length,
        replaced: 0,
        errors: ['Too many parsing errors', ...errors.slice(0, 5)],
        warnings: []
      };
    }

    // Create new dataset with selectors
    const newDataset: InputDataset = {
      tableId,
      title: `${tableId} Dataset (Uploaded from CSV)`,
      rows,
      selectors: generateSelectorsForTable(tableId)
    };

    // Replace the existing dataset
    dataService.saveInputDataset(scenarioId, tableId, newDataset);

    return {
      tableId,
      processed: dataLines.length,
      replaced: rows.length,
      errors,
      warnings: errors.length > 0 ? [`${errors.length} rows had parsing errors`] : []
    };

  } catch (error) {
    return {
      tableId,
      processed: 0,
      replaced: 0,
      errors: [`Failed to process CSV: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
};

// Helper function to parse a CSV line handling quoted values
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Helper function to convert CSV string values to appropriate types
function convertCsvValue(value: string): any {
  if (value === '' || value.toLowerCase() === 'null') {
    return null;
  }
  
  if (value.toLowerCase() === 'true') {
    return true;
  }
  
  if (value.toLowerCase() === 'false') {
    return false;
  }
  
  // Try to parse as number
  const numValue = Number(value);
  if (!isNaN(numValue) && value.trim() !== '') {
    return numValue;
  }
  
  // Return as string, removing quotes if present
  return value.replace(/^"(.*)"$/, '$1');
}

export const syncFromDatalake = (scenarioId: string, tableId: TableId): SyncResult => {
  // Get current row count before deletion
  const existingDataset = dataService.getInputDataset(scenarioId, tableId);
  const oldRowCount = existingDataset?.rows.length || 0;

  // Delete current data for this scenario-tableId combination
  dataService.deleteInputDataset(scenarioId, tableId);

  // Generate fresh mock data based on tableId
  const mockRows = generateMockDataForTable(tableId);

  const newDataset: InputDataset = {
    tableId,
    title: `${tableId} Dataset (Synced from Datalake)`,
    rows: mockRows,
    selectors: generateSelectorsForTable(tableId)
  };

  // Save the new mock dataset
  dataService.saveInputDataset(scenarioId, tableId, newDataset);

  return {
    tableId,
    source: "datalake",
    replaced: mockRows.length,
    warnings: []
  };
};

// Helper function to generate mock data based on table type
function generateMockDataForTable(tableId: TableId): Record<string, any>[] {
  switch (tableId) {
    case 'domesticDemandForecast':
      return [
        { periodId: 1, location: 'Madrid', product: 'Gasoline', volume: 1200, price: 1.45, minVolume: 600 },
        { periodId: 2, location: 'Barcelona', product: 'Diesel', volume: 1800, price: 1.32, minVolume: 750 }
      ];
    
    case 'internationalDemandForecast':
      return [
        { periodId: 1, product: 'Gasoline', volume: 2500, incoterm: 'CIF', cifDestinationOrFobOrigin: 'France', price: 1.55, opportunity: 'French Market' },
        { periodId: 2, product: 'Diesel', volume: 3200, incoterm: 'FOB', cifDestinationOrFobOrigin: 'Italy', price: 1.42, opportunity: 'Italian Distribution' }
      ];
    
    case 'initialStock':
      return [
        { location: 'Tank Farm 1', product: 'Gasoline', minVolume: 1000 },
        { location: 'Tank Farm 2', product: 'Diesel', minVolume: 1500 }
      ];
    
    case 'stockCapacities':
      return [
        { periodId: 1, location: 'Tank Farm 1', product: 'Gasoline', minVolume: 500, capacity: 5000 },
        { periodId: 2, location: 'Tank Farm 2', product: 'Diesel', minVolume: 800, capacity: 8000 }
      ];
    
    case 'marginalProductionCosts':
      return [
        { periodId: 1, location: 'Refinery A', product: 'Gasoline', productionLevel: 'Level 1', marginalCost: 45.50 },
        { periodId: 2, location: 'Refinery B', product: 'Diesel', productionLevel: 'Level 2', marginalCost: 52.30 }
      ];
    
    case 'productionLimits':
      return [
        { periodId: 1, location: 'Refinery A', productCategory: 'Raw Materials', cumulativeProductionLimit: 10000 },
        { periodId: 2, location: 'Refinery B', productCategory: 'Finished Goods', cumulativeProductionLimit: 8500 }
      ];
    
    case 'importOpportunities':
      return [
        { periodId: 1, product: 'Crude Oil', volume: 5000, incoterm: 'CIF', cifDestinationOrFobOrigin: 'Barcelona', price: 85.50, opportunity: 'Algeria Import' },
        { periodId: 2, product: 'Refined Oil', volume: 3000, incoterm: 'FOB', cifDestinationOrFobOrigin: 'Morocco', price: 92.30, opportunity: 'Morocco Refinery' }
      ];
    
    case 'vesselTransportCosts':
      return [
        { vessel: 'Tanker Alpha', startDate: '2025-01-15', dailyCost: 25000, dailyFixedCosts: 5000 },
        { vessel: 'Tanker Beta', startDate: '2025-02-01', dailyCost: 28000, dailyFixedCosts: 5500 }
      ];
    
    case 'charterCosts':
      return [
        { periodId: 1, category: 'Standard', origin: 'Port A', destination: 'Port B', charterCost: 15000 },
        { periodId: 2, category: 'Premium', origin: 'Port C', destination: 'Port D', charterCost: 18500 }
      ];
    
    case 'landTransportCosts':
      return [
        { periodId: 1, category: 'Standard', origin: 'Madrid', destination: 'Barcelona', transportCost: 2500 },
        { periodId: 2, category: 'Express', origin: 'Barcelona', destination: 'Valencia', transportCost: 3200 }
      ];
    
    case 'logisticsCosts':
      return [
        { periodId: 1, location: 'Madrid', category: 'Standard', variableCost: 12.50 },
        { periodId: 2, location: 'Barcelona', category: 'Premium', variableCost: 15.75 }
      ];
    
    case 'initialVesselLocation':
      return [
        { vessel: 'Tanker Alpha', location: 'Port A' },
        { vessel: 'Tanker Beta', location: 'Port B' }
      ];
    
    case 'vesselAvailability':
      return [
        { periodId: 1, vessel: 'Tanker Alpha', availability: 0.95 },
        { periodId: 2, vessel: 'Tanker Beta', availability: 0.88 }
      ];
    
    case 'forcedVoyages':
      return [
        { periodId: 1, origin: 'Port A', destination: 'Port B', forceEmpty: false, minVoyages: 2, maxVoyages: 5 },
        { periodId: 2, origin: 'Port C', destination: 'Port D', forceEmpty: true, minVoyages: 1, maxVoyages: 3 }
      ];
    
    case 'portInefficiencies':
      return [
        { port: 'Port A', loadingInefficiency: 2.5, unloadingInefficiency: 1.8 },
        { port: 'Port B', loadingInefficiency: 3.2, unloadingInefficiency: 2.1 }
      ];
    
    default:
      return [
        { id: 1, name: 'Mock Data 1', value: 100 },
        { id: 2, name: 'Mock Data 2', value: 200 }
      ];
  }
}

export const generateDownloadLink = (scenarioId: string, tableId: TableId): DownloadLink => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]!; // YYYY-MM-DD format
  
  return {
    url: `http://localhost:3003/api/scenarios/${scenarioId}/inputs/${tableId}/dataset/download-csv?token=mock-token`,
    format: "csv",
    expiresAt
  };
};
