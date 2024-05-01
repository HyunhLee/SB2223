export interface Product {
    count: number;
    lists: ProductModel[];
}

export interface ProductModel {
    id: number;
    mallId: number;
    productId: number;
    productNo: number;
    brandName: number;
    clickCount: number;
    productNameKo: string;
    productNameEn: string;
    thumnailImage: string;
    thumbnailImageUrl: string;
    fitRefImageUrl: string;
    categories: string[];
    activated: boolean;
    verified: boolean;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
}

export interface SearchProduct {
    id: number;
    mallId: number;
    productId: number;
    productNo: number;
    brandId: number;
    clicks: number;
    name: string;
    image: string;
    categoryId: number;
    activated: boolean;
    sort: string;
    page: number;
    size: number;
    startDate: Date;
    endDate: Date;
}

export const defaultSearchProduct = () => {
    return {
        id: null,
        mallId: null,
        productId: null,
        productNo: null,
        brandId: null,
        clicks: null,
        name: "",
        image: "",
        categoryId: null,
        activated: null,
        startDate: null,
        endDate: null,
        sort: 'desc',
        page: 0,
        size: 10
    }
}