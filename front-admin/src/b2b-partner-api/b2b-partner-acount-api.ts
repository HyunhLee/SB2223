import axiosBtbInstance from "../plugins/axios-btb-instance";

class B2bPartnerAccountApi {
    async postPartnerAccount(data) {
        return axiosBtbInstance.post('api/user', {...data}).then(res => {
            return res.data;
        });
    }

    async getPartnerMall() {
        return axiosBtbInstance.get('api/malls').then(res => {
            return res.data;
        })
    }
}

export const b2bPartnerAccountApi = new B2bPartnerAccountApi();