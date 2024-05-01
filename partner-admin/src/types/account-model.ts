export interface AccountDetail {
    userId: number;
    userLoginId: string;
    mallName: string;
    email: string;
    mobile: string;
    userName: string;
    role: string;
    password: string;
}

export interface BrandDetail {
    id: number
    nameKo: string
    nameEn: string
    companyUrl: string
    supervisor?: string
    supervisorNum?: string
    csNum?: string
    startTime?: number
    endTime?: number
    offStartTime?: number
    offEndTime?: number
    breakTime?: boolean
    offDay?: string[]
    holiday : boolean
    off: boolean
    csManager?: string
    csManagerNum?: string
}

export interface BrandBusinessDetail {
    id: number,
    companyCode: string,
    company: string,
    representName: string,
    companyType: string,
    address: string,
    companyCodeDocs: string,
    businessCodeDocs: string,
    companyUrl: string,
}


export interface PlanDetailModel{
    b2bServicePlanType: string;
    brands : brandInfo[],
    id: number,
    planEndDate: Date,
    planeStartDate: Date,
    name: string,
    platform: string,
    styleKeywords: string,
    jennifitCnt: number,
    jennifitUsedCnt: number,
    jennifitCntFirstmonth: number,
}

export interface brandInfo {
    id: number;
    name: string;
    nameEn: string;
    nameKo: string;
}

export const defaultAccountDetail = {
    id: "adc@mail.com",
    email: "adc@mail.com",
    company: "한신은행",
    name: "김한신",
    role: "대리",
    mobile: "010-9999-9999",
    password: "1******"
}

export const defaultBrandDetail = {
    id: 1,
    companyUrl: 'www.naver.comdfsdfsdfsdfsdf',
    nameEn: 'ADIDAS',
    nameKo: '아디다스',
    supervisor: '',
    supervisorNum: '',
    csNum: '',
    startTime: null,
    endTime: null,
    offStartTime: null,
    offEndTime: null,
    breakTime: false,
    offDay: [],
    holiday : false,
    off: false,
    csManager: '',
    csManagerNum: '',
}

export const defaultBusinessDetail = {
    id: 1,
    companyCode: "00000000000",
    company: "아디다스",
    representName: "나야나",
    companyType: "소매업",
    address: '서울특별시 어쩌고 저쩌고',
    companyCodeDocs: 'http://www.cu.ac.kr/data/bbsData/2021060809175760beb735e80da',
    businessCodeDocs: 'http://www.cu.ac.kr/data/bbsData/2021060809175760beb735e80da',
    companyUrl: 'www.naver.comdfsdfsdfsdfsdf',
}