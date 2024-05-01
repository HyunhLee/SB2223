import Axios from "axios";
import {endPointConfig} from "../config";
import {authApi} from "../api/auth-api";
import toast from "react-hot-toast";

let retryTimes = 0;

const axiosInstance = Axios.create({
    baseURL: endPointConfig.styleBot,
    timeout: 120000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    config => {

        const accessToken = window.localStorage.getItem('accessToken');
        if(config.url == '/api/sign-in/email') {
            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
                //config.headers["Authorization"] = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTY0MzM2MjMyMywidXNlcklkIjoiMiJ9.3Jtjv3BCKq3cza80DM29-f7N9IuotuFvrSqawUQj33gtpSsig-Dyaw4MTlyxMBlQvAPvwqTSzcIMLkrJaq9cng`;
            }
        } else {
            if(accessToken === 'undefined' && accessToken != null) {
              console.log(accessToken, 'undefined 문자로 바꾼거 - ###')
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('handsomeAccessToken');
              localStorage.removeItem('handsomeRefreshToken');
              localStorage.removeItem('partnerAccessToken');
              localStorage.removeItem('partnerRefreshToken');
                window.location.href = "/";
            } else if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
                //config.headers["Authorization"] = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTY0MzM2MjMyMywidXNlcklkIjoiMiJ9.3Jtjv3BCKq3cza80DM29-f7N9IuotuFvrSqawUQj33gtpSsig-Dyaw4MTlyxMBlQvAPvwqTSzcIMLkrJaq9cng`;
            }else{
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('handsomeAccessToken');
              localStorage.removeItem('handsomeRefreshToken');
              localStorage.removeItem('partnerAccessToken');
              localStorage.removeItem('partnerRefreshToken');
              window.location.href = "/";
            }
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    },
);
axiosInstance.interceptors.response.use(
    config => {
        return config;
    },
    err => {
        console.log('axiosInstance.interceptors.response.err', err.response);
        console.log('retryTimes###########', retryTimes);
        if(err.response) {
            if (err.response.status === 403 || err.response.status === 401) {
                if (retryTimes == 5) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = "/";
                    return Promise.reject(err);
                }
                return authApi.refresh(localStorage.getItem('refreshToken')) // token 재발행 및 반환
                    .then(token => {
                        retryTimes += 1;
                        localStorage.setItem('accessToken', token.accessToken);
                        localStorage.setItem('refreshToken', token.refreshToken);
                        return axiosInstance.request(err.config); // error.config(origin API 정보)를 다시 요청
                    })
                    .catch(error => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = "/";
                    });
            } else if (err.response.status === 500) {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            } else if(err.response.status !== 400){
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }
        return Promise.reject(err);
    },
);


export default axiosInstance;