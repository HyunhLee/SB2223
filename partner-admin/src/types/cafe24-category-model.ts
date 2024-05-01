export interface Cafe24Categories {
    count: number;
    lists: Cafe24CategoryModel[];
}

export interface Cafe24CategoryModel {
    shop_no: number;
    category_no: number;
    category_depth: number;
    parent_category_no: number;
    category_name: string;
    display_type: string;
    full_category_name: FullCategoryName[];
    root_category_no: number;
    use_main: string;
    use_display: string;
    display_order: number;
    full_category_no: FullCategoryNo[];
    soldout_product_display: string;
    sub_category_product_display: string;
    hashtag_product_display: string;
    hash_tags: string[],
    product_display_scope: string;
    product_display_type: string;
    product_display_key: string;
    product_display_sort: string;
    product_display_period: string;
    normal_product_display_type: string;
    normal_product_display_key: string;
    normal_product_display_sort: string;
    normal_product_display_period: string;
    recommend_product_display_type: string;
    recommend_product_display_key: string;
    recommend_product_display_sort: string;
    recommend_product_display_period: string;
    new_product_display_type: string;
    new_product_display_key: string;
    new_product_display_sort: string;
    new_product_display_period: string;
    access_authority: string;
}

export interface FullCategoryName {
    1: string;
    2: string;
    3: string;
    4: string;
}

export interface FullCategoryNo {
    1: string;
    2: string;
    3: string;
    4: string;
}