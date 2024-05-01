import Axios from "axios";
import {endPointConfig} from "../config";
import {handsomeAuthApi} from "../handsome-api/auth-api";
import toast from "react-hot-toast";


let retryTimes = 0;

const axiosHandsomeInstance = Axios.create({
    baseURL: endPointConfig.styleBotHandsome,
    timeout: 120000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosHandsomeInstance.interceptors.request.use(
    config => {
        const handsomeAccessToken = window.localStorage.getItem('handsomeAccessToken');
        if(handsomeAccessToken == undefined) {
            // window.location.href = "/";
        } else if (handsomeAccessToken) {
        config.headers["accessToken"] = `${handsomeAccessToken}`;
        }
        return config;
    },
    err => {
        console.log(err)
        return Promise.reject(err);
    },
);
axiosHandsomeInstance.interceptors.response.use(
    config => {
        console.log('config : ', config)
        return config;
    },
    err => {
        console.log('axiosHandsomeInstance.interceptors.response.err', err.response);
        if(err.response) {
            if (err.response.status === 403
                || err.response.status === 401
            ) {
                console.log('hello')
                if (retryTimes == 5) {
                    localStorage.removeItem('handsomeAccessToken');
                    localStorage.removeItem('handsomeRefreshToken');
                    window.location.href = "/";
                    return Promise.reject(err);
                }

                //만료된 토큰일 경우 다른 로그인 없이 바로 한섬 accessToken을 재발급
                return handsomeAuthApi.login().then(
                    (token) => {
                        localStorage.setItem('handsomeAccessToken', token.accessToken);
                        localStorage.setItem('handsomeRefreshToken', token.refreshToken);
                        return axiosHandsomeInstance.request(err.config);
                    }
                ).catch(err => {
                    localStorage.removeItem('handsomeAccessToken');
                    localStorage.removeItem('handsomeRefreshToken');
                    window.location.href = "/";
                    console.log(err)
                });
            } else if (err.response.status === 500) {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            } else {
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }

        return Promise.reject(err);
    },
);


export default axiosHandsomeInstance;