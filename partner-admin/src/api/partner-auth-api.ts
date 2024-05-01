import type {User} from '../types/user';
import {sign, decode, JWT_SECRET, JWT_EXPIRES_IN} from '../utils/jwt';
import {Token} from "../types/auth";
import axios from 'axios';
import axiosPartnerInstance from "../plugins/axios-partner-instance";
class PartnerAuthApi {
    async partnerLogin({email, password}): Promise<Token> {
        const body = {
            username: email,
            password,
            rememberMe: true
        }
        return axiosPartnerInstance.post('/api/authenticate', body).then(res => {
            return res.data
        }).catch(error => {
            console.log(error);
        });
    }

    async register({email, name, password}): Promise<string> {
        return new Promise((resolve, reject) => {
            try {

                resolve(null);
            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }


    async login({
                    code,
                    mallId
                }): Promise<Token> {
        const body = {
            mallId: mallId,
            code: code
        }
        return axiosPartnerInstance.post(`/api/cafe24/oauth/token`, body).then(res => {
            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken;
            localStorage.setItem("cafe24AccessToken", accessToken);
            localStorage.setItem("cafe24RefreshToken", refreshToken);

            return res.data;

        }).catch(error => {
            console.log(error);
        });
    }
}

export const partnerAuthApi = new PartnerAuthApi();
