import { Faqs, FaqModel } from "../types/faq";
import axiosInstance from "../plugins/axios-instance";

class FaqApi {
    async getFaqs(search): Promise<Faqs> {
        const params = {
            size: search.size,
            page: search.page,
        }

        if (search.id) {
            params['id.equals'] = search.id;
        }
        if (search.category) {
            params['category.equals'] = search.category;
        }
        if (search.answer) {
            params['answer.equals'] = search.answer;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = search.startDate;
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = search.endDate;
        }



        return axiosInstance.get(`/services/member/api/faqs`, {params}).then(res => {
            const result: Faqs = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }
    async getFaq(id): Promise<FaqModel> {
        return axiosInstance.get(`/services/member/api/faqs/${id}`).then(res => {
            return res.data;
        });
    }

    async postFaq(data: FaqModel): Promise<FaqModel> {
        return axiosInstance.post(`/services/member/api/faqs`, data, {headers: { "Content-Type": "application/json" }
        }).then(res => {
            return res.data;
        });
    }

    async putFaq(data: FaqModel): Promise<FaqModel> {
        return axiosInstance.put(`/services/member/api/faqs/${data.id}`, data).then(res => {
            return res.data;
        });
    }

    async deleteFaq(id, body): Promise<void> {
        return axiosInstance.patch(`/services/member/api/faqs/${id}`, body
        ).then(res => {
            console.log(res);
        });
    }
}

export const faqApi = new FaqApi();