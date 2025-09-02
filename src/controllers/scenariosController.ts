import { scenariosData } from '../data/scenarios';
import type { Scenario, CreateScenarioRequest, ScenarioGeneralInfo, IdResponse, ScenarioStatusEnum } from '../types';

export const getScenarios = (status?: ScenarioStatusEnum, creationDate?: string): Scenario[] => {
  let filteredScenarios = [...scenariosData];

  // Filter by status
  if (status) {
    filteredScenarios = filteredScenarios.filter(
      scenario => scenario.statusId === status
    );
  }

  // Filter by creation date (YYYY-MM-DD format)
  if (creationDate) {
    filteredScenarios = filteredScenarios.filter(
      scenario => scenario.creationDate.startsWith(creationDate)
    );
  }

  return filteredScenarios;
};

export const createScenario = (request: CreateScenarioRequest): IdResponse => {
  const newId = `scenario_${Date.now()}`;
  const now = new Date().toISOString().split('T')[0]!; // YYYY-MM-DD format

  const newScenario: Scenario = {
    id: newId,
    name: request.name,
    creationDate: now,
    statusId: "draft",
    planning: {
      startDate: request.periods[0]?.startDate ?? now,
      endDate: request.periods[0]?.endDate ?? now
    }
  };

  // In a real app, this would be saved to a database
  scenariosData.push(newScenario);

  return { id: newId };
};

export const getScenarioGeneralInfo = (scenarioId: string): ScenarioGeneralInfo | null => {
  const scenario = scenariosData.find(s => s.id === scenarioId);
  if (!scenario) return null;

  // Convert planning to periods format
  const periods = [{
    id: 1,
    startDate: scenario.planning.startDate.includes('T') ? scenario.planning.startDate.split('T')[0]! : scenario.planning.startDate,
    endDate: scenario.planning.endDate.includes('T') ? scenario.planning.endDate.split('T')[0]! : scenario.planning.endDate
  }];

  return {
    id: scenario.id,
    name: scenario.name,
    statusId: scenario.statusId,
    periods
  };
};
