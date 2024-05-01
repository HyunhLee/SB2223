import Axios from "axios";
import toast from "react-hot-toast";
import {encode} from "base-64";
import {cafeClientIdConfig} from "../config";


let retryTimes = 0;

const x = new Date();

const encoding = encode(`${cafeClientIdConfig.clientId}:${cafeClientIdConfig.clientSecretKey}`);

let mall = '';
if (typeof window !== 'undefined') {
    mall = localStorage.getItem('cafe24Domain');
}

const axiosCafe24Instance = Axios.create({
    baseURL: mall,
    timeout: 120000,
    headers: {
        // "Authorization": `Basic ${encoding}`,
        "X-Cafe24-Client-Id": 'HRXBryuiOZLtFsK7K6ttUB',
        "Content-Type": "application/x-www-form-urlencoded",
        "ZoneId": `${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        "TimeZone": `${Math.abs(x.getTimezoneOffset())}`
    },
});

axiosCafe24Instance.interceptors.request.use(
    config => {
        const cafe24AccessToken = window.localStorage.getItem('cafe24AccessToken');
        if (cafe24AccessToken != null) {
            // config.headers["Authorization"] = `Bearer ${cafe24AccessToken}`;
            config.headers["X-Cafe24-Client-Id"] = 'HRXBryuiOZLtFsK7K6ttUB';
            config.headers["Content-Type"] = 'application/json';
            config.headers["X-Cafe24-Api-Version"] = '2022-06-01';
        }
        return config;
    },
    err => {
        console.log('axiosCafe24Instance.interceptors.request.err ->', err);
        return Promise.reject(err);
    },
);

function OnRejected(err) {
    console.log('axiosCafe24Instance.interceptors.response.err', err);
    if (err.response) {
        if (err.response.status === 403 || err.response && err.response.status === 401) {
            // if (retryTimes == 5) {
            //     localStorage.removeItem('cafe24AccessToken');
            //     localStorage.removeItem('cafe24RefreshToken');
            //     window.location.href = "/";
            //     return Promise.reject(err);
            // }
            // // 만료된 토큰일 경우 다른 시도 없이 바로 accessToken 재발급 할 경우 아래 코드 사용
            // // return cafe24AuthApi.login()
            // return cafe24AuthApi.refresh(localStorage.getItem('cafe24RefreshToken')) // token 재발행 및 반환
            //     .then(token => {
            //         retryTimes += 1;
            //         localStorage.setItem('cafe24AccessToken', token.accessToken);
            //         localStorage.setItem('cafe24RefreshToken', token.refreshToken);
            //         return axiosCafe24Instance.request(err.config); // error.config(origin API 정보)를 다시 요청
            //     })
            //     .catch(error => {
            //         console.log('refresh ->', error);
            //         localStorage.removeItem('cafe24AccessToken');
            //         localStorage.removeItem('cafe24RefreshToken');
            //         window.location.href = "/";
            //     });
        } else if (err.response.status === 500) {
            toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
        } else {
            toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
        }
    }
    return Promise.reject(err);
}

function onFullfilled(response) {
    return response;
}

axiosCafe24Instance.interceptors.response.use(
    onFullfilled,
    OnRejected
);


export default axiosCafe24Instance;