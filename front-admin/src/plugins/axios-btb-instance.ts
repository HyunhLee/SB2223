import Axios from "axios";
import {endPointConfig} from "../config";
import toast from "react-hot-toast";


let retryTimes = 0;

const axiosBtbInstance = Axios.create({
    baseURL: endPointConfig.styleBotBtb,
    timeout: 120000,
    headers: {
        "Content-Type" : "application/json",
    }
})

axiosBtbInstance.interceptors.request.use(
    config => {
        const accessToken = window.localStorage.getItem('partnerAccessToken');
        if(config.url == '/api/authenticate') {
            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
        } else {
            if(accessToken == undefined && accessToken != null) {
                localStorage.removeItem('partnerAccessToken');
                localStorage.removeItem('partnerRefreshToken');
                window.location.href = "/";
            } else if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
err => {
    return Promise.reject(err);
    }
);


axiosBtbInstance.interceptors.response.use(
    config => {
        return config;
    },
    err => {
        if(err.response) {
            if (err.response.status === 403 || err.response.status === 401) {
                if(localStorage.getItem('partnerAccessToken')) {
                    localStorage.removeItem('partnerAccessToken');
                    localStorage.removeItem('partnerRefreshToken');
                }
                window.location.href = "/";
                return Promise.reject(err);
            } else if (err.response.status === 500) {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            } else {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }
        return Promise.reject(err);
    },
);


export default axiosBtbInstance;