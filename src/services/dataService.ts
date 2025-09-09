import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Scenario } from '../types';

const DATA_DIR = 'data';
const SCENARIOS_FILE = join(DATA_DIR, 'scenarios.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Default scenarios data
const defaultScenarios: Scenario[] = [
  {
    id: "1",
    name: "Refinement raw materials",
    creationDate: "2025-08-04",
    statusId: "done",
    planning: {
      startDate: "2025-09-01",
      endDate: "2025-11-01"
    }
  },
  {
    id: "2",
    name: "Importación de querocenos puros a gran escala (mayor a 20,000 toneladas) de Argelia, Marruecos y Tunes",
    creationDate: "2025-08-04",
    statusId: "done",
    planning: {
      startDate: "2025-09-01",
      endDate: "2025-11-01"
    }
  },
  {
    id: "3",
    name: "Refined oils import",
    creationDate: "2025-08-04",
    statusId: "running",
    planning: {
      startDate: "2025-09-01",
      endDate: "2025-11-01"
    }
  },
  {
    id: "4",
    name: "New project draft",
    creationDate: "2025-08-05",
    statusId: "draft",
    planning: {
      startDate: "2025-10-01",
      endDate: "2025-12-01"
    }
  },
  {
    id: "5",
    name: "Failed operation",
    creationDate: "2025-08-06",
    statusId: "error",
    planning: {
      startDate: "2025-09-15",
      endDate: "2025-10-15"
    }
  },
  {
    id: "6",
    name: "Canceled project",
    creationDate: "2025-08-07",
    statusId: "canceled",
    planning: {
      startDate: "2025-09-20",
      endDate: "2025-11-20"
    }
  },
  {
    id: "7",
    name: "Invalid configuration",
    creationDate: "2025-08-08",
    statusId: "invalid",
    planning: {
      startDate: "2025-10-10",
      endDate: "2025-12-10"
    }
  }
];

export class DataService {
  private static instance: DataService;
  private scenarios: Scenario[] = [];

  private constructor() {
    this.loadScenarios();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private loadScenarios(): void {
    try {
      if (existsSync(SCENARIOS_FILE)) {
        const data = readFileSync(SCENARIOS_FILE, 'utf-8');
        this.scenarios = JSON.parse(data);
        console.log(`📁 Loaded ${this.scenarios.length} scenarios from file`);
      } else {
        // Initialize with default data
        this.scenarios = [...defaultScenarios];
        this.saveScenarios();
        console.log(`📁 Initialized with ${this.scenarios.length} default scenarios`);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      // Fallback to default data
      this.scenarios = [...defaultScenarios];
      this.saveScenarios();
    }
  }

  private saveScenarios(): void {
    try {
      const data = JSON.stringify(this.scenarios, null, 2);
      writeFileSync(SCENARIOS_FILE, data, 'utf-8');
      console.log(`💾 Saved ${this.scenarios.length} scenarios to file`);
    } catch (error) {
      console.error('Error saving scenarios:', error);
    }
  }

  public getAllScenarios(): Scenario[] {
    return [...this.scenarios];
  }

  public getScenarioById(id: string): Scenario | null {
    return this.scenarios.find(s => s.id === id) || null;
  }

  public createScenario(scenario: Scenario): Scenario {
    this.scenarios.push(scenario);
    this.saveScenarios();
    return scenario;
  }

  public updateScenario(id: string, updates: Partial<Scenario>): Scenario | null {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.scenarios[index] = { ...this.scenarios[index]!, ...updates };
    this.saveScenarios();
    return this.scenarios[index]!;
  }

  public deleteScenario(id: string): boolean {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.scenarios.splice(index, 1);
    this.saveScenarios();
    return true;
  }

  public scenarioExists(id: string): boolean {
    return this.scenarios.some(s => s.id === id);
  }

  public scenarioNameExists(name: string, excludeId?: string): boolean {
    return this.scenarios.some(s => s.name === name && s.id !== excludeId);
  }
}