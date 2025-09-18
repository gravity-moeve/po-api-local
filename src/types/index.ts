export type ScenarioStatusEnum = "done" | "running" | "draft" | "canceled" | "error" | "invalid";

export type StatusInfo = {
  id: ScenarioStatusEnum;
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
  statusId: ScenarioStatusEnum;
  planning: {
    startDate: string;
    endDate: string;
  };
};

export type ScenarioPeriods = {
  scenarioId: string;
  scenarioName: string;
  periods: ScenarioPeriod[];
};

export type CreateScenarioRequest = {
  name: string;
  periods: ScenarioPeriod[];
};

export type ScenarioPeriod = {
  id: number;
  startDate: string;
  endDate: string;
};

export type ScenarioGeneralInfo = {
  id: string;
  name: string;
  statusId: ScenarioStatusEnum;
  periods: ScenarioPeriod[];
};

export type IdResponse = {
  id: string;
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

// Specific dataset types for each table
export type TableId = 
  | "domesticDemandForecast"
  | "importOpportunities" 
  | "internationalDemandForecast"
  | "productionPlan"
  | "stockCapacities"
  | "initialStock"
  | "logisticsCosts";

export type DomesticDemandForecastRow = {
  period: number;
  location: string;
  product: string;
  volume: number;
  price: number;
  minVolume: number;
};

export type ImportOpportunitiesRow = {
  period: number;
  product: string;
  volume: number;
  incoterm: string;
  cifDestinationOrFobOrigin: string;
  price: number;
  opportunity: string;
};

export type InternationalDemandForecastRow = {
  period: number;
  product: string;
  volume: number;
  incoterm: string;
  cifDestinationOrFobOrigin: string;
  price: number;
  opportunity: string;
};

export type ProductionPlanRow = {
  period: number;
  location: string;
  product: string;
  flow: number;
};

export type StockCapacitiesRow = {
  period: number;
  location: string;
  product: string;
  minVolume: number;
  capacity: number;
};

export type InitialStockRow = {
  location: string;
  product: string;
  minVolume: number;
};

export type LogisticsCostsRow = {
  vessel: string;
  startDate: string;
  dailyCost: number;
  dailyFixedCosts: number;
};

export type InputDatasetByTable = 
  | { tableId: "domesticDemandForecast"; title: string; rows: DomesticDemandForecastRow[] }
  | { tableId: "importOpportunities"; title: string; rows: ImportOpportunitiesRow[] }
  | { tableId: "internationalDemandForecast"; title: string; rows: InternationalDemandForecastRow[] }
  | { tableId: "productionPlan"; title: string; rows: ProductionPlanRow[] }
  | { tableId: "stockCapacities"; title: string; rows: StockCapacitiesRow[] }
  | { tableId: "initialStock"; title: string; rows: InitialStockRow[] }
  | { tableId: "logisticsCosts"; title: string; rows: LogisticsCostsRow[] };
