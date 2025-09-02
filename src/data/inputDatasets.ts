import type { InputDatasetByTable } from '../types';

export const inputDatasetsData: Record<string, InputDatasetByTable> = {
  "domesticDemandForecast": {
    tableId: "domesticDemandForecast",
    title: "Domestic demand forecast",
    rows: [
      {
        period: 1,
        location: "Madrid",
        product: "Diesel",
        volume: 1200,
        price: 205,
        minVolume: 400
      },
      {
        period: 2,
        location: "Sevilla",
        product: "Gasoline",
        volume: 900,
        price: 198,
        minVolume: 300
      }
    ]
  },
  "importOpportunities": {
    tableId: "importOpportunities",
    title: "Import opportunities",
    rows: [
      {
        period: 1,
        product: "Diesel",
        volume: 800,
        incoterm: "CIF",
        cifDestinationOrFobOrigin: "Valencia",
        price: 190,
        opportunity: "Spot"
      },
      {
        period: 2,
        product: "Gasoline",
        volume: 600,
        incoterm: "FOB",
        cifDestinationOrFobOrigin: "Houston",
        price: 175,
        opportunity: "Contract"
      }
    ]
  },
  "internationalDemandForecast": {
    tableId: "internationalDemandForecast",
    title: "International demand forecast",
    rows: [
      {
        period: 1,
        product: "Diesel",
        volume: 1500,
        incoterm: "CIF",
        cifDestinationOrFobOrigin: "Rotterdam",
        price: 210,
        opportunity: "Export"
      },
      {
        period: 2,
        product: "Jet",
        volume: 700,
        incoterm: "FOB",
        cifDestinationOrFobOrigin: "Algeciras",
        price: 230,
        opportunity: "Export"
      }
    ]
  },
  "productionPlan": {
    tableId: "productionPlan",
    title: "Production plan",
    rows: [
      {
        period: 1,
        location: "Refinery-A",
        product: "Diesel",
        flow: 3200
      },
      {
        period: 1,
        location: "Refinery-A",
        product: "Gasoline",
        flow: 2800
      }
    ]
  },
  "stockCapacities": {
    tableId: "stockCapacities",
    title: "Stock capacities (usable)",
    rows: [
      {
        period: 1,
        location: "Storage-North",
        product: "Diesel",
        minVolume: 300,
        capacity: 5000
      },
      {
        period: 1,
        location: "Storage-South",
        product: "Gasoline",
        minVolume: 200,
        capacity: 3500
      }
    ]
  },
  "initialStock": {
    tableId: "initialStock",
    title: "Initial stock (usable)",
    rows: [
      {
        location: "Storage-North",
        product: "Diesel",
        minVolume: 450
      },
      {
        location: "Storage-South",
        product: "Gasoline",
        minVolume: 250
      }
    ]
  },
  "logisticsCosts": {
    tableId: "logisticsCosts",
    title: "Logistics costs",
    rows: [
      {
        vessel: "Vessel-A",
        startDate: "2025-03-01",
        dailyCost: 1500,
        dailyFixedCosts: 500
      },
      {
        vessel: "Vessel-B",
        startDate: "2025-03-10",
        dailyCost: 1800,
        dailyFixedCosts: 600
      }
    ]
  }
};
