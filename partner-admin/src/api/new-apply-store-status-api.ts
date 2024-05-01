import axiosInstance from "../plugins/axios-instance";
import {ApplyStoreModel, ApplyStoreModels} from "../types/apply-store-model";

class NewApplyStoreStatusApi {
    async getStatusList(search): Promise<any> {
        const params = {
            size: search.size,
            page: search.page
        };

        if (search.id) {
            params['id'] = search.id;
        }
        if (search.status) {
            params['status'] = search.status;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate);
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate);
        }
        if (search.companyName) {
            params['companyName'] = search.companyName;
        }

        return axiosInstance.get('sadfawd/wefasd/aewfdsf', {params}
        ).then(res => {
            const result: ApplyStoreModel = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        }).catch(err => {
            console.log(err);
        })
    }

    async getStatus(id): Promise<ApplyStoreModels> {
        return axiosInstance.get(`/services/product/api/products/${id}`).then(res => {
            return res.data;
        });
    }

    async postReject(id, data) {
        return axiosInstance.post(`/sadf/weqfasdfe/wfsafa/ssd/${id}`, data
        ).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    async patchApplyStatus(id, data) {
        return axiosInstance.patch(`/asdf/asdf/wefw/${id}/${data}`
        ).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }
}

export const newApplyStoreStatusApi = new NewApplyStoreStatusApi();