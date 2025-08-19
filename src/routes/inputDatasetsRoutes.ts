import { 
  getInputDataset, 
  replaceInputDataset, 
  uploadCsvDataset, 
  syncFromDatalake, 
  generateDownloadLink 
} from '../controllers/inputDatasetsController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';

export const handleInputDatasetRoute = (req: Request, scenarioId: string, tableId: string) => {
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
    console.log(`Replacing dataset for scenario: ${scenarioId}, table: ${tableId}`);
    
    return req.json().then((body: any) => {
      try {
        const result = replaceInputDataset(scenarioId, tableId, body);
        return createResponse(result);
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
  if (req.method === 'POST') {
    console.log(`Syncing from datalake for scenario: ${scenarioId}, table: ${tableId}`);
    
    const result = syncFromDatalake(scenarioId, tableId);
    return createResponse(result);
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleDownloadCsvRoute = (req: Request, scenarioId: string, tableId: string) => {
  if (req.method === 'POST') {
    console.log(`Generating download link for scenario: ${scenarioId}, table: ${tableId}`);
    
    const downloadLink = generateDownloadLink(scenarioId, tableId);
    return createResponse(downloadLink);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
