import {ApplyStoreModel, ApplyStoreModels} from "../types/apply-store-model";
import axiosInstance from "../plugins/axios-instance";

class PartnerStoreStatusApi {
    async getPartnerStores(search): Promise<any> {
        const params = {
            size: search.size,
            page: search.page
        };

        if (search.id) {
            params['id'] = search.id;
        }
        if (search.companyName) {
            params['companyName'] = search.companyName;
        }
        if (search.serviceStatus) {
            params['serviceStatus'] = search.serviceStatus;
        }
        if (search.brandMap) {
            params['brandMap'] = search.brandMap;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate);
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate);
        }

        return axiosInstance.get('/sadfe/fasef/asdf/wef', {params}
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

    async getPartnerStore(id): Promise<ApplyStoreModels> {
        return axiosInstance.get(`/sadfe/fasef/asdf/wef/${id}`).then(res => {
            return res.data;
        });
    }

    async postBrand(id, data) {
        return axiosInstance.post(`/sdaf/asfew/wefasd/${id}`, data
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }
}

export const partnerStoreStatusApi = new PartnerStoreStatusApi();