import { 
  getInputDataset, 
  saveInputDataset,
  replaceInputDataset, 
  uploadCsvDataset, 
  syncFromDatalake, 
  generateDownloadLink 
} from '../controllers/inputDatasetsController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';
import type { TableId } from '../types';

const validTableIds: TableId[] = [
  "domesticDemandForecast",
  "importOpportunities", 
  "internationalDemandForecast",
  "productionPlan",
  "stockCapacities",
  "initialStock",
  "logisticsCosts"
];

const isValidTableId = (tableId: string): tableId is TableId => {
  return validTableIds.includes(tableId as TableId);
};

export const handleInputDatasetRoute = (req: Request, scenarioId: string, tableId: string) => {
  if (!isValidTableId(tableId)) {
    return createErrorResponse("Invalid table ID", 400);
  }

  if (req.method === 'GET') {
    console.log(`Getting dataset for scenario: ${scenarioId}, table: ${tableId}`);
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '100');
    
    const dataset = getInputDataset(scenarioId, tableId, page, pageSize);
    if (!dataset) {
      return createErrorResponse("Dataset not found", 404);
    }
    
    return createResponse(dataset);
  }
  
  if (req.method === 'PUT') {
    console.log(`Saving dataset for scenario: ${scenarioId}, table: ${tableId}`);
    
    return req.json().then((body: any) => {
      try {
        const result = saveInputDataset(scenarioId, tableId, body);
        if (!result.success) {
          return createErrorResponse(result.error, result.code);
        }
        
        return createResponse(result.data, 201);
      } catch (error) {
        return createErrorResponse("Invalid dataset data", 400);
      }
    }).catch(() => {
      return createErrorResponse("Invalid JSON body", 400);
    });
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleCsvUploadRoute = (req: Request, scenarioId: string, tableId: string) => {
  if (!isValidTableId(tableId)) {
    return createErrorResponse("Invalid table ID", 400);
  }

  if (req.method === 'POST') {
    console.log(`Uploading CSV for scenario: ${scenarioId}, table: ${tableId}`);
    
    // For now, we'll expect JSON with CSV data
    // In a real app, this would handle multipart/form-data
    return req.json().then((body: any) => {
      try {
        const csvData = body.csvData || '';
        const result = uploadCsvDataset(scenarioId, tableId, csvData);
        return createResponse(result);
      } catch (error) {
        return createErrorResponse("Invalid CSV data", 400);
      }
    }).catch(() => {
      return createErrorResponse("Invalid request body", 400);
    });
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleSyncFromDatalakeRoute = (req: Request, scenarioId: string, tableId: string) => {
  if (!isValidTableId(tableId)) {
    return createErrorResponse("Invalid table ID", 400);
  }

  if (req.method === 'POST') {
    console.log(`Syncing from datalake for scenario: ${scenarioId}, table: ${tableId}`);
    
    const result = syncFromDatalake(scenarioId, tableId);
    return createResponse(result);
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleDownloadCsvRoute = (req: Request, scenarioId: string, tableId: string) => {
  if (!isValidTableId(tableId)) {
    return createErrorResponse("Invalid table ID", 400);
  }

  if (req.method === 'POST') {
    console.log(`Generating download link for scenario: ${scenarioId}, table: ${tableId}`);
    
    const downloadLink = generateDownloadLink(scenarioId, tableId);
    return createResponse(downloadLink);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
