
export interface PKeywordGroupModel {
    id?: number
    description: string
    activated: boolean
    displayStatus: string
    keywordItems: PKeywordItemModel[]
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate?: string
    startDate: string
    expireDate: string
}

export const defaultPKeywordGroupModel = () => {
    return {
        id: null,
        description: "",
        activated: true,
        displayStatus: "",
        keywordItems: [{
            id: null,
            type: "KEYWORD",
            keyword: "",
            listOrder: null,
            activated: true,
            createdBy: "",
            createdDate: "",
            lastModifiedBy: "",
            lastModifiedDate: "",
            category: {id:null},
            brand: {id:null},
            keywordGroupId: null,
            patternType: "",
            colorType: ""
        }],
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        startDate: "",
        expireDate: ""
    }
}

export interface PKeywordItemModel {
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
    keywordGroupId: number
    patternType: string
    colorType: string
}

export const defaultPKeywordItemModel = () => {
    return {
        id: null,
        type: "KEYWORD",
        keyword: "",
        listOrder: null,
        activated: true,
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        category: {id:null},
        brand: {id:null},
        keywordGroupId: null,
        patternType: "",
        colorType: ""
    }
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