export interface Inquiries {
    count: number;
    lists: InquiryModel[];
}

export interface InquiryModel {
    id: number
    userName: string
    userId: number
    contents: string
    answer: string
    status: string
    type: string
    activated: boolean
    sortValue: number
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string

    imageUrlList : []
}