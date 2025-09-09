import { getScenarios, createScenario, getScenarioGeneralInfo, updateScenarioName, duplicateScenario } from '../controllers/scenariosController';
import { DataService } from '../services/dataService';
import { createResponse, createErrorResponse } from '../utils/responseUtils';
import type { CreateScenarioRequest, ScenarioStatusEnum } from '../types';

const dataService = DataService.getInstance();

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
        
        const result = createScenario(body as CreateScenarioRequest);
        if (!result.success) {
          return createErrorResponse(result.error, result.code);
        }
        
        // Add 2 second delay before responding
        return new Promise<Response>((resolve) => {
          setTimeout(() => {
            resolve(createResponse(result.data, 201));
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
  
  if (req.method === 'PUT') {
    console.log(`Updating scenario name for: ${scenarioId}`);
    return req.json().then((body: any) => {
      try {
        if (!body.name) {
          return createErrorResponse("Missing required field: name", 400);
        }
        
        if (body.name.length > 95) {
          return createErrorResponse("Name must be 95 characters or less", 400);
        }
        
        const result = updateScenarioName(scenarioId, body.name);
        if (!result.success) {
          return createErrorResponse(result.error, result.code);
        }
        
        return createResponse(result.data);
      } catch (error) {
        return createErrorResponse("Invalid request data", 400);
      }
    }).catch(() => {
      return createErrorResponse("Invalid JSON body", 400);
    });
  }
  
  return createErrorResponse("Method not allowed", 405);
};

export const handleScenarioDuplicateRoute = (req: Request, scenarioId: string) => {
  if (req.method === 'POST') {
    console.log(`Duplicating scenario: ${scenarioId}`);
    
    const result = duplicateScenario(scenarioId);
    if (!result.success) {
      return createErrorResponse(result.error, result.code);
    }
    
    return createResponse(result.data);
  }
  
  return createErrorResponse("Method not allowed", 405);
};
