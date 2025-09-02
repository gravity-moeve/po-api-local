import { getTableDefinitions } from '../controllers/tableDefinitionsController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';

export const handleTableDefinitionsRoute = (req: Request) => {
  if (req.method === 'GET') {
    console.log("Getting table definitions");
    
    const definitions = getTableDefinitions();
    return createResponse(definitions);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
