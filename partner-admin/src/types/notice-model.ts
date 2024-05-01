export interface NoticeModel {
    count: number;
    lists: NoticeListModel[];
}

export interface NoticeListModel {
    id: number;
    title: string;
    contents: string;
    createdBy: string;
    createdDate: Date;
    topFix: boolean;
    fixStartDate: Date;
    fixEndDate: Date;
    activated: boolean;
}

export interface NoticeDetailModel {
    id: number;
    title: string;
    contents: string;
    topFix: boolean;
    fixStartDate: Date;
    fixEndDate: Date;
    activated: boolean;
    imageUrlList: string[];
}

export const defaultNoticeModel = () => {
    return {
        id: null,
        title: '',
        contents: '',
        topFix: false,
        fixStartDate: null,
        fixEndDate: null,
        activated: true,
        imageUrlList: [],
    }
}

export interface SearchNotice {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    page: number;
    size: number;
}

export const defaultSearchNotice = () => {
    return {
        id: null,
        title: '',
        startDate: null,
        endDate: null,
        page: 0,
        size: 10
    }
}