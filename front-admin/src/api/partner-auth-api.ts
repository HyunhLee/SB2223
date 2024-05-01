import type {User} from '../types/user';
import {decode} from '../utils/jwt';
import {Token} from "../types/auth";
import axios from 'axios';
import axiosBtbInstance from "../plugins/axios-btb-instance";

class PartnerAuthApi {
    async partnerLogin({email, password}): Promise<Token> {
        const body = {
            username: email,
            password,
            rememberMe: true
        }
        return axiosBtbInstance.post('/api/authenticate', body).then(res => {
            return res.data
        }).catch(error => {
            console.log(error);
        });
    }

    async refresh(refreshToken): Promise<Token> {
        // refresh token 이라서 axios accessToken 문제로 axios 로 호출
        return axios.post(`/api/sign-in/token`, null, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
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

    me(accessToken): Promise<User> {
        return new Promise((resolve, reject) => {
            try {
                // Decode access token
                const {userId, auth} = decode(accessToken) as any;
                resolve({
                    id: userId,
                    auth: auth
                });
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

        return axiosBtbInstance.post(`/api/cafe24/oauth/token`, body).then(res => {
            const accessToken = res.data.access_token;
            const refreshToken = res.data.refresh_token;
            localStorage.setItem("cafe24AccessToken", accessToken);
            localStorage.setItem("cafe24RefreshToken", refreshToken);
            return res.data;

        }).catch(error => {
            console.log(error);
        });
    }
}

export const partnerAuthApi = new PartnerAuthApi();
