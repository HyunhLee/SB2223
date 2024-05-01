import Axios from "axios";
import {endPointConfig} from "../config";
import {authApi} from "../api/auth-api";
import toast from "react-hot-toast";

let retryTimes = 0;

const x = new Date();

const axiosInstance = Axios.create({
    baseURL: endPointConfig.styleBot,
    timeout: 120000,
    headers: {
        "Content-Type": "application/json",
        "ZoneId": `${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        "TimeZone": `${Math.abs(x.getTimezoneOffset())}`
    },
});

axiosInstance.interceptors.request.use(
    config => {

        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
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
        if (err.response) {
            if (err.response.status === 403 || err.response && err.response.status === 401) {
                if (err.response.data.detail == '자격 증명에 실패하였습니다.') {
                    toast.error('아이디 또는 비밀번호가 일치하지 않습니다.')
                }
                if (retryTimes == 5) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = "/";
                    return Promise.reject(err);
                }
                return;
                // return authApi.refresh(localStorage.getItem('refreshToken')) // token 재발행 및 반환
                //     .then(token => {
                //         retryTimes += 1;
                //         localStorage.setItem('accessToken', token.accessToken);
                //         localStorage.setItem('refreshToken', token.refreshToken);
                //         return axiosInstance.request(err.config); // error.config(origin API 정보)를 다시 요청
                //     })
                //     .catch(error => {
                //         console.log(error);
                //         localStorage.removeItem('accessToken');
                //         localStorage.removeItem('refreshToken');
                //         // window.location.href = "/";
                //     });
            } else if (err.response.status >= 500) {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            } else if (err.response.data.title) {
                toast.error(`${err.response.data.title}`);
            } else {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }
        return Promise.reject(err);
    },
);


export default axiosInstance;