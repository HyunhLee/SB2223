export interface JennieFitWorkers {
  lists: JennieFitWorkerModel[];
  count: number;
}

export interface JennieFitWorkerModel {
  id: number;
  workerId: number;
  workerName: string;
  workType: string;
  activated: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
