import { Scenario } from '../types';

export const scenariosData: Scenario[] = [
  {
    id: "1",
    name: "Refinement raw materials",
    creationDate: "2025-08-04T10:38:43.204186",
    statusId: "done",
    planning: {
      startDate: "2025-09-01T00:00:00",
      endDate: "2025-11-01T00:00:00"
    }
  },
  {
    id: "2",
    name: "Importación de querocenos puros a gran escala (mayor a 20,000 toneladas) de Argelia, Marruecos y Tunes",
    creationDate: "2025-08-04T10:42:24.899728",
    statusId: "done",
    planning: {
      startDate: "2025-09-01T00:00:00",
      endDate: "2025-11-01T00:00:00"
    }
  },
  {
    id: "3",
    name: "Refined oils import",
    creationDate: "2025-08-04T10:53:12.364369",
    statusId: "running",
    planning: {
      startDate: "2025-09-01T00:00:00",
      endDate: "2025-11-01T00:00:00"
    }
  },
  {
    id: "4",
    name: "New project draft",
    creationDate: "2025-08-05T09:00:00.000000",
    statusId: "draft",
    planning: {
      startDate: "2025-10-01T00:00:00",
      endDate: "2025-12-01T00:00:00"
    }
  },
  {
    id: "5",
    name: "Failed operation",
    creationDate: "2025-08-06T14:30:00.000000",
    statusId: "error",
    planning: {
      startDate: "2025-09-15T00:00:00",
      endDate: "2025-10-15T00:00:00"
    }
  },
  {
    id: "6",
    name: "Canceled project",
    creationDate: "2025-08-07T11:20:00.000000",
    statusId: "canceled",
    planning: {
      startDate: "2025-09-20T00:00:00",
      endDate: "2025-11-20T00:00:00"
    }
  },
  {
    id: "7",
    name: "Invalid configuration",
    creationDate: "2025-08-08T16:45:00.000000",
    statusId: "invalid",
    planning: {
      startDate: "2025-10-10T00:00:00",
      endDate: "2025-12-10T00:00:00"
    }
  }
];
