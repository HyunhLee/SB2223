export interface Products {
  count: number;
  lists: ProductModel[];
}

export interface ProductModel {
  id: number
  type: string
  nameKo: string
  nameEn: string
  detailSiteUrl: string
  price: number
  mainImageUrl: string
  mainImage: mainImage[]
  putOnImageUrl: string
  putOnPreviewImageUrl: string
  putOnImage: putOnImage[]
  ghostImageUrl: string
  fitRefImageUrl: string
  ghostImage: ghostImage[]
  fitRefImage: fitRefImage[]
  imageUrlList: ImageUrlList[]
  imageList: ImageList[]
  listImageUrl: string
  searchWord: string
  seasonTypes: string
  styleKeywords: string
  styleKeywordsList: string[]
  colorType: string
  patternType: string
  necklineType: string
  silhouetteType: string
  sleeveType: string
  lengthType: string
  displayStatus: string
  registrationType: string
  fitRequestStatus: string
  inspectionStatus: string
  verified: boolean
  activated: boolean
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  brandId: number
  categoryIds: number[]
  jenniefitCategory: string
  jenniefitCategoryId: number
}

export interface ImageUrlList {
  imageUrl: string
  listOrder: number
}

export interface ImageList {
  imageUrl: string
  listOrder: number
}

export interface mainImage {
  imageUrl: string
  listOrder: number
}

export interface putOnImage {
  imageUrl: string
}


export interface ghostImage {
  imageUrl: string
}

export interface fitRefImage {
  imageUrl: string
}

export const defaultProductModel = {
  id: null,
  type: "",
  nameKo: "",
  nameEn: "",
  detailSiteUrl: "",
  price: null,
  mainImageUrl: "",
  mainImage: [],
  putOnImageUrl: "",
  putOnImage: [],
  putOnPreviewImageUrl: "",
  ghostImageUrl: "",
  fitRefImageUrl: "",
  ghostImage: [],
  fitRefImage: [],
  imageUrlList: [],
  imageList: [],
  listImageUrl: "",
  searchWord: "",
  styleKeywords: "",
  styleKeywordsList: [],
  seasonTypes: "",
  colorType: "",
  patternType: "",
  necklineType: "",
  silhouetteType: "",
  sleeveType: "",
  lengthType: "",
  displayStatus: "",
  registrationType: "MANUAL",
  fitRequestStatus: "",
  inspectionStatus: "",
  verified: true,
  activated: true,
  createdBy: "",
  createdDate: "",
  lastModifiedBy: "",
  lastModifiedDate: "",
  brandId: null,
  categoryIds: []
}