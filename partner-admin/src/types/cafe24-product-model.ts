

export interface Cafe24Products {
    count: number;
    lists: Cafe24ProductModel[];
}

export interface Cafe24ProductModel {
    shop_no: number;
    product_no: number;
    category: Category[]
    product_code: string;
    product_name: string;
    eng_product_name: string;
    price: string;
    retail_price: string;
    display: string;
    detail_image: string;
    list_image: string;
    tiny_image: string;
    small_image: string;
    created_date: string;
    updated_date: string;
    approve_status: string;
    sold_out: string;
    selling: string;
    seasonTypes: string;
    patternTypes: string;

    colorTypes: string;
    productColors: Colors[]

    sortType: string;
}

export interface Category {
    category_no: number;
    recommend: string;
    new: string;
}

export interface Colors {
    listOrder: number,
    colorName: string,
    colorHex: string,
    patternName: string
}

export interface ProductSearch {
    sort: string;
    order: string;
    offset: number;
    limit: number;
    product_name: string;
    category: number;
    display: string;
    sold_out: string;
    selling: string;
}

export const defaultProductSearch = (categoryNo) => {
    return {
        sort: 'created_date',
        order: 'desc',
        offset: 0,
        limit: 50,
        product_name: '',
        category: categoryNo,
        display: '',
        sold_out: '',
        selling: '',
        sortType: 'UNLINKED'
    }
}

export const defaultPage = () => {
    return 0;
}

export const defaultOffset = () => {
    return 0;
}
