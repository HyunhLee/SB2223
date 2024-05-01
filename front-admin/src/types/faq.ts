export interface Faqs {
    count: number;
    lists: FaqModel[];
}

export interface FaqModel {
    id: number
    question: string
    answer: string
    category: string
    activated: boolean
    sortValue: number
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string
}