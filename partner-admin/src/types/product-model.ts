export interface Products {
    count: number;
    lists: ProductModel[];
}

export interface ProductModel {
    id: number
    type: string
    nameKo: string
    nameEn: string
    price: number
    categoryIds: number[]
    detailSiteUrl: string
    searchWord: []
    colorType: string
    patternType: string
    brandId: number
    brandName: string
    seasonType: string
    activated: boolean
    isSoldOut: boolean
    fitRequestStatus: boolean
    registrationStatus: string
    registrationType: string
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string

    mainImageUrl: string
    mainImage: string
    putOnImageUrl: string
    putOnPreviewImageUrl: string
    putOnImage: string
    ghostImageUrl: string
    fitRefImageUrl: string
    ghostImage: string
    fitRefImage: string
    shopImageUrlList: string
    shopImageList: string
}

// export interface ImageUrlList {
//   imageUrl: string
//   listOrder: number
// }
//
// export interface ImageList {
//   imageUrl: string
//   listOrder: number
// }
//
export interface SearchProduct {
    categoryIds: string
    nameKo: string
    brandName: string
    id: number
    activated: boolean
    isSoldOut: boolean
    fitRequestStatus: boolean
    registrationStatus: string
    registrationType: string
    startDate: string
    endDate: string
}

export const defaultProductModel = () => {
    return {
        id: 245,
        nameKo: "봉실봉실 어깨뽕 프릴케케케케케 케케케케ㅔ케케케케케케케케화이트 티셔츠",
        nameEn: "white t-shirt",
        price: 500050,
        categoryIds: [5, 14],
        detailSiteUrl: "https://www.naver.com",
        searchWord: ['화이트', '흰색'],
        colorType: "WHITE",
        patternType: "SOLID",
        brandId: 402,
        brandName: "SYSTEM",
        seasonType: "SPRING",
        activated: false,
        isSoldOut: false,
        fitRequestStatus: false,
        registrationStatus: "INPUT_WAIT",
        registrationType: "MANUAL_PARTNER",
        createdBy: "admin",
        createdDate: "2022-08-04T03:24:19.348244Z",
        lastModifiedBy: "admin",
        lastModifiedDate: "2022-08-04T03:29:06.389446Z",
        mainImageUrl: "https://image.stage.stylebot.io/product/1659583548453.png",
        mainImage: "",
        putOnImageUrl: "https://image.stage.stylebot.io/product/16595835484product-model.ts53.png",
        putOnPreviewImageUrl: "https://image.stage.stylebot.io/product/1659583548453.png",
        putOnImage: "",
        ghostImageUrl: "https://image.stage.stylebot.io/product/1659583548453.png",
        fitRefImageUrl: "https://image.stage.stylebot.io/product/1659583548453.png",
        ghostImage: "",
        fitRefImage: "",
        shopImageUrlList: ["https://image.stage.stylebot.io/product/1659583548453.png", "https://image.stage.stylebot.io/product/1659583548453.png"],
        shopImageList: ["https://image.stage.stylebot.io/product/1659583548453.png", "https://image.stage.stylebot.io/product/1659583548453.png"]
    }
}

export const defaultSearchProduct = () => {
    return {
        categoryIds: [],
        nameKo: '',
        brandName: '',
        id: '',
        activated: null,
        fitRequestStatus: null,
        registrationStatus: '',
        registrationType: '',
        isSoldOut: null,
        startDate: null,
        endDate: null
    }
}