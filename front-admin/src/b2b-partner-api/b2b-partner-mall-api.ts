import axiosBtbInstance from "../plugins/axios-btb-instance";
import {B2bPartnerMallDetailModel} from "../types/b2b-partner-model/b2b-partner-mall-model";
import {renderBrandKeyword} from "../contexts/data-context";

class B2bPartnerMallApi {
    async getMallList(search) {
        const params = {
            size: search.size,
            page: search.page,
        };

        if(search.id) {
            params['id'] = search.id;
        }
        if(search.companyName) {
            params['mallName'] = search.companyName;
        }
        if(search.brandName) {
            params['brandName'] = search.brandName;
        }
        if(search.planType) {
            params['planType'] = search.planType == 'ALL' ? '' : search.planType;
        }
        if(search.planActivate) {
            params['planStatus'] = search.planActivate == 'ALL' ? '' : search.planActivate;
        }
        if(search.startDate) {
            params['startDate'] = search.startDate;
        }
        if(search.endDate) {
            params['endDate'] = search.endDate;
        }

        return axiosBtbInstance.get('/api/malls', {params}).then((res) => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        })
    }

    async getMallDetail(id): Promise<B2bPartnerMallDetailModel> {
        const params = {};

        if(id) {
            params['mallId'] = id;
        }
        
        return axiosBtbInstance.get(`/api/mall`, {params}).then((res) => {
            let dt = res.data;
            if(dt.styleKeywords) {
                dt.styleKeywordsList = res.data.styleKeywords.split(",").map((word) => renderBrandKeyword(word));
            }
            return dt;
        }).catch((err) => {
            return err;
        });
    }

    async postPartnerMall(data) {
        return axiosBtbInstance.post('api/mall', {...data}).then(res => {
            return res.data;
        });
    }

    async putPartnerMall(id, data) {
        return axiosBtbInstance.put(`api/mall/${id}`, {...data}).then(res => {
            return res.data;
        });
    }

    async getB2bMalls(gender): Promise<any> {
        const params = {};

        if(gender) {
            params['gender'] = gender;
        }

        return axiosBtbInstance.get('/api/brands', {params}).then((res) => {
            return res.data;
        })
    }
}

export const b2bPartnerMallApi = new B2bPartnerMallApi();