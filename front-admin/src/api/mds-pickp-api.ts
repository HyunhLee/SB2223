import axiosInstance from "../plugins/axios-instance";
import {mdsPickList} from "../types/home-app-model/mds-pick";

class MdsPickApi {
  async getMdsPick(search): Promise<mdsPickList>{
    const params = {
      size: search.size,
      page: search.page
    }

    if (search.id) {
      params['id.equals'] = search.id;
    }
    if (search.title) {
      params['title.contains'] = search.title;
    }

    if (search.displayStatus == 'all' || search.displayStatus == ''){
      if (search.startDate) {
        params['startDate.greaterThanOrEqual'] =  new Date(search.startDate.setHours(0, 0, 0 ,0));
      }
    }

    if (search.displayStatus == 'all' || search.displayStatus == ''){
      if (search.expireDate) {
        params['expireDate.lessThanOrEqual'] = new Date(search.expireDate.setHours(23, 59, 59 ,59));
      }
    }

    if(search.displayStatus === '전시중'){
      params['schedulePlanned.lessThanOrEqual'] = new Date();
      params['scheduleFinished.greaterThanOrEqual'] = new Date();
    }else if(search.displayStatus === '전시예정'){
      params['schedulePlanned.greaterThanOrEqual'] = new Date();
    }else if(search.displayStatus === '전시종료'){
      params['scheduleFinished.lessThanOrEqual'] = new Date();
    }

    if(search.activated){
      params['activated.equals'] = search.activated
    }

    return axiosInstance.get('/services/product/api/md-picks', {params}).then((res) => {
      const result : mdsPickList= {
        count: Number(res.headers['x-total-count']),
        list: res.data
      }
      return result;
    })
  }

  async getPickStyle (id){
    return axiosInstance.get(`/services/product/api/md-picks/${id}`).then((res) => {
      return res.data
    })
  }
  async postMdsPick (data) {
    console.log('전달되는 데이터,', data)
    return axiosInstance.post('/services/product/api/md-picks', data).then((res) => {
      return res.status
    })
  }

  async putMdsPick(data) {
    return axiosInstance.put(`/services/product/api/md-picks/${data.id}`, data).then((res)=>{
      return res.status
    })
  }

  async deleteMdsPick(id){
    return axiosInstance.delete(`/services/product/api/md-picks/${id}`).then((res)=>{
      return res.status
    })
  }
}

export const mdsPickApi = new MdsPickApi();