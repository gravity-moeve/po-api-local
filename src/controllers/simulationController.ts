import { DataService } from '../services/dataService';
import type { RunSimulationResponse, IdResponse } from '../types';

const dataService = DataService.getInstance();

export const runSimulation = (scenarioId: string): RunSimulationResponse => {
  const simulationId = `sim_${scenarioId}_${Date.now()}`;
  
  // In a real app, this would queue the simulation
  const response: RunSimulationResponse = {
    scenarioId,
    simulationId,
    status: "queued",
    queuedAt: new Date().toISOString().split('T')[0]! // YYYY-MM-DD format
  };

  return response;
};

export const cancelSimulation = (scenarioId: string): IdResponse | null => {
  const scenario = dataService.getScenarioById(scenarioId);
  if (!scenario) return null;

  // In a real app, this would cancel the running simulation
  // For now, we'll just update the scenario status to canceled if it's running
  if (scenario.statusId === "running") {
    dataService.updateScenario(scenarioId, { statusId: "canceled" });
  }

  return { id: scenarioId };
};
