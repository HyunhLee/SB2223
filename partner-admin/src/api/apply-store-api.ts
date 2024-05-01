import axiosInstance from "../plugins/axios-instance";
import {ApplyStoreModels} from "../types/apply-store-model";

class ApplyStoreApi {
    async postStoreInfo(data: ApplyStoreModels): Promise<ApplyStoreModels> {
        return axiosInstance.post('asdkjfuwehfusdfjklsdf/asdf/wefsaeedfsd/f', data
        ).then(res => {
            return res.data;
        });
    }

    async postIdOverlapCheck(data: string): Promise<any> {
        return axiosInstance.post('asdf/adsf/sdfwewec/sdf', data
        ).then(res => {
            return res;
        });
    }

    async postPhoneNumberCertification(data: number): Promise<any> {
        return axiosInstance.post('wer/dsfasdf/wef', data
        ).then(res => {
            return res;
        });
    }

    async getDeniedReason(search): Promise<string> {
        const params = {};

        if (search.userId) {
            params['userId'] = search.userId;
        }

        return axiosInstance.get('asdf/asdf/wfe', {params}
        ).then(res => {
            return res.data;
        }).catch(err => {
            console.log(err);
        })
    }
}

export const applyStoreApi = new ApplyStoreApi();