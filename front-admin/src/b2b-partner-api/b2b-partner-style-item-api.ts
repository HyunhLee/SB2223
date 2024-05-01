import axiosBtbInstance from "../plugins/axios-btb-instance";
import {B2bDefaultItem} from "../types/b2b-partner-model/b2b-default-item-model";

class B2bPartnerStyleItemApi {
    async getStyleItems(search): Promise<B2bDefaultItem> {
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
        if (search.colorTypes) {
            params['colorName.in'] = search.colorTypes.split(',');
        }
        if (search.patternName) {
            params['patternName.equals'] = search.patternName;
        }
        if (search.brandId) {
            params['brandId.in'] = search.brandId;
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

        return axiosBtbInstance.get('api/product-colors/brand', {params}).then((res) => {
            const result: B2bDefaultItem = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        }).catch(err => {
            return err;
        })
    }
}

export const b2bPartnerStyleItemApi = new B2bPartnerStyleItemApi();