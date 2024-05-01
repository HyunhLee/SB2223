export interface FaqModel {
    count: number;
    lists: FaqListModel[];
}

export interface FaqListModel {
    id: number;
    question: string;
    answer: string;
    faqType: string;
    createdDate: string;
    createdBy: string;
}

export interface FaqDetailModel {
    id: number;
    question: string;
    answer: string;
    faqType: string;
}

export const defaultFaqModel = () => {
    return {
        id: null,
        question: '',
        answer: '',
        faqType: ''
    }
}

export interface SearchFaq {
    id: number;
    question: string;
    answer: string;
    faqType: string;
    page: number;
    size: number;
}

export const defaultSearchFaq = () => {
    return {
        id: null,
        question: '',
        answer: '',
        faqType: 'All',
        page: 0,
        size: 20
    }
}