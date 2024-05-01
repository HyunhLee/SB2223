import {KeywordItemModel, PopularSearchWords, PopularSearchWordsModel} from "../types/popular-search-words";
import axiosInstance from "../plugins/axios-instance";
import {PKeywordGroupModel} from "../types/popular-keywords";

class PopularSearchWordsApi {
    async getPopularSearchWords(search): Promise<PopularSearchWords> {
        const params = {
            size: search.size,
            page: search.page,
            sort: ['startDate,desc', 'keywordItems.listOrder,desc']
        }

        if (search.id) {
            params['id.equals'] = search.id;
        }
        if (search.description) {
            params['description.contains'] = search.description;
        }
        if (search.activated) {
            params['activated.equals'] = search.activated;
        }
        if (search.displayStatus) {
            params['displayStatus'] = search.displayStatus;
        }
        if (search.keywordItems) {
            params['keywordItems.in'] = search.keywordItems;
        }
        if (search.keywordItemKeyword) {
            params['keywordItemKeyword.contains'] = search.keywordItemKeyword;
        }
        if (search.startDate) {
            params['startDate.greaterThanOrEqual'] = new Date(search.startDate);
        }
        if (search.expireDate) {
            params['expireDate.lessThanOrEqual'] = new Date(search.expireDate);
        }

        return axiosInstance.get(`/services/product/api/keyword-groups/display`, {params}).then(res => {
            const result: PopularSearchWords = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }
    async getPopularSearchWord(id): Promise<PopularSearchWordsModel> {
        return axiosInstance.get(`/services/product/api/keyword-groups/${id}`).then(res => {
            return res.data;
        });
    }

    async postKeywordItem(data: KeywordItemModel): Promise<KeywordItemModel> {
        return axiosInstance.post(`/services/product/api/keyword-items`, data
        ).then(res => {
            return res.data;
        });
    }

    async patchKeywordItem(id, data) {
        return axiosInstance.patch(`/services/product/api/keyword-items/${id}`, data, {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                }
            }
        ).then(res => {
            return res.data;
        });
    }

    async postKeywordGroup(data: PKeywordGroupModel): Promise<PKeywordGroupModel> {
        return axiosInstance.post(`/services/product/api/keyword-groups`, data
        ).then(res => {
            return res.data;
        });
    }

    async patchPopularSearchWord(id, data) {
        return axiosInstance.patch(`/services/product/api/keyword-groups/${id}`, data, {
                headers: {
                    'Content-Type': 'application/merge-patch+json',
                }
            }
        ).then(res => {
            return res.data;
        });
    }

    async putPopularSearchWord(data: PopularSearchWordsModel): Promise<PopularSearchWordsModel> {
        return axiosInstance.put(`/services/product/api/keyword-groups/${data.id}`, data).then(res => {
            return res.data;
        });
    }

    async deletePopularSearchWord(id, body): Promise<void> {
        return axiosInstance.patch(`/services/product/api/keyword-groups/${id}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
            console.log(res);
        });
    }
}

export const popularSearchWordsApi = new PopularSearchWordsApi();