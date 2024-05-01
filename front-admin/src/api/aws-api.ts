import axiosInstance from "../plugins/axios-instance";
import axios from "axios";

class AwsApi {
    async getPreSignedUrl(data, file): Promise<any>{
        const params = {
            ...data,
        };
        return axiosInstance.get(`/services/product/api/aws/admin-presigned-urls`, {params}).then(res => {
            if(res.status === 200){
                const headers = {
                    'Content-type': 'image/png',
                    'Accept': '*/*'
                }
                return axios.put(res.data.presignedUrl, file, {headers}).then((response) =>{
                    console.log('aws pre-signed res-status', response.status)
                    return response.status;
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }

    async getUserPreSignedUrl(fileName, type, file): Promise<any> {
        const params = {};
        params['fileName'] = fileName
        params['type'] = type
        return axiosInstance.get('/services/member/api/aws/admin-presigned-urls', {params}
        ).then(res => {
            let response;
            if(res.status === 200){
                const headers = {
                    'Content-type': 'image/png',
                    'Accept': '*/*'
                }
                return axios.put(res.data.presignedUrl, file, {headers}).then((res) =>{
                    console.log('aws user pre-signed res-status', res.status)
                    response = res.status;
                    return response;
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }
}

export const adminAwsApi = new AwsApi();