export interface Products {
    count: number;
    lists: ProductModel[];
}

export interface ProductModel {
    id: number
    type: string
    nameKo: string
    nameEn: string
    priceNormal: number
    priceDiscount: number
    displayStatus: string
    categoryIds: number[]
    detailSiteUrl: string
    price: number
    jenniefitCategory: string
    jenniefitCategoryId: number
    productCode: string
    productNo: number
    putOnImageUrl: string
    putOnPreviewImageUrl: string
    brandId: number
    brandName: string
    activated: string
    isSoldOut: boolean
    jennieFitRequestType: string
    requestStatus: string
    registrationType: string
    thumbnailImageUrl: string
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string
    mainImageUrl: string
    ghostImageUrl: string
    fitRefImageUrl: string
    verified: boolean
}

export interface SearchProduct {
    categoryId: number
    nameKo: string
    brandId: string
    id: number
    activated: boolean
    isSoldOut: boolean
    jennieFitRequestType: string
    requestStatus: string
    displayStatus: string
    registrationType: string
    startDate: string
    endDate: string
}

export const defaultProductModel = () => {
    return {
        id: null,
        nameKo: "",
        nameEn: "",
        price: null,
        priceNormal: null,
        categoryIds: [],
        detailSiteUrl: "",
        brandId: null,
        brandName: "",
        activated: '',
        jennieFitRequestType: "",
        requestStatus: "",
        registrationType: "",
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        mainImageUrl: "",
        ghostImageUrl: "",
        fitRefImageUrl: "",
        type: "RETAIL",
        priceDiscount: null,
        displayStatus: "",
        jenniefitCategory: "",
        jenniefitCategoryId: null,
        productCode: "",
        productNo: null,
        putOnImageUrl: "",
        putOnPreviewImageUrl: "",
        isSoldOut: null,
        thumbnailImageUrl: "",
        verified: null
    }
}

export const defaultSearchProduct = () => {
    return {
        categoryId: null,
        nameKo: '',
        brandId: '',
        id: '',
        activated: 'true',
        isSoldOut: null,
        jennieFitRequestType: '',
        requestStatus: '',
        displayStatus: '',
        registrationType: '',
        startDate: null,
        endDate: null,
        page: 0,
        size: 20
    }
}