import moment from "moment";

export interface Def {
    count: number;
    lists: DefModel[];
}

export interface DefModel {
    id: number;
    mallId: number;
    brandId: number;
    count: number;
    activated: boolean;
    verified: boolean;
    date: string;
    aggregateDate: string;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export interface SearchDef {
    id: number;
    mallId: number;
    brandId: number;
    activated: boolean;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
}
export const defSearch = () => {
    return {
        id: null,
        mallId: Number(localStorage.getItem('mallId')),
        brandId: null,
        activated: null,
        startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        page: 0,
        size: 10
    }
}