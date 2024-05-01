export interface BrandsModel {
    count: number;
    lists: BrandModel[];
}

export interface BrandModel {
    id: number
    name: string
    nameKo: string
    nameEn: string
    logoImageUrl: string
    logoImage: any[]
    bannerImageUrl: string
    bannerImage: any[]
    thumbnailImageUrl: string
    thumbnailImage: any[]
    foundationYear?: number
    activated: boolean
    createdBy?: string
    createdDate?: string
    lastModifiedBy?: string
    lastModifiedDate?: string
    mallId?: number
    keywords: any[]
}

export const defaultBrandModel = () => {
    return {
        id: null,
        name: '',
        nameEn: '',
        nameKo: '',
        thumbnailImageUrl: '',
        thumbnailImage: null,
        logoImageUrl: '',
        logoImage: null,
        bannerImageUrl: '',
        bannerImage: null,
        keywords: [''],
        activated: null,
    }
}

export interface BrandCategorysModel {
    count: number;
    lists: BrandCategoryModel[];
}

export interface BrandCategoryModel {
    id?: number
    brand: Brand
    category: BrandCategory
}

export interface Brand {
    id?: number
    name: string
    nameKo: string
    nameEn: string
    description: string
    logoImageUrl: string
    bannerImageUrl: string
    thumbnailImageUrl: string
    foundationYear: string
    inspectionStatus: string
    verified: boolean
    activated: boolean
    createdBy?: string
    createdDate?: string
    lastModifiedBy?: string
    lastModifiedDate?: string
    mallId?: string
    categoryIds: string
}

export interface BrandCategory {
    id?: number
    type: string
    name: string
    depth: string
    listOrder: string
    activated: true,
    createdBy?: string
    createdDate?: string
    lastModifiedBy?: string
    lastModifiedDate?: string
    parentId?: string
}

export const defaultBrandCategoryModel = () => {
    return {
        id: null,
        brand: [
            {
                id: null,
                name: '',
                nameKo: '',
                nameEn: '',
                description: '',
                logoImageUrl: '',
                bannerImageUrl: '',
                thumbnailImageUrl: '',
                foundationYear: null,
                inspectionStatus: '',
                verified: false,
                activated: true,
                createdBy: '',
                createdDate: '',
                lastModifiedBy: '',
                lastModifiedDate: '',
                mallId: null,
                categoryIds: null
            }
        ],
        category: [
            {
                id: null,
                type: '',
                name: '',
                depth: null,
                listOrder: null,
                activated: true,
                createdBy: '',
                createdDate: '',
                lastModifiedBy: '',
                lastModifiedDate: '',
                parentId: null
            }
        ]
    }
}

//홈앱 브랜드순서조정
export interface brandUpdateList {
    id: number,
    brand: {
        id: number,
        name: string,
        nameKo: string,
        nameEn: string,
        description: string,
        logoImageUrl: string,
        bannerImageUrl: string,
        thumbnailImageUrl: string,
        foundationYear: number,
        wishedCount: number,
        activated: boolean,
        mall: number,
        brandCategories: number,
        brandWishes: number
    },
    activated: boolean,
    listOrder: number
}

export const defaultList = [
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder: null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder: null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    },
    {id: null,
        brand: {
            id:  null,
            name: '',
            nameKo: '',
            nameEn: '',
            description: '',
            logoImageUrl: '',
            bannerImageUrl: '',
            thumbnailImageUrl: '',
            foundationYear: null,
            wishedCount:  null,
            activated: true,
            mall:  null,
            brandCategories:  null,
            brandWishes:  null,
        },
        activated: false,
        listOrder:  null
    }, 
];
