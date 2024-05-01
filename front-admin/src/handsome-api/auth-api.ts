import type { User } from '../types/user';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';
import {Token} from "../types/auth";
import axiosHandsomeInstance from "../plugins/axios-handsome-instance";
import {partnerAuthApi} from "../api/partner-auth-api";

class AuthApi {
  async login (): Promise<Token> {
    return axiosHandsomeInstance.get(`/api/auth/admin/generateToken`).then(res => {
      return res.data.data
    }).catch(error => {
      console.log(error);
    });
  }

  // async refresh(refreshToken): Promise<Token> {
  //   // refresh token 이라서 axios accessToken 문제로 axis 로 호출
  //   return axios.post(`/api/sign-in/token`, null, {
  //     // headers: {
  //     //   'accessToken': `Bearer ${refreshToken}`,
  //     //   'Content-Type': 'application/json',
  //     // }
  //   }).then(res => {
  //     return res.data
  //   }).catch(error => {
  //   });
  // }

  async register({ email, name, password }): Promise<string> {
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
        const { userId, auth} = decode(accessToken) as any;
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
}

export const handsomeAuthApi = new AuthApi();
