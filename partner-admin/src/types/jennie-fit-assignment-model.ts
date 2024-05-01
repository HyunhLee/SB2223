export interface JennieFitAssignments {
  count: number;
  lists: JennieFitAssignmentModel[];
}

export interface JennieFitAssignmentModel {
  id?: number;
  status: string;
  priorityType: string;
  workerId: number;
  workerName: string;
  productId?: number;
  productName?: string;
  mainImageUrl: string;
  categoryIds?: number[];
  brandName: string;
  workStartDay: string;
  workEndDay: string;
  categoryId?: string;
  categoryConcat?: string;
  maskless?: boolean;
  userDressId?: number
  label?: string
  originalImageUrl?: string
  maskImageUrl?:string
  maskLayeredImageUrl?: string
  putOnPreviewImageUrl?: string
  warpImageUrl?: string
  warpMaskImageUrl?: string
  putOnImageUrl?: string
  inspectionStatus: string
  imageUrlList?: ImageList[]
  ghostImageUrl?: string
  fitRefImageUrl?: string
  detailSiteUrl?:string
  registrationType?:string
  silhouetteType?: string
  sleeveType?: string
  lengthType?: string
  productCreatedDate?: string;
  userDressCreatedDate?: string;
}

export interface JennieFitAssigmentUserDressModel {
  id: number,
  userDress: UserDress,
  statusHistories: StatusHistory[]
}

export interface ImageList {
  imageUrl: string,
  listOrder: number
}

export interface UserDress {
  id: number
  label: string
  brandName: string
  originalImageUrl: string
  mainImageUrl: string
  putOnImageUrl: string
  maskImageUrl: string
  seasonTypes: string
  colorType: string
  patternType: string
  necklineType: string
  silhouetteType: string
  sleeveType: string
  lengthType: string
  inspectionStatus: string
  fitRequestStatus: string
  registrationType: string
  verified: boolean
  categoryId: number
  categoryConcat: string
  description: string
}

export interface StatusHistory {
  id: number
  changeMessage?: string
  beforeStatus: string
  afterStatus: string
  createdDate: string
}

export interface JennieFitStatus {
  countCompleted: number
  countNormal: number
  countRejected: number
  countUrgency: number
  workerId: number
  workerName: string
}
