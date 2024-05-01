import axiosPartnerInstance from "../plugins/axios-partner-instance";

class NoticeApi {
    async getNoticeList(search) {
        const params = {};

        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.title) {
            params['searchText'] = search.title;
        }
        if (search.startDate) {
            params['startDate'] = new Date(search.startDate.setHours(0, 0, 0, 0));
        }
        if (search.endDate) {
            params['endDate'] = new Date(search.endDate.setHours(23, 59, 59, 59));
        }

        return axiosPartnerInstance.get('/api/notice', {params}).then((res) => {
            const arr = [];
            res.data.topFixNotices.map((list) => {
                return arr.push(list)
            });
            res.data.commonNotices.map((list) => {
                return arr.push(list)
            });
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: arr
            }
            return result;
        }).catch((err) => {
            return err;
        })
    }

    async getNotice(id) {
        return axiosPartnerInstance.get(`/api/notice/${id}`).then((res) => {
            return res.data;
        })
    }
}

export const noticeApi = new NoticeApi();