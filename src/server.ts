import { handleStatusesRoute } from './routes/statusesRoutes';
import { handleScenariosRoute } from './routes/scenariosRoutes';
import { createErrorResponse, handlePreflight } from './utils/responseUtils';

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  fetch(req) {
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
console.log(`   GET /api/scenarios/statuses - Get all statuses`);
console.log(`   GET /api/scenarios - Get all scenarios`);
