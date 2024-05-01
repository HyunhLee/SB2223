import {useState} from "react";

export interface AmountFittingRoomCart {
  count: number;
  lists: AmountFittingRoomCartModel[];
}

export interface AmountFittingRoomCartModel  {
  containCounts: number,
  product: {
    createdBy: string,
    createdDate: string,
    lastModifiedBy: string,
    lastModifiedDate: string,
    id: number,
    type: string,
    nameKo: string,
    nameEn: string,
    productNo: number,
    productCode: string,
    detailSiteUrl: string,
    priceNormal: number,
    priceDiscount: number,
    thumbnailImageUrl: string,
    putOnImageUrl: string,
    fitRefImageUrl: string,
    putOnPreviewImageUrl: string,
    displayStatus: string,
    requestStatus: string,
    registrationType: string,
    jennieFitRequestType: string,
    isJennieFitRequested: boolean,
    isSoldOut: boolean,
    verified: boolean,
    activated: boolean,
    closetCategoryId: number,
    productCategories: number,
    brand: {
      createdBy: string,
      createdDate: string,
      lastModifiedBy: string,
      lastModifiedDate: string,
      id: number,
      name: string,
      nameKo: string,
      nameEn: string,
      activated: boolean
    },
    jenniefitCategory: string,
    mall: {
      createdBy: string,
      createdDate: string,
      lastModifiedBy: string,
      lastModifiedDate: string,
      id: number,
      platform: string,
      b2bServicePlanType: string,
      name: string,
      activated: boolean,
      cartRefUrl: string,
    }
  }
}

export interface FittingRoomCartSearchModel{
  mallId: number,
  size: number,
  page:number,
  startDate: string,
  endDate: string,
  productId: number,
  productNo: number,
  productName: string,
  brandId: number,
  categoryId: number,
  minPrice: number,
  maxPrice: number,
  sort: string,
}

export const defaultFittingRoomCartSearchModel = () =>{
  return{
    mallId: Number(localStorage.getItem('mallId')),
    size: 10,
    page: 0,
    startDate: null,
    endDate: null,
    productId: null,
    productNo: null,
    productName: '',
    brandId: null,
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    sort: 'Popular',
  }
}

export const defaultAmountFittingRoomCartModel = () => {
  return [
    {
      "containCounts": 2,
      "product": {
        "createdBy": "russel_test",
        "createdDate": "2022-10-11T08:48:21Z",
        "lastModifiedBy": "anonymousUser",
        "lastModifiedDate": "2022-10-24T02:55:12.845286Z",
        "id": 2,
        "type": "Retail",
        "nameKo": "러셀_테스트",
        "nameEn": "russel_test",
        "productNo": 1,
        "productCode": "test",
        "detailSiteUrl": "https://onska.kr/top/?idx=71&utm_source=stylebot&utm_medium=click",
        "priceNormal": 10000,
        "priceDiscount": 9000,
        "thumbnailImageUrl": "https://image.stage.stylebot.io/product/1648175925646.png",
        "putOnImageUrl": "https://image.stage.stylebot.io/product/1664348066901.png",
        "fitRefImageUrl": "https://image.stage.stylebot.io/product/1647486174746.jpg",
        "putOnPreviewImageUrl": "https://image.stage.stylebot.io/product/1659684743264-preview.png",
        "displayStatus": "DisplayOn",
        "requestStatus": "Inspection",
        "registrationType": "Automatic",
        "jennieFitRequestType": "JennieFit",
        "isJennieFitRequested": true,
        "isSoldOut": true,
        "verified": true,
        "activated": true,
        "closetCategoryId": 1001,
        "productCategories": null,
        "brand": {
          "createdBy": "russel_test",
          "createdDate": "2022-10-11T08:48:18Z",
          "lastModifiedBy": "russel_test",
          "lastModifiedDate": "2022-10-11T08:48:18Z",
          "id": 1,
          "name": "brand_test",
          "nameKo": "브랜드테스트",
          "nameEn": "brand_test",
          "activated": true
        },
        "jenniefitCategory": "OUTER_JUMPER_LONG_OJLS",
        "mall": {
          "createdBy": "russel_test",
          "createdDate": "2022-10-11T08:48:15Z",
          "lastModifiedBy": "russel_test",
          "lastModifiedDate": "2022-10-11T08:48:15Z",
          "id": 1,
          "platform": "Cafe24",
          "b2bServicePlanType": "BUSINESS",
          "name": "jenniespick",
          "activated": true,
          "cartRefUrl": "test"
        }
      }
    }
  ]
}


//chart cart data
export interface AmountCartModel{
  id: number,
  mallId: number,
  mallName: string,
  brandId: number,
  brandName: string,
  salesPrice: number,
  salesCount: number,
  aggregateDate: string,
}

export const DefaultAmountCartModel = () => {
return[ {
  "id": 41,
  "mallId": 0,
  "mallName": "test_bc094f4aba8a",
  "brandId": 59,
  "brandName": "test_1dab7e94192b",
  "salesPrice": 567000,
  "salesCount": 69,
  "aggregateDate": "2023-01-06"
},
]
}


export interface purchaseCartModel {
  date: string,
  count: number,
}

export const DefaultPurchaseCartModel = () =>{
  return [
    { date: '2023/01/06', count: 150000},
      { date: '2023-01-07T01:16:57.186671Z', count: 344440},
      { date: '2023-01-08T01:16:57.186671Z', count: 269033},
    ]
}