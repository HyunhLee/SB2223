import axiosBtbInstance from "../plugins/axios-btb-instance";
import {B2bDefaultItem} from "../types/b2b-partner-model/b2b-default-item-model";

class B2bDefaultItemApi {
    async getDefaultItems(search): Promise<B2bDefaultItem> {
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
        if (search.maleCategoryIds) {
            params['categoryId.equals'] = search.maleCategoryIds;
        }
        if (search.nameKo) {
            params['nameKo.contains'] = search.nameKo;
        }
        if (search.id) {
            params['productId.equals'] = search.id;
        }
        if (search.colorName) {
            params['colorName.in'] = search.colorName.split(',');
        }
        if (search.patternName) {
            params['patternName.in'] = search.patternName.split(',');
        }
        if (search.brandList) {
            params['brandList.in'] = search.brandList;
        }
        if (search.seasonTypes) {
            params['seasonTypes.contains'] = search.seasonTypes;
        }
        if (search.styleKeywords) {
            params['styleKeyword.contains'] = search.styleKeywords;
        }
        if (search.productType) {
            params['productType.equals'] = search.productType;
        }
        if (search.gender) {
            params['gender.equals'] = search.gender;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0, 0));
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59, 59));
        }

        return axiosBtbInstance.get('api/product-colors', {params}).then((res) => {
            const result: B2bDefaultItem = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        }).catch(err => {
            return err;
        })
    }

    async getDefaultStat(gender) {
        const params = {};

        if(gender) {
            params['gender'] = gender;
        }

        return axiosBtbInstance.get('api/product-colors/stat', {params}).then((res) => {
            return res.data;
        }).catch(err => {
            return err;
        })
    }

    async deleteDefaultItems(data): Promise<void> {
        return axiosBtbInstance.patch('api/product-colors/default/deactivate/ids', data).then((res) => {
            return res.data;
        })
    }

    async addBtbDefaultItems(data) {
        return axiosBtbInstance.post(`/api/defaultProducts`, data).then((res) => {
            return res.status
        }).catch((err) => {
            console.log(err)
        })
    }

    async getBtbDefaultItemsDetailData(productId){
        return axiosBtbInstance.get(`/api/products/${productId}`).then((res) => {
            return res.data
        }).catch((err) => {
            console.log(err)
        })
    }

    async putBtbDefaultItems(data){
        console.log(data, 'save 수정')
        return axiosBtbInstance.put(`/api/defaultProducts/${data.id}`,data).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }
}


export const b2bDefaultItemApi = new B2bDefaultItemApi();