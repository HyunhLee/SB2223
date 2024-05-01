import axiosPartnerInstance from "../plugins/axios-partner-instance";

class FaqApi {
    async getFaqList(search) {
        const params = {};

        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.id) {
            params['id'] = search.id;
        }
        if (search.question) {
            params['keyword'] = search.question;
        }
        if (search.faqType !== 'All' && search.faqType !=='-') {
            params['faqType'] = search.faqType;
        }

        return axiosPartnerInstance.get('/api/faq', {params}).then((res) => {
            const result = {
                count: res.data.length,
                lists: res.data
            }
            return result;
        })
    }

    async getFaq(id) {
        return axiosPartnerInstance.get(`/api/faq/${id}`).then((res) => {
            return res.data;
        }).catch((err) => {
            return err;
        })
    }
}

export const faqApi = new FaqApi();