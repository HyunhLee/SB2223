import { Inquiries, InquiryModel } from "../types/inquiry";
import axiosInstance from "../plugins/axios-instance";

class InquiryApi {
    async getInquiries(search): Promise<Inquiries> {
        const params = {
            size: search.size,
            page: search.page,
        }

        if (search.id) {
            params['id.equals'] = search.id;
        }
        if (search.userId) {
            params['userId.equals'] = search.userId;
        }
        if (search.userName) {
            params['userName.equals'] = search.userName;
        }
        if (search.type) {
            params['type.equals'] = search.type;
        }
        if (search.answer) {
            params['answer.equals'] = search.answer;
        }
        if (search.contents) {
            params['contents.contains'] = search.contents;
        }
        if (search.status) {
            params['status.equals'] = search.status;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
        }



        return axiosInstance.get(`/services/member/api/inquiries`, {params}).then(res => {
            const result: Inquiries = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }
    async getInquiry(id): Promise<InquiryModel> {
        return axiosInstance.get(`/services/member/api/inquiries/${id}`).then(res => {
            return res.data;
        });
    }

    async postInquiry(data: InquiryModel): Promise<InquiryModel> {
        return axiosInstance.post(`/services/member/api/inquiries`, data,
        ).then(res => {
            return res.data;
        });
    }

    async putInquiry(data: InquiryModel): Promise<InquiryModel> {
        return axiosInstance.put(`/services/member/api/inquiries/${data.id}`, data).then(res => {
            return res.data;
        });
    }

    async patchInquiry(id, body): Promise<void> {
        return axiosInstance.patch(`/services/member/api/inquiries/${id}`, body, {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                }
            }
        ).then(res => {
            console.log(res);
        });
    }

    async deleteInquiry(id, body): Promise<void> {
        return axiosInstance.delete(`/services/member/api/inquiries/${id}`, body
        ).then(res => {
            console.log(res);
        });
    }
}

export const inquiryApi = new InquiryApi();