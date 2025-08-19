export type Statuses = "done" | "invalid" | "draft" | "running" | "error" | "canceled";

export type StatusInfo = {
  id: Statuses;
  name: string;
  isFinal: boolean;
  isRunnable: boolean;
  isCancelable: boolean;
  isDeletable: boolean;
  hasOutputs: boolean;
  isEditable: boolean;
};

export type Scenario = {
  id: string;
  name: string;
  creationDate: string;
  statusId: string;
  planning: {
    startDate: string;
    endDate: string;
  };
};

// New types from OpenAPI specification
export type CreateScenarioRequest = {
  name: string;
  periods: ScenarioPeriod[];
};

export type ScenarioPeriod = {
  startDate: string;
  endDate: string;
};

export type TableDefinition = {
  id: string;
  title: string;
  type: string;
  tableType: string;
  shortDescription: string;
  required: string[];
  properties: Record<string, DynamicFieldDefinition>;
};

export type ValidationRule = {
  type: string;
  message: string;
  params: Record<string, any>;
};

export type DynamicFieldDefinition = {
  type: string;
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  anyOf?: any[];
  nullable?: boolean;
  minimum?: number;
  maxLength?: number;
  decimalPlaces?: number;
  validations?: ValidationRule[];
  [key: string]: any;
};

export type InputDataset = {
  tableId: string;
  title: string;
  rows: Record<string, any>[];
};

export type DatasetReplaceResult = {
  tableId: string;
  replaced: number;
  rows: Record<string, any>[];
  warnings: string[];
};

export type UploadResult = {
  tableId: string;
  processed: number;
  replaced: number;
  errors: string[];
  warnings: string[];
};

export type SyncResult = {
  tableId: string;
  source: string;
  replaced: number;
  warnings: string[];
};

export type DownloadLink = {
  url: string;
  format: "csv";
  expiresAt: string;
};

export type RunSimulationResponse = {
  scenarioId: string;
  simulationId: string;
  status: "queued" | "running" | "done" | "error";
  queuedAt: string;
};

export type ErrorResponse = {
  code: number;
  message: string;
};
