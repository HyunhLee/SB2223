import axiosBtbInstance from "../plugins/axios-btb-instance";

class FaqApi {
    async getFaqList(search) {
        const params = {};

        if(search.page) {
            params['page'] = search.page;
        }
        if(search.size) {
            params['size'] = search.size;
        }
        if(search.id) {
            params['id'] = search.id;
        }
        if(search.question) {
            params['keyword'] = search.question;
        }
        if(search.faqType) {
            params['faqType'] = search.faqType;
        }

        return axiosBtbInstance.get('/api/faq', {params}).then((res) => {
            const result = {
                count: res.data.length,
                lists: res.data
            }
            return result;
        })
    }

    async getFaq(id) {
        return axiosBtbInstance.get(`/api/faq/${id}`).then((res) => {
            return res.data;
        }).catch((err) => {
            return err;
        })
    }

    async postFaq(data) {
        return axiosBtbInstance.post('/api/faq', {...data}).then((res) => {
            return res;
        })
    }

    async putFaq(id, data) {
        return axiosBtbInstance.put(`/api/faq/${id}`, {...data}).then((res) => {
            return res;
        })
    }

    async deleteFaq(id, data) {
        return axiosBtbInstance.patch(`/api/faq/${id}`, {...data}).then((res) => {
            return res;
        })
    }
}

export const faqApi = new FaqApi();