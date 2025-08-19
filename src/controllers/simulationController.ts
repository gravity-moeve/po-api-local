import type { RunSimulationResponse } from '../types';

export const runSimulation = (scenarioId: string): RunSimulationResponse => {
  const simulationId = `sim_${scenarioId}_${Date.now()}`;
  
  // In a real app, this would queue the simulation
  const response: RunSimulationResponse = {
    scenarioId,
    simulationId,
    status: "queued",
    queuedAt: new Date().toISOString()
  };

  return response;
};
