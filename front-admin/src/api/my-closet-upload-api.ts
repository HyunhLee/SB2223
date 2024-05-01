import {MyClosetUpload, MyClosetUploadModel} from "../types/my-closet-upload-model";
import axiosInstance from "../plugins/axios-instance";

class MyClosetUploadApi {
    async getMyClosetUploads(search): Promise<MyClosetUpload> {
        const params = {
            size: search.size,
            page: search.page,
        }

        if (search.categoryId) {
            params['categoryId.equals'] = search.categoryId;
        }
        if (search.colorType) {
            params['colorType.equals'] = search.colorType;
        }
        if (search.patternType) {
            params['patternType.equals'] = search.patternType;
        }
        if (search.brandName) {
            params['brandName.equals'] = search.brandName;
        }
        if (search.registrationType) {
            params['registrationType.equals'] = search.registrationType;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
        }
        if (search.seasonTypes) {
            params['seasonTypes.contains'] = search.seasonTypes;
        }
        if (search.id) {
            params['id.equals'] = search.id;
        }

        return axiosInstance.get(`/services/product/api/products`, {params}).then(res => {
            const result: MyClosetUpload = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }

    async getEmail() {
        return axiosInstance.get(`/api/account/authority/manual`).then(res => {
            return res.data;
        });
    }

    async postMyClosetUpload(data: MyClosetUpload): Promise<MyClosetUpload> {
        return axiosInstance.post(`/services/product/api/products`, data, {headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            return res.data;
        });
    }
}

export const myClosetUploadApi = new MyClosetUploadApi();
