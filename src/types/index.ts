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
