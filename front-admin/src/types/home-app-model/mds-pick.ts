import {ProductModel} from "../product-model";

export interface mdsPickList{
    count : number,
    list : mdsPickModel
}
export interface mdsPickModel{
    activated: boolean,
    expireDate: string,
    startDate: string,
    titleKo: string,
    titleEn: string,
    id:number,
    mdPickStyles: mdsPick[],

}

export interface mdsPick {
    id: number,
    imageUrl: string,

    listOrder: number,
    items: [
     {
        fitOrder: number,
        id: number,
        mdPickId: number,
        product : ProductModel,
     }
     ],
     mdPickId: number
}


export interface Search {
    size: number,
    page: number,
    title: string,
    titleKo:string,
    titleEn: string,
    categoryId: string;
    categoryName: string;
    id: number;
    startDate: Date;
    expireDate: Date;
    status:string;
    nameKo:string;
    brandId:number;
    colorTypes: string;
    patternTypes: string;
    fitRequestStatus:string;
    displayStatus:string;
    registrationType:string;
    seasonTypes:string;
    activated:boolean;
}

export const defaultSearch = () => {
    return {
        page: 0,
        size: 10,
        activated: true,
        categoryId: null,
        categoryName: '',
        id: null,
        startDate: null,
        expireDate: null,
        status:'',
        brandId:null,
        nameKo:'',
        colorTypes: '',
        patternTypes: '',
        fitRequestStatus:'',
        displayStatus:'',
        registrationType:'',
        seasonTypes:'',
        titleKo: '',
        titleEn: '',
        title: '',
    }
}


export const defaultMdsPickModel = {
    activated: true,
    expireDate: '',
    startDate: '',
    titleKo: '',
    titleEn: '',
    id: null,
    listOrder: null,
    mdPickStyles: [
        {
            id: null,
            imageUrl: "",
            items: [
                {id: null, product: {id : null}}
            ],
            listOrder: null,
            mdPickId: null,
},
        {
            id: null,
            imageUrl: "",
            items: [
                {id: null, product: {id : null}}
            ],
            listOrder: null,
            mdPickId: null,
        },
        {
            id: null,
            imageUrl: "",
            items: [
                {id: null, product: {id : null}}
            ],
            listOrder: null,
            mdPickId: null,
        },
    ]
}

