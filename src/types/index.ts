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

export type SelectorItem = {
  dependencies: string[];
  items: string[];
};

export type Selectors = {
  [key: string]: SelectorItem;
};

export type InputDataset = {
  tableId: string;
  title: string;
  rows: Record<string, any>[];
  selectors: Selectors;
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
  | "internationalDemandForecast"
  | "initialStock"
  | "stockCapacities"
  | "marginalProductionCosts"
  | "productionLimits"
  | "importOpportunities"
  | "vesselTransportCosts"
  | "charterCosts"
  | "landTransportCosts"
  | "logisticsCosts"
  | "initialVesselLocation"
  | "vesselAvailability"
  | "forcedVoyages"
  | "portInefficiencies";

export type DomesticDemandForecastRow = {
  periodId: number;
  location: string;
  product: string;
  volume: number;
  price: number;
  minVolume: number;
};

export type InternationalDemandForecastRow = {
  periodId: number;
  product: string;
  volume: number;
  incoterm: string;
  cifDestinationOrFobOrigin: string;
  price: number;
  isOpportunity: boolean;
};

export type InitialStockRow = {
  location: string;
  product: string;
  minVolume: number;
};

export type StockCapacitiesRow = {
  periodId: number;
  location: string;
  product: string;
  minVolume: number;
  capacity: number;
};

export type MarginalProductionCostsRow = {
  periodId: number;
  location: string;
  product: string;
  productionLevel: string;
  marginalCost: number;
};

export type ProductionLimitsRow = {
  periodId: number;
  location: string;
  productCategory: string;
  cumulativeProductionLimit: number;
};

export type ImportOpportunitiesRow = {
  periodId: number;
  product: string;
  volume: number;
  incoterm: string;
  cifDestinationOrFobOrigin: string;
  price: number;
  isOpportunity: boolean;
};

export type VesselTransportCostsRow = {
  vessel: string;
  startDate: string;
  dailyCost: number;
  dailyFixedCosts: number;
};

export type CharterCostsRow = {
  periodId: number;
  category: string;
  origin: string;
  destination: string;
  charterCost: number;
};

export type LandTransportCostsRow = {
  periodId: number;
  category: string;
  origin: string;
  destination: string;
  transportCost: number;
};

export type LogisticsCostsRow = {
  periodId: number;
  location: string;
  category: string;
  variableCost: number;
};

export type InitialVesselLocationRow = {
  vessel: string;
  location: string;
};

export type VesselAvailabilityRow = {
  periodId: number;
  vessel: string;
  availability: number;
};

export type ForcedVoyagesRow = {
  periodId: number;
  origin: string;
  destination: string;
  forceEmpty: boolean;
  minVoyages: number;
  maxVoyages: number;
};

export type PortInefficienciesRow = {
  port: string;
  loadingInefficiency: number;
  unloadingInefficiency: number;
};

export type InputDatasetByTable =
  | { tableId: "domesticDemandForecast"; title: string; rows: DomesticDemandForecastRow[]; selectors: Selectors }
  | { tableId: "internationalDemandForecast"; title: string; rows: InternationalDemandForecastRow[]; selectors: Selectors }
  | { tableId: "initialStock"; title: string; rows: InitialStockRow[]; selectors: Selectors }
  | { tableId: "stockCapacities"; title: string; rows: StockCapacitiesRow[]; selectors: Selectors }
  | { tableId: "marginalProductionCosts"; title: string; rows: MarginalProductionCostsRow[]; selectors: Selectors }
  | { tableId: "productionLimits"; title: string; rows: ProductionLimitsRow[]; selectors: Selectors }
  | { tableId: "importOpportunities"; title: string; rows: ImportOpportunitiesRow[]; selectors: Selectors }
  | { tableId: "vesselTransportCosts"; title: string; rows: VesselTransportCostsRow[]; selectors: Selectors }
  | { tableId: "charterCosts"; title: string; rows: CharterCostsRow[]; selectors: Selectors }
  | { tableId: "landTransportCosts"; title: string; rows: LandTransportCostsRow[]; selectors: Selectors }
  | { tableId: "logisticsCosts"; title: string; rows: LogisticsCostsRow[]; selectors: Selectors }
  | { tableId: "initialVesselLocation"; title: string; rows: InitialVesselLocationRow[]; selectors: Selectors }
  | { tableId: "vesselAvailability"; title: string; rows: VesselAvailabilityRow[]; selectors: Selectors }
  | { tableId: "forcedVoyages"; title: string; rows: ForcedVoyagesRow[]; selectors: Selectors }
  | { tableId: "portInefficiencies"; title: string; rows: PortInefficienciesRow[]; selectors: Selectors };
