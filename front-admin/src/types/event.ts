
export interface EventSearch {
    count: number;
    lists: EventInfoModel[];
}


export interface EventSearchModel {
    id: number;
    title: string;
    displayStatus: string;
    startDate: Date;
    expireDate: Date;
    popupType: string;
    size: number;
    page: number;
}

export interface EventInfoModel{
    id: number;
    image: string[];
    imageUrl: string;
    startDate: Date;
    expireDate: Date;
    targetUrl: string;
    title: string;
    brandId: number;
    brandName: string;
    popupType: string;
}

export const defaultEventModel = () => {
    return (
        {
            id: null,
            image: [],
            imageUrl: "",
            startDate: null,
            expireDate: null,
            targetUrl: "",
            title: "",
            brandId: null,
            brandName: "",
            popupType: ''
        }
    )
}


export const defaultSearchEventModel = () => {
    return (
        {
            createdBy: "",
            createdDate: null,
            displayStatus: 'all',
            id: null,
            image: [],
            imageUrl: "",
            lastModifiedBy: "",
            lastModifiedDate: null,
            startDate: null,
            expireDate: null,
            targetUrl: "",
            title: "",
            brandId: null,
            brandName: "",
            popupType: '',
            size: 20,
            page: 0,
        }
    )
}