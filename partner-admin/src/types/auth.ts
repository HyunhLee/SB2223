export interface Token {
    accessToken: string;
    refreshToken: string;
    dDay?: number;
    expired?: boolean;
    planStartDate?: string;
    planEndDate?: string;
}
