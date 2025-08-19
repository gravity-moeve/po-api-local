import type { TableDefinition } from '../types';

export const tableDefinitionsData: TableDefinition[] = [
  {
    id: "raw_materials",
    title: "Raw Materials",
    type: "input",
    tableType: "grid",
    shortDescription: "Define raw materials and their properties",
    required: ["name", "quantity", "unit"],
    properties: {
      name: {
        type: "string",
        title: "Material Name",
        description: "Name of the raw material",
        maxLength: 100
      },
      quantity: {
        type: "number",
        title: "Quantity",
        description: "Amount of material needed",
        minimum: 0
      },
      unit: {
        type: "string",
        title: "Unit",
        description: "Unit of measurement",
        enum: ["kg", "tons", "liters", "pieces"]
      },
      cost: {
        type: "number",
        title: "Unit Cost",
        description: "Cost per unit",
        minimum: 0,
        decimalPlaces: 2
      }
    }
  },
  {
    id: "production_parameters",
    title: "Production Parameters",
    type: "input",
    tableType: "form",
    shortDescription: "Production configuration parameters",
    required: ["efficiency", "capacity"],
    properties: {
      efficiency: {
        type: "number",
        title: "Efficiency Rate",
        description: "Production efficiency percentage",
        minimum: 0,
        maximum: 100,
        decimalPlaces: 2
      },
      capacity: {
        type: "number",
        title: "Daily Capacity",
        description: "Maximum daily production capacity",
        minimum: 0
      },
      shift_hours: {
        type: "number",
        title: "Shift Hours",
        description: "Working hours per shift",
        minimum: 1,
        maximum: 24
      }
    }
  }
];
