import type { InputDataset } from '../types';

export const inputDatasetsData: Record<string, InputDataset> = {
  "raw_materials": {
    tableId: "raw_materials",
    title: "Raw Materials Dataset",
    rows: [
      {
        name: "Iron Ore",
        quantity: 1000,
        unit: "tons",
        cost: 150.50
      },
      {
        name: "Coal",
        quantity: 500,
        unit: "tons",
        cost: 89.25
      },
      {
        name: "Limestone",
        quantity: 200,
        unit: "tons",
        cost: 45.00
      }
    ]
  },
  "production_parameters": {
    tableId: "production_parameters",
    title: "Production Parameters Dataset",
    rows: [
      {
        efficiency: 85.5,
        capacity: 1000,
        shift_hours: 8
      },
      {
        efficiency: 92.0,
        capacity: 1200,
        shift_hours: 12
      }
    ]
  }
};
