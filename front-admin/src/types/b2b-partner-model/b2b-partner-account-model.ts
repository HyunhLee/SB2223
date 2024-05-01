export interface B2bPartnerAccountModels {
    count: number;
    lists: B2bPartnerAccountModel[];
}

export interface B2bPartnerAccountModel {
    mallId: number;
    id?: number;
    login: string;
    password: string;
    email: string;
    name: string;
    region: string;
    loginFlag: string;
}

export const defaultAccountModel = () => {
    return {
        mallId: null,
        id: null,
        login: "",
        password: "",
        email: "",
        name: "",
        region: "ko",
        loginFlag: "ADMIN"
    }
}