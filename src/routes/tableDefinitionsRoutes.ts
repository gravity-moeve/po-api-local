import { getTableDefinitions } from '../controllers/tableDefinitionsController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';

export const handleTableDefinitionsRoute = (req: Request, scenarioId: string) => {
  if (req.method === 'GET') {
    console.log(`Getting table definitions for scenario: ${scenarioId}`);
    
    const definitions = getTableDefinitions(scenarioId);
    return createResponse(definitions);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
