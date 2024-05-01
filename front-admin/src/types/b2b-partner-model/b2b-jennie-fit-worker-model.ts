import moment from "moment";

export interface BtbJennieFitWorkers {
    lists: BtbJennieFitWorkerModel[];
    count: number;
}

export interface BtbJennieFitWorkerModel {
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

export interface BtbJennieFitWorkersWorks {
    workerId: number,
    workerName: string,
    countCompleted: number,
    countNormal: number,
    countUrgency: number,
    countRejected: number
}

export interface FitAssignSearch {
    workDayTo: Date
    workDayFrom: Date
    workerId: number
}

export const defaultFitAssignSearch = () => {
    return {
        workDayTo: new Date(),
        workDayFrom: moment().add(-15, 'days').toDate(),
        workerId: 0
    }
}
