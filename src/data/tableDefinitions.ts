import type { TableDefinition } from '../types';

export const tableDefinitionsData: TableDefinition[] = [
  {
    id: "domesticDemandForecast",
    title: "Domestic Demand Forecast",
    type: "input",
    tableType: "grid",
    shortDescription: "Domestic demand forecast data",
    required: ["periodId", "location", "product", "volume", "price", "minVolume"],
    properties: {
      periodId: {
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
        title: "Volume (T)",
        description: "Volume amount in tons",
        minimum: 0
      },
      price: {
        type: "number",
        title: "Price ($/T)",
        description: "Price per ton",
        minimum: 0
      },
      minVolume: {
        type: "number",
        title: "Min. volume (T)",
        description: "Minimum volume in tons",
        minimum: 0
      }
    }
  },
  {
    id: "internationalDemandForecast",
    title: "International Demand Forecast",
    type: "input",
    tableType: "grid",
    shortDescription: "International demand forecast data",
    required: ["periodId", "product", "volume", "incoterm", "cifDestinationOrFobOrigin", "price", "opportunity"],
    properties: {
      periodId: {
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
        title: "Volume (T)",
        description: "Volume amount in tons",
        minimum: 0
      },
      incoterm: {
        type: "string",
        title: "Incoterm",
        description: "International commercial term"
      },
      cifDestinationOrFobOrigin: {
        type: "string",
        title: "CIF destination or FOB origin",
        description: "Destination or origin location"
      },
      price: {
        type: "number",
        title: "Price ($/T)",
        description: "Price per ton",
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
        title: "Min. volume (T)",
        description: "Minimum volume in tons",
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
    required: ["periodId", "location", "product", "minVolume", "capacity"],
    properties: {
      periodId: {
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
        title: "Min. volume (T)",
        description: "Minimum volume in tons",
        minimum: 0
      },
      capacity: {
        type: "number",
        title: "Capacity (T)",
        description: "Maximum capacity in tons",
        minimum: 0
      }
    }
  },
  {
    id: "marginalProductionCosts",
    title: "Marginal Production Costs",
    type: "input",
    tableType: "grid",
    shortDescription: "Marginal production costs data",
    required: ["periodId", "location", "product", "productionLevel", "marginalCost"],
    properties: {
      periodId: {
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
      productionLevel: {
        type: "string",
        title: "Production level",
        description: "Production level identifier"
      },
      marginalCost: {
        type: "number",
        title: "Marginal cost",
        description: "Marginal cost amount",
        minimum: 0
      }
    }
  },
  {
    id: "productionLimits",
    title: "Production Limits",
    type: "input",
    tableType: "grid",
    shortDescription: "Production limits data",
    required: ["periodId", "location", "productCategory", "cumulativeProductionLimit"],
    properties: {
      periodId: {
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
      productCategory: {
        type: "string",
        title: "Product category",
        description: "Product category name"
      },
      cumulativeProductionLimit: {
        type: "number",
        title: "Cumulative production limit",
        description: "Cumulative production limit amount",
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
    required: ["periodId", "product", "volume", "incoterm", "cifDestinationOrFobOrigin", "price", "opportunity"],
    properties: {
      periodId: {
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
        title: "Volume (T)",
        description: "Volume amount in tons",
        minimum: 0
      },
      incoterm: {
        type: "string",
        title: "Incoterm",
        description: "International commercial term"
      },
      cifDestinationOrFobOrigin: {
        type: "string",
        title: "CIF destination or FOB origin",
        description: "Destination or origin location"
      },
      price: {
        type: "number",
        title: "Price ($)",
        description: "Price amount",
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
    id: "vesselTransportCosts",
    title: "Vessels Transport Costs",
    type: "input",
    tableType: "grid",
    shortDescription: "Vessel transport costs data",
    required: ["vessel", "startDate", "dailyCost", "dailyFixedCosts"],
    properties: {
      vessel: {
        type: "string",
        title: "Vessel",
        description: "Vessel name"
      },
      startDate: {
        type: "string",
        title: "Start date",
        description: "Transport cost start date (YYYY-MM-DD)"
      },
      dailyCost: {
        type: "number",
        title: "Daily cost ($)",
        description: "Daily cost amount",
        minimum: 0
      },
      dailyFixedCosts: {
        type: "number",
        title: "Daily fixed costs ($)",
        description: "Daily fixed costs amount",
        minimum: 0
      }
    }
  },
  {
    id: "charterCosts",
    title: "Charter Costs",
    type: "input",
    tableType: "grid",
    shortDescription: "Charter costs data",
    required: ["periodId", "category", "origin", "destination", "charterCost"],
    properties: {
      periodId: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      category: {
        type: "string",
        title: "Category",
        description: "Charter category"
      },
      origin: {
        type: "string",
        title: "Origin",
        description: "Origin location"
      },
      destination: {
        type: "string",
        title: "Destination",
        description: "Destination location"
      },
      charterCost: {
        type: "number",
        title: "Charter cost ($)",
        description: "Charter cost amount",
        minimum: 0
      }
    }
  },
  {
    id: "landTransportCosts",
    title: "Land Transport Costs",
    type: "input",
    tableType: "grid",
    shortDescription: "Land transport costs data",
    required: ["periodId", "category", "origin", "destination", "transportCost"],
    properties: {
      periodId: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      category: {
        type: "string",
        title: "Category",
        description: "Transport category"
      },
      origin: {
        type: "string",
        title: "Origin",
        description: "Origin location"
      },
      destination: {
        type: "string",
        title: "Destination",
        description: "Destination location"
      },
      transportCost: {
        type: "number",
        title: "Transport cost (USD)",
        description: "Transport cost amount in USD",
        minimum: 0
      }
    }
  },
  {
    id: "logisticsCosts",
    title: "Variable Logistics Costs",
    type: "input",
    tableType: "grid",
    shortDescription: "Variable logistics costs data",
    required: ["periodId", "location", "category", "variableCost"],
    properties: {
      periodId: {
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
      category: {
        type: "string",
        title: "Category",
        description: "Logistics category"
      },
      variableCost: {
        type: "number",
        title: "Variable cost ($/T)",
        description: "Variable cost per ton",
        minimum: 0
      }
    }
  },
  {
    id: "initialVesselLocation",
    title: "Initial Vessel Location",
    type: "input",
    tableType: "grid",
    shortDescription: "Initial vessel location data",
    required: ["vessel", "location"],
    properties: {
      vessel: {
        type: "string",
        title: "Vessel",
        description: "Vessel name"
      },
      location: {
        type: "string",
        title: "Location",
        description: "Initial location"
      }
    }
  },
  {
    id: "vesselAvailability",
    title: "Vessel Availability",
    type: "input",
    tableType: "grid",
    shortDescription: "Vessel availability data",
    required: ["periodId", "vessel", "availability"],
    properties: {
      periodId: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      vessel: {
        type: "string",
        title: "Vessel",
        description: "Vessel name"
      },
      availability: {
        type: "number",
        title: "Availability",
        description: "Availability percentage",
        minimum: 0,
        maximum: 1
      }
    }
  },
  {
    id: "forcedVoyages",
    title: "Forced Voyages",
    type: "input",
    tableType: "grid",
    shortDescription: "Forced voyages data",
    required: ["periodId", "origin", "destination", "forceEmpty", "minVoyages", "maxVoyages"],
    properties: {
      periodId: {
        type: "number",
        title: "Period",
        description: "Period index starting at 1",
        minimum: 1
      },
      origin: {
        type: "string",
        title: "Origin",
        description: "Origin location"
      },
      destination: {
        type: "string",
        title: "Destination",
        description: "Destination location"
      },
      forceEmpty: {
        type: "boolean",
        title: "Force empty",
        description: "Force empty voyage"
      },
      minVoyages: {
        type: "number",
        title: "Min voyages",
        description: "Minimum number of voyages",
        minimum: 0
      },
      maxVoyages: {
        type: "number",
        title: "Max voyages",
        description: "Maximum number of voyages",
        minimum: 0
      }
    }
  },
  {
    id: "portInefficiencies",
    title: "Port Inefficiencies",
    type: "input",
    tableType: "grid",
    shortDescription: "Port inefficiencies data",
    required: ["port", "loadingInefficiency", "unloadingInefficiency"],
    properties: {
      port: {
        type: "string",
        title: "Port",
        description: "Port name"
      },
      loadingInefficiency: {
        type: "number",
        title: "Loading inefficiency (hr)",
        description: "Loading inefficiency in hours",
        minimum: 0
      },
      unloadingInefficiency: {
        type: "number",
        title: "Unloading inefficiency (hr)",
        description: "Unloading inefficiency in hours",
        minimum: 0
      }
    }
  }
];
