import {
  getInputDataset,
  saveInputDataset,
  replaceInputDataset,
  uploadCsvDataset,
  syncFromDatalake,
  generateDownloadLink
} from '../controllers/inputDatasetsController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';
import { isValidTableId } from '../utils/inputDatasetValidation';
import type { TableId } from '../types';

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
      // This only happens if scenario doesn't exist
      return createErrorResponse("Scenario not found", 404);
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

  if (req.method === 'PUT') {
    console.log(`Uploading CSV for scenario: ${scenarioId}, table: ${tableId}`);

    // Handle both JSON with csvData field and direct text/csv content
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // JSON payload with csvData field
      return req.json().then((body: any) => {
        try {
          const csvData = body.csvData || '';
          if (!csvData) {
            return createErrorResponse("Missing csvData field in request body", 400);
          }
          const result = uploadCsvDataset(scenarioId, tableId, csvData);
          return createResponse(result);
        } catch (error) {
          return createErrorResponse("Invalid CSV data", 400);
        }
      }).catch(() => {
        return createErrorResponse("Invalid JSON body", 400);
      });
    } else if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
      // Direct CSV content
      return req.text().then((csvData: string) => {
        try {
          if (!csvData.trim()) {
            return createErrorResponse("Empty CSV data", 400);
          }
          const result = uploadCsvDataset(scenarioId, tableId, csvData);
          return createResponse(result);
        } catch (error) {
          return createErrorResponse("Invalid CSV data", 400);
        }
      }).catch(() => {
        return createErrorResponse("Failed to read CSV data", 400);
      });
    } else {
      return createErrorResponse("Content-Type must be application/json (with csvData field) or text/csv", 400);
    }
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
