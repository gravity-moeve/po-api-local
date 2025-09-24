import type { Selectors, TableId } from '../types';

// Mock data for selectors
const MOCK_LOCATIONS = ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Seattle", "Boston", "Atlanta"];
const MOCK_PRODUCTS = ["Product A", "Product B", "Product C", "Product D", "Product E"];
const MOCK_CATEGORIES = ["Category 1", "Category 2", "Category 3", "Standard", "Premium"];
const MOCK_VESSELS = ["Vessel Alpha", "Vessel Beta", "Vessel Gamma", "Vessel Delta", "Vessel Epsilon"];
const MOCK_PORTS = ["Port A", "Port B", "Port C", "Port D", "Port E"];
const MOCK_INCOTERMS = ["FOB", "CIF"];
const MOCK_OPPORTUNITIES = ["Standard", "Premium", "Express", "Economy"];
const MOCK_PRODUCT_CATEGORIES = ["Raw Materials", "Finished Goods", "Semi-Finished", "Chemicals"];
const MOCK_PRODUCTION_LEVELS = ["Level 1", "Level 2", "Level 3", "Base", "Peak"];

/**
 * Generates selectors for a given table based on its structure
 */
export function generateSelectorsForTable(tableId: TableId): Selectors {
  const selectors: Selectors = {};

  switch (tableId) {
    case "domesticDemandForecast":
      selectors.location = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.product = { dependencies: ["location"], items: MOCK_PRODUCTS };
      break;

    case "internationalDemandForecast":
      selectors.product = { dependencies: [], items: MOCK_PRODUCTS };
      selectors.incoterm = { dependencies: [], items: MOCK_INCOTERMS };
      selectors.cifDestinationOrFobOrigin = { dependencies: ["incoterm"], items: MOCK_PORTS };
      selectors.opportunity = { dependencies: [], items: MOCK_OPPORTUNITIES };
      break;

    case "initialStock":
      selectors.location = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.product = { dependencies: ["location"], items: MOCK_PRODUCTS };
      break;

    case "stockCapacities":
      selectors.location = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.product = { dependencies: ["location"], items: MOCK_PRODUCTS };
      break;

    case "marginalProductionCosts":
      selectors.location = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.product = { dependencies: ["location"], items: MOCK_PRODUCTS };
      selectors.productionLevel = { dependencies: [], items: MOCK_PRODUCTION_LEVELS };
      break;

    case "productionLimits":
      selectors.location = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.productCategory = { dependencies: [], items: MOCK_PRODUCT_CATEGORIES };
      break;

    case "importOpportunities":
      selectors.product = { dependencies: [], items: MOCK_PRODUCTS };
      selectors.incoterm = { dependencies: [], items: MOCK_INCOTERMS };
      selectors.cifDestinationOrFobOrigin = { dependencies: ["incoterm"], items: MOCK_PORTS };
      selectors.opportunity = { dependencies: [], items: MOCK_OPPORTUNITIES };
      break;

    case "vesselTransportCosts":
      selectors.vessel = { dependencies: [], items: MOCK_VESSELS };
      break;

    case "charterCosts":
      selectors.category = { dependencies: [], items: MOCK_CATEGORIES };
      selectors.origin = { dependencies: [], items: MOCK_PORTS };
      selectors.destination = { dependencies: ["origin"], items: MOCK_PORTS };
      break;

    case "landTransportCosts":
      selectors.category = { dependencies: [], items: MOCK_CATEGORIES };
      selectors.origin = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.destination = { dependencies: ["origin"], items: MOCK_LOCATIONS };
      break;

    case "logisticsCosts":
      selectors.location = { dependencies: [], items: MOCK_LOCATIONS };
      selectors.category = { dependencies: [], items: MOCK_CATEGORIES };
      break;

    case "initialVesselLocation":
      selectors.vessel = { dependencies: [], items: MOCK_VESSELS };
      selectors.location = { dependencies: [], items: MOCK_PORTS };
      break;

    case "vesselAvailability":
      selectors.vessel = { dependencies: [], items: MOCK_VESSELS };
      break;

    case "forcedVoyages":
      selectors.origin = { dependencies: [], items: MOCK_PORTS };
      selectors.destination = { dependencies: ["origin"], items: MOCK_PORTS };
      break;

    case "portInefficiencies":
      selectors.port = { dependencies: [], items: MOCK_PORTS };
      break;

    default:
      // No selectors for unknown table types
      break;
  }

  return selectors;
}

/**
 * Generates mock selectors with sample data for testing
 */
export function generateMockSelectors(tableId: TableId): Selectors {
  return generateSelectorsForTable(tableId);
}