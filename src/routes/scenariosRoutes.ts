import { getScenarios } from '../controllers/scenariosController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';

export const handleScenariosRoute = (req: Request) => {
  if (req.method === 'GET') {
    console.log("Scenarios route");
    return createResponse(getScenarios());
  }
  
  return createErrorResponse("Method not allowed", 405);
};
