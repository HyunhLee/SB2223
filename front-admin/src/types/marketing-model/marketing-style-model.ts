export interface Style {
    count: number;
    lists: StyleModel[];
}

export interface StyleModel {
    id: number;
    userLogin: string;
    styleAvatarImageUrl: string;
    products: Products[];
    createdDate: string;
}

export interface SearchStyle {
    id: number;
    mallId: number;
    brandId: number;
    styleId: number;
    userLogin: number;
    productId: number;
    productNo: number;
    closetCategoryId: number;
    productName: string;
    sort: string;
    page: number;
    size: number;
    startDate: Date;
    endDate: Date;
}

export interface Products {
    id: number;
    nameKo: string;
    nameEn: string;
    productNo: number;
    thumbnailImageUrl: string;
    brandId: number;
    brandNameEn: string;
    brandNameKo: string;
    categoryIds: number[];
    closetCategoryId: number;
    closetCategory: string;
    count: number;
}

export const defaultSearchStyle = () => {
    return {
        id: null,
        mallId: null,
        brandId: null,
        styleId: null,
        userLogin: null,
        productId: null,
        productNo: null,
        productName: "",
        closetCategoryId: null,
        startDate: null,
        endDate: null,
        sort: 'desc',
        page: 0,
        size: 10
    }
}