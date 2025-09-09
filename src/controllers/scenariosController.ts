import { DataService } from '../services/dataService';
import type { Scenario, CreateScenarioRequest, ScenarioGeneralInfo, IdResponse, ScenarioStatusEnum } from '../types';

const dataService = DataService.getInstance();

export const getScenarios = (status?: ScenarioStatusEnum, creationDate?: string): Scenario[] => {
  let filteredScenarios = dataService.getAllScenarios();

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

export const createScenario = (request: CreateScenarioRequest): { success: true; data: IdResponse } | { success: false; error: string; code: number } => {
  // Check for duplicate name
  if (dataService.scenarioNameExists(request.name)) {
    return { success: false, error: "Validation error occurred while creating scenario: name already exists", code: 422 };
  }

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

  dataService.createScenario(newScenario);
  return { success: true, data: { id: newId } };
};

export const getScenarioGeneralInfo = (scenarioId: string): ScenarioGeneralInfo | null => {
  const scenario = dataService.getScenarioById(scenarioId);
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

export const updateScenarioName = (scenarioId: string, newName: string): { success: true; data: IdResponse } | { success: false; error: string; code: number } => {
  // Check if scenario exists
  if (!dataService.scenarioExists(scenarioId)) {
    return { success: false, error: "Scenario not found", code: 404 };
  }

  // Check for duplicate name (excluding current scenario)
  if (dataService.scenarioNameExists(newName, scenarioId)) {
    return { success: false, error: "Validation error occurred while creating scenario: name already exists", code: 422 };
  }

  // Update the scenario
  const updatedScenario = dataService.updateScenario(scenarioId, { name: newName });
  if (!updatedScenario) {
    return { success: false, error: "Failed to update scenario", code: 500 };
  }

  return { success: true, data: { id: scenarioId } };
};

export const duplicateScenario = (scenarioId: string): { success: true; data: IdResponse } | { success: false; error: string; code: number } => {
  const scenario = dataService.getScenarioById(scenarioId);
  if (!scenario) {
    return { success: false, error: "Scenario not found", code: 404 };
  }

  const newId = `scenario_${Date.now()}`;
  const now = new Date().toISOString().split('T')[0]!; // YYYY-MM-DD format

  const duplicatedScenario: Scenario = {
    ...scenario,
    id: newId,
    name: `${scenario.name} (Copy)`,
    creationDate: now,
    statusId: "draft"
  };

  dataService.createScenario(duplicatedScenario);
  return { success: true, data: { id: newId } };
};
