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

    imageUrlList: string[];
}

export interface NoticeDetailModel {
    id: number;
    title: string;
    contents: string;
    topFix: boolean;
    fixStartDate: Date;
    fixEndDate: Date;
    activated: boolean;
    imageList: string[];
    imageUrlList: imageUrl[];

}

export interface imageUrl {
    id: number;
    imageUrl: string;
    imageName: string;
}
export interface file {
    id: number;
    size: number;
    name: string;
    url: string;
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
        imageList: [],

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