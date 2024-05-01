export interface DetailClick {
    count: number;
    lists: DetailClickModel[];
}

export interface DetailClickModel {
    clickCounts: number;
    product: Product;
    thumnailImage: string;
}

export interface Product {
    id: number;
    productNo: number;
    nameKo: string;
    brand: Brand;
    closetCategoryId: number;
    fitRefImageUrl: string;
}

export interface Brand {
    id: number;
    name: string;
}

export interface SearchDetailClick {
    id: number;
    mallId: number;
    productNo: number;
    productId: number;
    brandId: number;
    categoryId: number;
    productName: string;
    sort: string;
    page: number;
    size: number;
    startDate: Date;
    endDate: Date;
}

export const defaultSearchDetailClick = () => {
    return {
        id: null,
        mallId: null,
        productNo: null,
        productId: null,
        productName: "",
        brandId: null,
        categoryId: null,
        startDate: null,
        endDate: null,
        sort: 'c',
        page: 0,
        size: 10,
    }
}