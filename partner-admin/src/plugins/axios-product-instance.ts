import Axios from "axios";
import {endPointConfig} from "../config";
import {authApi} from "../api/auth-api";
import toast from "react-hot-toast";

let retryTimes = 0;

const x = new Date();

const axiosProductInstance = Axios.create({
    baseURL: endPointConfig.styleBotProduct,
    timeout: 120000,
    headers: {
        "Content-Type": "application/json",
        "ZoneId": `${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
        "TimeZone": `${Math.abs(x.getTimezoneOffset())}`
    },
});

axiosProductInstance.interceptors.request.use(
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
axiosProductInstance.interceptors.response.use(
    config => {
        return config;
    },
    err => {
        console.log('axiosInstance.interceptors.response.err', err.response);
        if (err.response) {
            if (err.response.status === 403 || err.response && err.response.status === 401) {
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
                        return axiosProductInstance.request(err.config); // error.config(origin API 정보)를 다시 요청
                    })
                    .catch(error => {
                        console.log(error);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = "/";
                    });
            } else if (err.response.status >= 500) {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
                return ;
            } else if (err.response.status == 406) {
              let text = err.response.data.detail;
              let startIdx = text.indexOf("(");
              let endIdx = text.indexOf(")")+1;
              let word = text.substring(startIdx, endIdx);
              console.log(err.response.data.detail, text)
              toast.error(`현재 플랜에서 이용가능한 최대 개수를 초과하셨습니다. ${word} 등록되어있습니다.`);
              return;
            }else if (err.response.data.title) {
                toast.error(`${err.response.data.title}`);
                return;
            } else {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }
        return Promise.reject(err);
    },
);


export default axiosProductInstance;