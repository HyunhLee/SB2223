export interface B2bDefaultItem {
    count: number;
    lists: B2bDefaultItemModel[];
}

export interface B2bDefaultItemModel {
    id: number
    nameKo: string
    nameEn: string
    mainImageUrl: string
    mainImage: mainImage[]
    putOnImageUrl: string
    putOnPreviewImageUrl: string
    putOnImage: putOnImage[]
    categoryIds: number[]
    colorType: string
    patternType: string
    necklineType: string
    silhouetteType: string
    sleeveType: string
    lengthType: string
    verified: boolean
    activated: boolean
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string
    productId : number;
    productType : string;
    productNo : number;
    productCode : string
    detailSiteUrl : string
    priceNormal : number;
    priceDiscount : number;
    fitRefImageUrl : string
    displayStatus : string
    registrationType : string
    closetCategoryId : number;
    patternName : string
    colorName : string
    colorHex : string
    listOrder : number;
    fitRequestType : string
    fitRequestStatus : string
    isJennieFitRequested : boolean;
    isSoldOut : boolean;
    brandId : number;
    brandName : string
    gender: string;
    seasonTypes: string;
    productStyleKeyWords: string[];
}

export interface B2bDefaultItemDetailModel {
    id: number
    nameKo: string
    nameEn: string
    categoryIds: number[]
    verified: boolean
    activated: boolean
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string

    styleKeywords: string[]
    productStyleKeyWords: string[]
    seasonTypes: string
    gender: string
    productColors : ProductColors[];
    productCode: string;


}

export interface ProductColors{
    id: number
    listOrder: number
    colorName: string
    patternName: string
    mainImageUrl: string
    mainImage: mainImage[]
    putOnImageUrl: string
    putOnPreviewImageUrl: string
    putOnImage: putOnImage[]
}

export interface mainImage {
    imageUrl: string
    listOrder: number
}

export interface putOnImage {
    imageUrl: string
}

export const defaultB2bDefaultItemDetailModel = {
    id: null,
    nameKo: "",
    nameEn: "",
    categoryIds: [],
    verified: true,
    activated: true,
    createdBy: "",
    createdDate: "",
    lastModifiedBy: "",
    lastModifiedDate: "",
    seasonTypes: "",
    styleKeywords: [],
    productStyleKeyWords: [],
    gender: "",
    productCode :"",
    productColors: [{
        id: null,
        listOrder: null,
        mainImageUrl: "",
        mainImage: [],
        putOnImageUrl: "",
        putOnImage: [],
        putOnPreviewImageUrl: "",
        colorName: "",
        patternName: "",
    }]
}

export const defaultB2bDefaultItemModel = {
    id: null,
    nameKo: "",
    nameEn: "",
    mainImageUrl: "",
    mainImage: [],
    putOnImageUrl: "",
    putOnImage: [],
    putOnPreviewImageUrl: "",
    categoryIds: [],
    colorType: "",
    patternType: "",
    necklineType: "",
    silhouetteType: "",
    sleeveType: "",
    lengthType: "",
    verified: true,
    activated: true,
    createdBy: "",
    createdDate: "",
    lastModifiedBy: "",
    lastModifiedDate: ""
}

export interface Search {
    size: number,
    page: number,
    categoryId: string;
    categoryName: string;
    maleCategoryIds: string;
    maleCategoryName: string;
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    category5?: string;
    id: number;
    startDate: Date;
    endDate: Date;
    nameKo:string;
    colorName: string;
    patternName: string;
    seasonTypes: string;
    seasonTypesList: any;
    styleKeywords: string;
    styleKeywordsList: any;
    gender: string;
    activated: boolean;
}

export const defaultSearch = () => {
    return {
        page: 0,
        size: 20,
        categoryId: null,
        categoryName: '',
        maleCategoryIds: '',
        maleCategoryName: '',
        id: null,
        startDate: null,
        endDate: null,
        nameKo:'',
        colorName: '',
        patternName: '',
        seasonTypes: '',
        seasonTypesList: [],
        styleKeywords: '',
        styleKeywordsList: [],
        gender: '',
        productType: 'Default',
        activated: true
    }
}

export interface StyleKeywordsStatus {
    gender: Gender[];
    styleKeyword: StyleKeyword[];
}

export interface Gender {
    cnt: number;
    gender: string;
}

export interface StyleKeyword {
    cnt: number
    styleKeyword: string
}