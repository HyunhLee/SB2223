import axiosBtbInstance from "../plugins/axios-btb-instance";
import axios from "axios";


class BtbAwsApi {
    async getPreSignedUrl(fileName,type,file): Promise<any>{
        const params = {};
        params['fileName'] = fileName
        params['type']= type
        return axiosBtbInstance.get(`/api/aws/presigned-url`, {params}).then((res)=>{
            let result;
            if(res.status == 200 ){
                result = this.setPutOnImage(res.data.presignedUrl, file)
            }
            return result

        })
    }

    async setPutOnImage(url, file): Promise<any>{
        const headers = {
            'Content-type': 'image/png',
            'Accept': '*/*'
        }
        return axios.put(url, file, {headers}).then(res => {
            console.log('aws 222222222222')
            return res.status;
        }).catch(err => {
            console.log(err)
        })
    }
}

export const btbAwsApi = new BtbAwsApi();