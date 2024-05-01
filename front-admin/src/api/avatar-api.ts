import axiosInstance from "../plugins/axios-instance";
import {AvatarCustoms, AvatarCustomModel, AvatarHairCustoms, AvatarHair} from "../types/avatar-custom";

class AvatarApi {
    async getAvatars(search): Promise<AvatarCustoms> {
        const params = {}
        if (search.id) {
            params['id.equals'] = search.id;
        }
        return axiosInstance.get(`/services/member/api/avatar-faces`, {params}).then(res => {
            const result: AvatarCustoms = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }

    async getAvatarHairs(search): Promise<AvatarHairCustoms> {
        const params = {}
        if (search.hairLengthType) {
            params['hairLengthType.equals'] = search.hairLengthType;
        }
        if (search.id) {
            params['id.equals'] = search.id;
        }
        if (search.hairType) {
            params['hairType.equals'] = search.hairType;
        }
        if (search.hasBangs) {
            params['hasBangs.equals'] = search.hasBangs;
        }
        if (search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
        }
        if (search.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
        }

        return axiosInstance.get(`/services/member/api/avatar-hairs`, {params}).then(res => {
            const result: AvatarHairCustoms = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }

    async getAvatar(id): Promise<AvatarCustomModel> {
        return axiosInstance.get(`/services/member/api/avatar-face/${id}`).then(res => {
            return res.data;
        });
    }

    async getAvatarHair(id): Promise<AvatarHair> {
        return axiosInstance.get(`/services/member/api/avatar-hair/${id}`).then(res => {
            return res.data;
        });
    }

    async postAvatar(data: AvatarCustomModel): Promise<AvatarCustomModel> {
        return axiosInstance.post(`/services/member/api/avatar-faces`, data, {headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            return res.data;
        });
    }

    async postAvatarHair(data: AvatarHair): Promise<AvatarHair> {
        return axiosInstance.post(`/services/member/api/avatar-hairs`, data, {headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            return res.data;
        });
    }

    async patchAvatar(id, data) {
        return axiosInstance.patch(`/services/member/api/avatar-face/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            return res.status;
        });
    }

    async postAvatarHairList(data: AvatarHair[]): Promise<AvatarHair[]> {
        return axiosInstance.post(`/services/member/api/avatar-hairs`, data, {headers: { "Content-Type": "application/json" }
        }).then(res => {
            return res.data;
        });
    }

    async patchAvatarHair(id, data) {
        return axiosInstance.patch(`/services/member/api/avatar-hair/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            return res.status;
        });
    }

    async deleteAvatar(id, body): Promise<void> {
        return axiosInstance.patch(`/services/member/api/avatar-face/${id}`, body).then(res => {
            console.log(res);
        });
    }
}

export const avatarApi = new AvatarApi();