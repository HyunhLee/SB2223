export interface Def {
    count: number;
    lists: DefModel[];
}

export interface DefModel {
    id: number;
    name: string;
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
    dto: DTO[];
    contents: Contents[];
    rank1: Rank;
    rank2: Rank;
    rank3: Rank;
}

export interface DTO {
    aggregate: string;
    clickCount: number;
    mallId: number;
    name: string;
}

export interface Contents {
    clickCounts: number;
    aggregateDate: string;
    mall: Mall;
    count: number;
    mallName: string;
    createdDate: string;
}

export interface Mall {
    activated: boolean;
    b2bServicePlanType: string;
    cartRefUrl: string;
    createdBy: string;
    createdDate: string;
    id: number;
    lastModifiedBy: string;
    lastModifiedDate: string;
    name: string;
    planEndDate: string;
    planStartDate: string;
    platform: string;
}

export interface Rank {
    mallId: number;
    mallName: string;
    salesPrice: number;
}

export interface SearchDef {
    id: number;
    mallId: number;
    brandId: number;
    activated: boolean;
    startDate: Date;
    endDate: Date;
    page: number;
    size: number;
}

export const defSearch = () => {
    return {
        id: null,
        mallId: null,
        brandId: null,
        activated: null,
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        page: 0,
        size: 10
    }
}