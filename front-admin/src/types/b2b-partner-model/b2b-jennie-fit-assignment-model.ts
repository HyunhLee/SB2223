export interface BtbJennieFitAssignments {
    count: number;
    lists: BtbAssignmentModel[];
}

export interface Search {
    id: number,
    size: number,
    page: number,
    categoryName: string,
    categoryIds: string
    maleCategoryName: string,
    maleCategoryIds: string
    productId: string,
    startDate: string,
    endDate: string,
    productName: string,
    registrationType: string,
    workerId: number,
    workerName: string,
    priorityType: string,
    jennieFitAssignmentStatus: string,
    assignmentMultiStatus : string[]
    brandId: number,
    brandName: string,

}

export interface BtbAssignmentModel {
    id: number,
    jennieFitAssignmentStatus: string,
    priorityType: string,
    workerId: number,
    workerName: string,
    workStartDay: string,
    createdBy: string,
    createdDate: string,
    lastModifiedBy: string,
    product: AssignProductModel
}

export interface AssignProductModel {
    id: number,
    type: string,
    nameKo: string,
    nameEn: string,
    productNo: number,
    productCode: string,
    detailSiteUrl: string,
    thumbnailImageUrl: string,
    putOnImageUrl: string,
    fitRefImageUrl: string,
    putOnPreviewImageUrl: string,
    requestStatus: string,
    registrationType: string,
    verified: boolean,
    activated: boolean,
    isJennieFitRequested: boolean,
    createdBy: string,
    createdDate: string,
    lastModifiedBy: string,
    lastModifiedDate: string,
    brandId: number,
    categoryIds: number[],
    jenniefitCategoryId: number,
    jenniefitCategory: string,
    statusHistories: string
    mallGender: string
    mallId: number
    mallName: string
}

export interface AssignModel {
    priorityType: string
    ids: number[]
    status: string
    workStartDay: Date
    workerId: number
    workerName: string
}

export interface ReAssignModel {
    priorityType: string
    ids: number[]
    workStartDay: Date
    workerId: number
    workerName: string
}


export const defaultSearch = () => {
    return {
        size: 40,
        page: 0,
        id: null,
        categoryName: '',
        categoryIds: '',
        maleCategoryName: '',
        maleCategoryIds: '',
        productId: '',
        createDate: '',
        productName: '',
        startDate:  null,
        endDate:  null,
        registrationType: '',
        workerId: null,
        workerName:'',
        priorityType: '',
        jennieFitAssignmentStatus: '',
        assignmentMultiStatus: ['Requested', 'Assigned', 'Rejected'],
        brandId: null,
        brandName: '',

    }
}

export const defaultInspectionSearch = () => {
    return(
      {
          size: 40,
          page: 0,
          id: null,
          categoryName: '',
          categoryIds: '',
          maleCategoryName: '',
          maleCategoryIds: '',
          productId: '',
          createDate: '',
          productName: '',
          startDate:  null,
          endDate:  null,
          registrationType: '',
          workerId: null,
          workerName:'',
          priorityType: '',
          jennieFitAssignmentStatus: 'Requested',
          assignmentMultiStatus: [''],
          brandId: null,
          brandName: '',

      }
    )
}

export const defaultAssign = () => {
    return {
        priorityType: '',
        ids: [],
        status: 'ASSIGNED',
        workStartDay: null,
        workerId: null,
        workerName: ''
    }
}

export const defaultReAssign = () => {
    return {
        priorityType: '',
        ids: [],
        workStartDay: null,
        workerId: null,
        workerName: ''
    }
}

