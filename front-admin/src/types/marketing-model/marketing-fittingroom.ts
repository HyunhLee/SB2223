export interface AmountFittingRoomCart {
  count: number;
  lists: AmountFittingRoomCartModel[];
}

export interface AmountFittingRoomCartModel  {
  containCounts: number,
  thumnailImage: string;
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
  startDate:Date,
  endDate:Date,
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
    mallId: null,
    size: 10,
    page: 0,
    startDate: null,
    endDate: null,
    productId: null,
    productNo: null,
    productName: '',
    brandId: null,
    categoryId: null,
    minPrice: 0,
    maxPrice: 0,
    sort: 'Popular',
  }
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

export interface purchaseCartModel {
  date: string,
  count: number,
}