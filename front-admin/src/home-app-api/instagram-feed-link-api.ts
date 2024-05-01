import axios from "axios";
import axiosInstance from "../plugins/axios-instance";

class InstagramFeedLinkApi {
    async putInstaLink(data) {
        return axiosInstance.put('/services/product/api/magazine', data).then(res => {
            return res.data;
        });
    }

    async getInstaLink() {
        return axiosInstance.get('/services/product/api/magazines').then(res => {
            return res.data;
        })
    }

    async getPresignedUrl(fileName, type, file): Promise<any> {
        const params = {};
        params['fileName'] = fileName
        params['type'] = type

        return axiosInstance.get('/services/product/api/aws/admin-presigned-urls', {params}
        ).then(res => {
            if(res.status === 200) {
                const headers = {
                    'Content-type': 'image/png',
                    'Accept': '*/*'
                }
                return axios.put(res.data.presignedUrl, file, {headers}
                ).then((response) => {
                    console.log('b2b pre-signed res-status', response)
                    return response.status;
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }
}

export const instagramFeedLinkApi = new InstagramFeedLinkApi();