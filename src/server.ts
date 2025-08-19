import { handleStatusesRoute } from './routes/statusesRoutes';
import { handleScenariosRoute } from './routes/scenariosRoutes';
import { createResponse, createErrorResponse, handlePreflight } from './utils/responseUtils';

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return handlePreflight();
    }

    try {
      // Route handling
      if (path === "/api/statuses") {
        return handleStatusesRoute(req);
      }

      if (path === "/api/scenarios") {
        return handleScenariosRoute(req);
      }

      // Default response for unknown routes
      return createErrorResponse("Not found", 404);

    } catch (error) {
      return createErrorResponse(
        error instanceof Error ? error.message : "Internal server error",
        500
      );
    }
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
console.log(`📊 Available endpoints:`);
console.log(`   GET /api/statuses - Get all statuses`);
console.log(`   GET /api/scenarios - Get all scenarios`);
