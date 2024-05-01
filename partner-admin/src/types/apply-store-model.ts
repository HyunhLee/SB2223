export interface ApplyStoreModel {
    count: number;
    lists: ApplyStoreModels[];
}

export interface ApplyStoreModels {
    id?: number;
    userId: string;
    password: string;
    passwordCheck: string;
    managerName: string;
    managerPhoneNumber: number;
    certificationNumber: string;
    companyRegistrationNumber: number;
    companyName: string;
    representativeName: string;
    business: Business[];
    companyAddress: string;
    companyDetailAddress: string;
    businessRegistration: File[];
    mailOrderBusinessCertificate: File[];
    businessRegistrationUrl: string;
    mailOrderBusinessCertificateUrl: string;
    companyUrl: string;
    brand: Brand[];
    agreePolicy: boolean;
    agreeTerm: boolean;
    agreeTenor: boolean;
    createdDate: string;
    applyStatus: string;
    serviceStatus: string;
}

export const defaultApply = () => {
    return {
        id: null,
        userId: "",
        password: "",
        passwordCheck: "",
        managerName: "",
        managerPhoneNumber: null,
        certificationNumber: "",
        companyRegistrationNumber: null,
        companyName: "",
        representativeName: "",
        business: [{
            businessStatus: "",
            businessEvent: ""
        }],
        companyAddress: "",
        companyDetailAddress: "",
        businessRegistration: [],
        mailOrderBusinessCertificate: [],
        businessRegistrationUrl: "",
        mailOrderBusinessCertificateUrl: "",
        companyUrl: "",
        brand: [{
            brandNameKo: "",
            brandNameEn: "",
            brandShopUrl: "",
            brandIntroduce: "",
            brandIntroduction: [],
            brandIntroductionUrl: ""
        }],
        agreePolicy: false,
        agreeTerm: false,
        agreeTenor: false,
        createdDate: "",
        applyStatus: "",
        serviceStatus: ""
    }
}

export interface Business {
    businessStatus: string;
    businessEvent: string;
}

export interface Brand {
    brandNameKo: string;
    brandNameEn: string;
    brandShopUrl: string;
    brandIntroduce: string;
    brandIntroduction: File[];
    brandIntroductionUrl: string;
}