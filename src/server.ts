import { handleStatusesRoute } from './routes/statusesRoutes';
import { handleScenariosRoute, handleScenarioByIdRoute } from './routes/scenariosRoutes';
import { handleTableDefinitionsRoute } from './routes/tableDefinitionsRoutes';
import { 
  handleInputDatasetRoute, 
  handleCsvUploadRoute, 
  handleSyncFromDatalakeRoute, 
  handleDownloadCsvRoute 
} from './routes/inputDatasetsRoutes';
import { handleSimulationRoute } from './routes/simulationRoutes';
import { createErrorResponse, handlePreflight } from './utils/responseUtils';

const PORT = 3003;

const server = Bun.serve({
  port: PORT,
  fetch(req): Response | Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`${method} ${path} - Origin: ${req.headers.get('origin') || 'unknown'}`);

    // Handle preflight requests
    if (method === "OPTIONS") {
      console.log("Handling preflight request");
      return handlePreflight();
    }

    try {
      // Route handling
      if (path === "/api/scenarios/statuses") {
        console.log("Statuses route accessed");
        return handleStatusesRoute(req);
      }

      if (path === "/api/scenarios") {
        console.log("Scenarios route accessed");
        return handleScenariosRoute(req);
      }

      // Scenario by ID route
      const scenarioByIdMatch = path.match(/^\/api\/scenarios\/([^\/]+)$/);
      if (scenarioByIdMatch) {
        const scenarioId = scenarioByIdMatch[1];
        if (scenarioId && scenarioId !== "statuses") {
          return handleScenarioByIdRoute(req, scenarioId);
        }
      }

      // Table definitions route - corrected path
      const tableDefinitionsMatch = path.match(/^\/api\/scenarios\/inputs\/definitions$/);
      if (tableDefinitionsMatch) {
        return handleTableDefinitionsRoute(req);
      }

      // Input dataset routes
      const inputDatasetMatch = path.match(/^\/api\/scenarios\/([^\/]+)\/inputs\/([^\/]+)\/dataset$/);
      if (inputDatasetMatch) {
        const [, scenarioId, tableId] = inputDatasetMatch;
        if (scenarioId && tableId) {
          return handleInputDatasetRoute(req, scenarioId, tableId);
        }
      }

      // CSV upload route
      const csvUploadMatch = path.match(/^\/api\/scenarios\/([^\/]+)\/inputs\/([^\/]+)\/dataset\/upload-csv$/);
      if (csvUploadMatch) {
        const [, scenarioId, tableId] = csvUploadMatch;
        if (scenarioId && tableId) {
          return handleCsvUploadRoute(req, scenarioId, tableId);
        }
      }

      // Sync from datalake route
      const syncMatch = path.match(/^\/api\/scenarios\/([^\/]+)\/inputs\/([^\/]+)\/dataset\/sync-from-datalake$/);
      if (syncMatch) {
        const [, scenarioId, tableId] = syncMatch;
        if (scenarioId && tableId) {
          return handleSyncFromDatalakeRoute(req, scenarioId, tableId);
        }
      }

      // Download CSV route
      const downloadMatch = path.match(/^\/api\/scenarios\/([^\/]+)\/inputs\/([^\/]+)\/dataset\/download-csv$/);
      if (downloadMatch) {
        const [, scenarioId, tableId] = downloadMatch;
        if (scenarioId && tableId) {
          return handleDownloadCsvRoute(req, scenarioId, tableId);
        }
      }

      // Simulation route
      const simulationMatch = path.match(/^\/api\/scenarios\/([^\/]+)\/run$/);
      if (simulationMatch) {
        const scenarioId = simulationMatch[1];
        if (scenarioId) {
          return handleSimulationRoute(req, scenarioId);
        }
      }

      // Default response for unknown routes
      console.log(`Route not found: ${path}`);
      return createErrorResponse("Not found", 404);

    } catch (error) {
      console.error("Server error:", error);
      return createErrorResponse(
        error instanceof Error ? error.message : "Internal server error",
        500
      );
    }
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
console.log(`📊 Available endpoints:`);
console.log(`   GET  /api/scenarios/statuses - Get all statuses`);
console.log(`   GET  /api/scenarios - Get all scenarios (with filters)`);
console.log(`   POST /api/scenarios - Create new scenario`);
console.log(`   GET  /api/scenarios/{id} - Get scenario general info`);
console.log(`   GET  /api/scenarios/inputs/definitions - Get table definitions`);
console.log(`   GET  /api/scenarios/{id}/inputs/{tableId}/dataset - Get input dataset`);
console.log(`   PUT  /api/scenarios/{id}/inputs/{tableId}/dataset - Replace dataset`);
console.log(`   POST /api/scenarios/{id}/inputs/{tableId}/dataset/upload-csv - Upload CSV`);
console.log(`   POST /api/scenarios/{id}/inputs/{tableId}/dataset/sync-from-datalake - Sync from datalake`);
console.log(`   POST /api/scenarios/{id}/inputs/{tableId}/dataset/download-csv - Generate download link`);
console.log(`   POST /api/scenarios/{id}/run - Run simulation`);
