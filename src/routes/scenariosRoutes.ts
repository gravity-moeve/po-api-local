import { getScenarios, createScenario, getScenarioGeneralInfo } from '../controllers/scenariosController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';
import type { CreateScenarioRequest, ScenarioStatusEnum } from '../types';

export const handleScenariosRoute = (req: Request) => {
  if (req.method === 'GET') {
    console.log("Scenarios route");
    
    const url = new URL(req.url);
    const status = url.searchParams.get('status') as ScenarioStatusEnum | null;
    const creationDate = url.searchParams.get('creationDate');
    
    const scenarios = getScenarios(status || undefined, creationDate || undefined);
    return createResponse(scenarios);
  }
  
  if (req.method === 'POST') {
    console.log("Creating new scenario");
    
    return req.json().then((body: any) => {
      try {
        // Basic validation
        if (!body.name || !Array.isArray(body.periods)) {
          return createErrorResponse("Missing required fields: name and periods", 400);
        }
        
        const idResponse = createScenario(body as CreateScenarioRequest);
        
        // Add 2 second delay before responding
        return new Promise<Response>((resolve) => {
          setTimeout(() => {
            resolve(createResponse(idResponse, 201));
          }, 3000);
        });
      } catch (error) {
        return createErrorResponse("Invalid scenario data", 400);
      }
    }).catch(() => {
      return createErrorResponse("Invalid JSON body", 400);
    });
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleScenarioByIdRoute = (req: Request, scenarioId: string) => {
  if (req.method === 'GET') {
    console.log(`Getting scenario general info for: ${scenarioId}`);
    
    const scenarioInfo = getScenarioGeneralInfo(scenarioId);
    if (!scenarioInfo) {
      return createErrorResponse("Scenario not found", 404);
    }
    
    return createResponse(scenarioInfo);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
