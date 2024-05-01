import axiosHandsomeInstance from "../plugins/axios-handsome-instance";
import axios from "axios";

class AwsApi {

  async getPreSignedUrl(search, type, file): Promise<any> {
    const params = {};
    params['fileName'] = search
    params['type'] = type
    return axiosHandsomeInstance.get(`/api/aws/admin-presigned-urls`, {params}).then(res => {
      let response;
      if(res.data.code === 200) {
        response = this.setPutOnImage(res.data.data.presignedUrl, file);
      }
      return response;
    })

  }

  async setPutOnImage(url, file): Promise<any> {
    const headers = {
      'Content-type': 'image/png',
      'Accept': '*/*'
    }
    return axios.put(url, file, {headers}).then(res =>{
      console.log('setting.res ->' , res)
      return res.status;
    }).catch(err => {
      console.log('setting.err ->' , err)
    })
  }

}

export const handsomeAwsApi = new AwsApi();
