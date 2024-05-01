export interface PopularSearchWords {
    count: number;
    lists: PopularSearchWordsModel[];
}

export interface PopularSearchWordsModel {
    id?: number
    description: string
    activated: boolean
    displayStatus: string
    keywordItems: KeywordItemModel[]
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate?: string
    startDate: string
    expireDate: string
}

export interface KeywordItems {
    id: number
    type: string
    keyword: string
    listOrder: number
    categoryId: number
    brandId: number
    patternType: string
    colorType: string
}

export interface KeywordGroup {
    count: number;
    lists: KeywordGroupModel[];
}

export interface KeywordGroupModel {
    id: number
    description?: string
    activated?: boolean
    createdBy?: string
    createdDate?: string
    lastModifiedBy?: string
    lastModifiedDate?: string
    startDate?: string
    expireDate?: string
}

export interface KeywordItem {
    count: number;
    lists: KeywordItemModel[];
}

export interface KeywordItemModel {
    id?: number
    type: string
    keyword: string
    listOrder: number
    activated: boolean
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate?: string
    category: Category
    brand: Brand
    keywordGroup: KeywordGroupModel
    patternType: string
    colorType: string
}

export interface Category {
    id: number
    type?: string
    name?: string
    depth?: number
    listOrder?: number
    activated?: boolean
    createdBy?: string
    createdDate?: string
    lastModifiedBy?: string
    lastModifiedDate?: string
    parentId?: number
}
// export interface Category {
//     id?: number
//     type: string
//     name: string
//     depth: number
//     listOrder: number
//     activated: boolean
//     createdBy: string
//     createdDate: string
//     lastModifiedBy: string
//     lastModifiedDate?: string
//     parentId: number
// }

export interface Brand {
    id: number
    name?: string
    nameKo?: string
    nameEn?: string
    description?: string
    logoImageUrl?: string
    bannerImageUrl?: string
    thumbnailImageUrl?: string
    foundationYear?: string
    inspectionStatus?: string
    verified?: boolean
    activated?: boolean
    createdBy?: string
    createdDate?: string
    lastModifiedBy?: string
    lastModifiedDate?: string
    mallId?: number
    categoryIds?: number[]
}