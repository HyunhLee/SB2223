export interface UserDresses {
  count: number;
  lists: UserDressModel[];
}

export interface UserDressModel {
  id?: number
  categoryId: number
  categoryConcat: number
  originalImageUrl: string
  colorType: string
  patternType: string
  verified: boolean
  activated: boolean
  description: string
  inspectionStatus: string
  registrationType: string
  createdDate: string
  modifyActionColor?: string
}

export interface UserDressAssignments {
  count: number;
  lists: UserDressAssignmentModel[];
}


export interface UserDressAssignmentModel {
  id: number
  originalImageUrl: string
  categoryId: number
  categoryConcat: any
  inspectionStatus: string
  registrationType: string
  createdDate: string
  silhouetteType: string
  sleeveType: string
  lengthType: string
}
