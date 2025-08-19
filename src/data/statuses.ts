import { StatusInfo } from '../types';

export const statusesData: StatusInfo[] = [
  {
    id: "done",
    name: "Done",
    isFinal: true,
    isRunnable: false,
    isCancelable: false,
    isDeletable: true,
    hasOutputs: true,
    isEditable: false
  },
  {
    id: "invalid",
    name: "Invalid",
    isFinal: true,
    isRunnable: false,
    isCancelable: false,
    isDeletable: true,
    hasOutputs: true,
    isEditable: false
  },
  {
    id: "draft",
    name: "Draft",
    isFinal: false,
    isRunnable: false,
    isCancelable: false,
    isDeletable: true,
    hasOutputs: false,
    isEditable: true
  },
  {
    id: "running",
    name: "Running",
    isFinal: false,
    isRunnable: true,
    isCancelable: true,
    isDeletable: false,
    hasOutputs: false,
    isEditable: false
  },
  {
    id: "error",
    name: "Error",
    isFinal: true,
    isRunnable: false,
    isCancelable: false,
    isDeletable: true,
    hasOutputs: false,
    isEditable: false
  },
  {
    id: "canceled",
    name: "Canceled",
    isFinal: true,
    isRunnable: false,
    isCancelable: false,
    isDeletable: false,
    hasOutputs: false,
    isEditable: false
  }
];
