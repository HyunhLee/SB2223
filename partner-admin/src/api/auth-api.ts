import type { User } from '../types/user';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';
import {Token} from "../types/auth";
import axiosInstance from "../plugins/axios-instance";
import axios from 'axios';

class AuthApi {
  async login({email, password}): Promise<Token> {
    const body = {
      username: email,
      password,
    }
    return axiosInstance.post(`/api/sign-in/email`, body).then(res => {
      return res.data
    }).catch(error => {
      console.log(error);
    });
  }

  async refresh(refreshToken): Promise<Token> {
    // refresh token 이라서 axios accessToken 문제로 axis 로 호출
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

  async register({ email, name, password }): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        /*let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error('User already exists'));
          return;
        }

        user = {
          id: createResourceId(),
          avatar: null,
          email,
          name,
          password,
          plan: 'Standard'
        };

        users.push(user);*/

        /*const accessToken = sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );*/

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
        const {userId, auth, mallId, mallName, mallGender, mallAccessToken} = decode(accessToken) as any;
        resolve({
          id: userId,
          auth: auth,
          mallId: mallId,
          mallName: mallName,
          mallGender: mallGender,
          mallAccessToken : mallAccessToken,
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
