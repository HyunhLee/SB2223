export interface MyClosetUpload {
    count: number;
    lists: MyClosetUploadModel[];
}

export interface MyClosetUploadModel {
    adjusted: boolean
    brandName: string
    categoryConcat: string
    categoryId?: number
    closetCategoryId?: number
    colorType: string
    description: string
    id?: number
    inspectionStatus: string
    label: string
    lengthType: string
    mainImageUrl: string
    maskImageUrl: string
    necklineType: string
    originalImageUrl: string
    originalImage: OriginalImage[]
    patternType: string
    putOnImageUrl: string
    seasonTypes: string
    silhouetteType: string
    sleeveType: string
    userDressCategory?: UserDressCategory[]
    verified: boolean
    registrationType?: string
    email?: string
    userId?: number
    categoryIds?: number[]
}

export interface UserDressCategory {
    categoryDepth: number
    categoryId: number
    id?: number
}

export interface OriginalImage {
    imageUrl: string
}

export interface EmailListModel {
    id?: number
    login: string
    firstName: string
    lastName: string
    email?: string
    phone: null
    imageUrl: string
    activated: true
    langKey: string
    provider: null
    region: null
    ipAddress: null
    createdBy?: string
    createdDate?: null
    lastModifiedBy?: string
    lastModifiedDate?: null
    authorities: []
}