import { runSimulation, cancelSimulation } from '../controllers/simulationController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';

export const handleSimulationRoute = (req: Request, scenarioId: string) => {
  if (req.method === 'POST') {
    console.log(`Running simulation for scenario: ${scenarioId}`);
    
    const result = runSimulation(scenarioId);
    return createResponse(result, 202);
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleSimulationCancelRoute = (req: Request, scenarioId: string) => {
  if (req.method === 'POST') {
    console.log(`Canceling simulation for scenario: ${scenarioId}`);
    
    const result = cancelSimulation(scenarioId);
    if (!result) {
      return createErrorResponse("Scenario not found", 404);
    }
    
    return createResponse(result);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
