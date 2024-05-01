export interface ProductColor {
    count: number;
    lists: ProductColorModel[];
}

export interface ProductColorModel {
    id: number
    type: string
    nameKo: string
    nameEn: string
    priceNormal: number
    priceDiscount: number
    categoryIds: number[]
    detailSiteUrl: string
    productCode: string
    productNo: number
    brandId: number
    mallId: number;
    registrationType: string
    seasonTypes: string;
    fitRefImageUrl: string
    productColors: ProductColors[]
    displayStatus: string
    fitRequestStatus: string
}

export interface ProductColors {
    id: number;
    listOrder: number;
    colorName: string;
    colorHex: string;
    patternName: string;
    fitRequestStatus: string;
}

export const defaultProductColorModel = () => {
    return {
        id: null,
        nameKo: "",
        nameEn: "",
        priceNormal: null,
        priceDiscount: null,
        categoryIds: [],
        detailSiteUrl: "",
        brandId: null,
        registrationType: "Manual",
        seasonTypes: "",
        fitRefImageUrl: "",
        type: "Retail",
        mallId: Number(localStorage.getItem('mallId')),
        productCode: "",
        productNo: null,
        productColors: [{
            id: null,
            listOrder: null,
            colorName: "",
            colorHex: "",
            patternName: "",
            fitRequestStatus: "InputWait"
        }],
        displayStatus: "",
        fitRequestStatus: "",
    }
}