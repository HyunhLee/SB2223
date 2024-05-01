export interface HandsomeProducts {
    count: number;
    lists: HandsomeProductModel[];
}

export interface HandsomeProductModel {
    id: number
    number: string
    name:string
    brand: string
    thumbnailImageUrl: string
    jennieFitAssignStatus:string
    jennieFitRequestStatus:string
    displayStatus: string
    createdDate: string
    isSoldOut: boolean
    jennieFitImageUrl: string
    fitRefImageUrl: string
    grade: number
    jennieFitThumbnailImageUrl: string
}

export interface HandsomeProductDetailModel{
    id: number
    number: string
    name: string
    categoryIds: []
    categoryTypes: []
    brand: string
    priceNormal: number
    priceDiscount: number
    detailSiteUrl: string
    thumbnailImageUrl: string
    grade: number
    jennieFitThumbnailImageUrl: string
}

export interface ImageProcessing {
    mainImageUrl: string
    putOnImageUrl: string
    putOnPreviewImageUrl: string
}