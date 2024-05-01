export interface Inquiries {
    count: number;
    lists: InquiryModel[];
}

export interface InquiryModel {
    id: number
    userName: string
    userEmail: string
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

export interface inquirySearch{
    type: string,
    userId: number,
    startDate: string,
    endDate: string,
    content: string,
    status: string,
    size: number,
    page: number,

}

export const DefaultInquirySearch = () =>{
    return {
        type: '',
        userId: Number(localStorage.getItem('userId')),
        startDate: null,
        endDate:  null,
        content: '',
        status: '',
        size: 10,
        page: 0,
    }
}