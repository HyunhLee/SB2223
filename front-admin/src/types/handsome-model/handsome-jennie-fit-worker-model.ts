export interface HandsomeJennieFitWorkers {
  lists: HandsomeJennieFitWorkerModel[];
  count: number;
}

export interface HandsomeJennieFitWorkerModel {
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

//assign user model
export interface HandsomeJennieFitUserModel {
  id: number;
  userId: number;
  name: string;
  type: string;
  activated: boolean;
}

