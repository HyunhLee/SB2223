export interface NewPlanningModels {
    count: number;
    lists: NewPlanningModel[];
}

export interface NewPlanningModel {
    id?: number;
    imageUrl: string;
    startDate: Date;
    expireDate: Date;
    exhibitionType: string;
    title: string;
    brandName: string;
    targetUrl: string;
    listOrder: number;
    activated: boolean;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export const defaultNewPlanningModel = () => {
    return {
        id: null,
        imageUrl: "",
        startDate: null,
        expireDate: null,
        exhibitionType: "BRAND",
        title: "",
        brandName: "",
        targetUrl: "",
        listOrder: null,
        activated: true,
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: ""
    }
}