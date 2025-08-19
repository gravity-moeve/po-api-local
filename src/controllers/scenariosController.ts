import { scenariosData } from '../data/scenarios';
import type { Scenario, CreateScenarioRequest } from '../types';

export const getScenarios = (status?: string, creationDate?: string) => {
  let filteredScenarios = [...scenariosData];

  // Filter by status
  if (status) {
    filteredScenarios = filteredScenarios.filter(
      scenario => scenario.statusId.toLowerCase() === status.toLowerCase()
    );
  }

  // Filter by creation date
  if (creationDate) {
    filteredScenarios = filteredScenarios.filter(
      scenario => scenario.creationDate.startsWith(creationDate)
    );
  }

  return filteredScenarios;
};

export const createScenario = (request: CreateScenarioRequest): Scenario => {
  const newScenario: Scenario = {
    id: (scenariosData.length + 1).toString(),
    name: request.name,
    creationDate: new Date().toISOString(),
    statusId: "draft",
    planning: {
      startDate: request.periods[0]?.startDate || new Date().toISOString(),
      endDate: request.periods[0]?.endDate || new Date().toISOString()
    }
  };

  // In a real app, this would be saved to a database
  scenariosData.push(newScenario);
  
  return newScenario;
};
