export interface HandsomeJennieFitAssignments {
    count: number;
    lists: any[];
}

export interface HandsomeJennieFitAssignmentModel {
    id?: number;
    status: string;
    priorityType: string;
    product: Product;
    workerId: number;
    workerName: string;
    workStartDay: string;
    putOnPreviewImageUrl?: string;
    putOnImageUrl?: string;
    thumbnailImageUrl?: string;
    jennieFitStatusHistory: StatusHistory[]
}

export interface Product {
    id: number
    number: number
    categoryIds: number[]
    grade: number
    brand: Brand
    name: string
    detailSiteUrl: string
    thumbnailImageUrl: string
    brandName: string
    jennieFitAssignStatus: string
    categoryId: number
    jennieFitImageUrl: string
    activated: string
    putOnPreviewImageUrl?: string
    jennieFitThumbnailImageUrl?: string;
    gender : string
}

export interface Brand {
    id: number
    nameKo: string
    nameEn: string
}

export interface ImageList {
    imageUrl: string,
    listOrder: number
}

export interface HandsomeJennieFitStatus {
    countCompleted: number
    countNormal: number
    countRejected: number
    countUrgency: number
    workerId: number
    workerName: string
}

export interface HandsomeJennieFitAssignmentProduct{
    activated: string
    brand: string
    categoryIds: string
    categoryTypes: []
    createdDate: string
    fitRefImageUrl: string
    id: number
    jennieFitAssignStatus: string
    jennieFitRequestStatus: string
    name: string
    number: string
    thumbnailImageUrl:string
    workerId: number
    workerName: string
    status: string

}

export interface StatusHistory {
    id: number
    changeMessage?: string
    beforeStatus: string
    afterStatus: string
    createdDate: string
}
