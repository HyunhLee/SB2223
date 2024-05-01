export interface User {
    count: number;
    lists: UserModel[];
}

export interface UserModel {
    id: number;
    member_id: string;
    name: string;
    cellphone: string;
    email: string;
    gender: string;
    created_date: string;
}

export interface SearchUser {
    id: number;
    mallId: number;
    userId: string;
    startDate: string;
    endDate: string;
    page: number;
    size: number;
}

export const defaultSearchUser = () => {
    return {
        id: null,
        mallId: Number(localStorage.getItem('mallId')),
        userId: '',
        startDate: null,
        endDate: null,
        page: null,
        size: null
    }
}