import type { TableDefinition } from '../types';

export const tableDefinitionsData: TableDefinition[] = [
  {
    id: "domesticDemandForecast",
    title: "Domestic Demand Forecast",
    type: "input",
    tableType: "grid",
    shortDescription: "Domestic demand forecast data",
    required: ["period", "location", "product", "volume", "price", "minVolume"],
    properties: {
      period: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      location: {
        type: "string",
        title: "Location",
        description: "Location name"
      },
      product: {
        type: "string",
        title: "Product",
        description: "Product name"
      },
      volume: {
        type: "number",
        title: "Volume",
        description: "Volume amount",
        minimum: 0
      },
      price: {
        type: "number",
        title: "Price",
        description: "Price per unit",
        minimum: 0
      },
      minVolume: {
        type: "number",
        title: "Min Volume",
        description: "Minimum volume",
        minimum: 0
      }
    }
  },
  {
    id: "importOpportunities",
    title: "Import Opportunities",
    type: "input",
    tableType: "grid",
    shortDescription: "Import opportunities data",
    required: ["period", "product", "volume", "incoterm", "cifDestinationOrFobOrigin", "price", "opportunity"],
    properties: {
      period: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      product: {
        type: "string",
        title: "Product",
        description: "Product name"
      },
      volume: {
        type: "number",
        title: "Volume",
        description: "Volume amount",
        minimum: 0
      },
      incoterm: {
        type: "string",
        title: "Incoterm",
        description: "International commercial term"
      },
      cifDestinationOrFobOrigin: {
        type: "string",
        title: "CIF Destination or FOB Origin",
        description: "Destination or origin location"
      },
      price: {
        type: "number",
        title: "Price",
        description: "Price per unit",
        minimum: 0
      },
      opportunity: {
        type: "string",
        title: "Opportunity",
        description: "Opportunity type"
      }
    }
  },
  {
    id: "internationalDemandForecast",
    title: "International Demand Forecast",
    type: "input",
    tableType: "grid",
    shortDescription: "International demand forecast data",
    required: ["period", "product", "volume", "incoterm", "cifDestinationOrFobOrigin", "price", "opportunity"],
    properties: {
      period: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      product: {
        type: "string",
        title: "Product",
        description: "Product name"
      },
      volume: {
        type: "number",
        title: "Volume",
        description: "Volume amount",
        minimum: 0
      },
      incoterm: {
        type: "string",
        title: "Incoterm",
        description: "International commercial term"
      },
      cifDestinationOrFobOrigin: {
        type: "string",
        title: "CIF Destination or FOB Origin",
        description: "Destination or origin location"
      },
      price: {
        type: "number",
        title: "Price",
        description: "Price per unit",
        minimum: 0
      },
      opportunity: {
        type: "string",
        title: "Opportunity",
        description: "Opportunity type"
      }
    }
  },
  {
    id: "productionPlan",
    title: "Production Plan",
    type: "input",
    tableType: "grid",
    shortDescription: "Production plan data",
    required: ["period", "location", "product", "flow"],
    properties: {
      period: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      location: {
        type: "string",
        title: "Location",
        description: "Location name"
      },
      product: {
        type: "string",
        title: "Product",
        description: "Product name"
      },
      flow: {
        type: "number",
        title: "Flow",
        description: "Flow amount",
        minimum: 0
      }
    }
  },
  {
    id: "stockCapacities",
    title: "Stock Capacities",
    type: "input",
    tableType: "grid",
    shortDescription: "Stock capacities (usable)",
    required: ["period", "location", "product", "minVolume", "capacity"],
    properties: {
      period: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      location: {
        type: "string",
        title: "Location",
        description: "Location name"
      },
      product: {
        type: "string",
        title: "Product",
        description: "Product name"
      },
      minVolume: {
        type: "number",
        title: "Min Volume",
        description: "Minimum volume",
        minimum: 0
      },
      capacity: {
        type: "number",
        title: "Capacity",
        description: "Maximum capacity",
        minimum: 0
      }
    }
  },
  {
    id: "initialStock",
    title: "Initial Stock",
    type: "input",
    tableType: "grid",
    shortDescription: "Initial stock (usable)",
    required: ["location", "product", "minVolume"],
    properties: {
      location: {
        type: "string",
        title: "Location",
        description: "Location name"
      },
      product: {
        type: "string",
        title: "Product",
        description: "Product name"
      },
      minVolume: {
        type: "number",
        title: "Min Volume",
        description: "Minimum volume",
        minimum: 0
      }
    }
  },
  {
    id: "logisticsCosts",
    title: "Logistics Costs",
    type: "input",
    tableType: "grid",
    shortDescription: "Logistics costs data",
    required: ["vessel", "startDate", "dailyCost", "dailyFixedCosts"],
    properties: {
      vessel: {
        type: "string",
        title: "Vessel",
        description: "Vessel name"
      },
      startDate: {
        type: "string",
        title: "Start Date",
        description: "Logistics cost start date (YYYY-MM-DD)"
      },
      dailyCost: {
        type: "number",
        title: "Daily Cost",
        description: "Daily cost amount",
        minimum: 0
      },
      dailyFixedCosts: {
        type: "number",
        title: "Daily Fixed Costs",
        description: "Daily fixed costs amount",
        minimum: 0
      }
    }
  }
];
