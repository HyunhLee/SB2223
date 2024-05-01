import {Products} from "../types/btb-product-model";
import axiosProductInstance from "../plugins/axios-product-instance";
import {ProductColorModel} from "../types/btb-product-color-model";

class BtbProductApi {
    async getProduct(search): Promise<Products> {
        const params = {};

        if (search.sort) {
            params['sort'] = search.sort;
        }
        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.activated) {
            params['activated.equals'] = search.activated;
        }
        if (search.categoryId) {
            params['categoryId.equals'] = search.categoryId;
        }
        if (search.nameKo) {
            params['nameKo.contains'] = search.nameKo;
        }
        if (search.brandId) {
            params['brandId.equals'] = search.brandId;
        }
        if (search.id) {
            params['productId.equals'] = search.id;
        }
        if (search.isSoldOut) {
            params['isSoldOut.equals'] = search.isSoldOut;
        }
        if (search.jennieFitRequestType) {
            params['fitRequestType.equals'] = search.jennieFitRequestType;
        }
        if (search.displayStatus) {
            params['displayStatus.equals'] = search.displayStatus;
        }
        if (search.requestStatus) {
            params['fitRequestStatus.equals'] = search.requestStatus;
        }
        if (search.registrationType) {
            params['registrationType.equals'] = search.registrationType;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0, 0));
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59, 59));
        }
        if (localStorage.getItem('mallId')) {
            params['mallId.equals'] = localStorage.getItem('mallId');
        }

        return axiosProductInstance.get('api/product-colors', {params}).then((res) => {
            const result: Products = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        }).catch(err => {
            return err;
        })
    }

    async getOneProduct(id): Promise<ProductColorModel> {
        return axiosProductInstance.get(`api/products/${id}`
        ).then(res => {
            return res.data;
        }).catch(err => {
            return err;
        })
    }

    async postProduct(data: ProductColorModel) {
        return axiosProductInstance.post(`api/products`, data).then(res => {
            return res;
        });
    }

    async putProduct(data: ProductColorModel): Promise<ProductColorModel> {
        return axiosProductInstance.put(`api/products/${data.id}`, data).then(res => {
            return res.data;
        });
    }

    async patchProductStatus(data) {
        return axiosProductInstance.patch(`/api/products`, data).then(res => {
            console.log(res,'res')
            return res.status
        })
    }

    async patchProductSoldOutStatusAndDelete(data){
        return axiosProductInstance.patch(`api/product-colors`, data).then((res) => {
            return res.status
        })
    }

    async getTheReason(id, productId){
        return axiosProductInstance.get(`/api/jennie-fit-assignments/recentHistory/${productId}/${id}`).then((res) => {
            return res.data;
        })
    }
}

export const b2bProductApi = new BtbProductApi();