import type { Scenario } from '../types';

export const scenariosData: Scenario[] = [
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
