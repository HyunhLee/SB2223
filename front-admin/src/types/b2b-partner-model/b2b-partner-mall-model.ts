export interface B2bPartnerMallModels {
    count: number;
    lists: B2bPartnerMallModel[];
}

export interface B2bPartnerMallModel {
    mall: Mall;
    planActivate: string;
}

export interface B2bPartnerMallDetailModel {
    platform: string;
    name: string;
    id?: number;
    brands: Brand[];
    gender: string;
    b2bServicePlanType: string;
    activated: boolean;
    planStartDate: string;
    planEndDate: string;
    jennifitUsedCnt: number;
    jennifitCnt: number;
    jennifitCntFirstmonth: number;
}

export const defaultMallDetailModel = () => {
    return {
        platform: "Cafe24",
        name: "",
        id: null,
        brands: [{
            id: null,
            name: "",
            nameKo: "",
            nameEn: "",
            mallId: null,
            activated: true,
            product: "",
            styleKeywords: "",
            styleKeywordsList: [],
            brandStyleKeyWords: [{
                id: null,
                styleKeyword: ""
            }]
        }],
        gender: "",
        b2bServicePlanType: "",
        activated: true,
        planStartDate: "",
        planEndDate: "",
        jennifitUsedCnt: null,
        jennifitCnt: null,
        jennifitCntFirstmonth: 0,

    }
}

export interface Mall {
    platform: string;
    name: string;
    id?: number;
    brands: Brand[];
    gender: string;
    cartRefUrl: string;
    b2bServicePlanType: string;
    activated: boolean;
    planStartDate: string;
    planEndDate: string;
}

export interface Brand {
    id: number;
    name: string;
    nameKo: string;
    nameEn: string;
    mallId?: number;
    activated: boolean;
    product: string;
    styleKeywords: string;
    styleKeywordsList: string[];
    brandStyleKeyWords: Keyword[];
}

export interface Keyword {
    id: number;
    styleKeyword: string;
}

export interface SearchMall {
    id: number;
    companyName: string;
    brandName: string;
    startDate: string;
    endDate: string;
    planType: string;
    planActivate: string;
    gender: string;
    page: number;
    size: number;
}

export const defaultSearchMall = () => {
    return {
        id: null,
        companyName: '',
        brandName: '',
        startDate: null,
        endDate: null,
        planType: 'ALL',
        planActivate: 'ALL',
        gender: '',
        page: 0,
        size: 20
    }
}