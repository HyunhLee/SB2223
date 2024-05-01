import {StyleRecommend, StyleRecommends, StyleRecommendStatus, StyleRecommendationModel} from "../types/b2b-partner-model/b2b-style";
import axiosBtbInstance from "../plugins/axios-btb-instance";

class B2bStyleRecommendApi {
  async getJenniePickRecommend(search) : Promise<StyleRecommendationModel>{
    const params = {
      page: search.page,
      size: search.size
    };

    if(search.id){
      params['id'] = search.id;
    }

    if(search.brandId){
      params['brandId'] = search.brandId;
    }

    if (search.category1) {
      params['category1'] = search.category1;
    }
    if (search.category2) {
      params['category2'] = search.category2;
    }
    if (search.category3) {
      params['category3'] = search.category3;
    }
    if (search.category4) {
      params['category4'] = search.category4;
    }
    if (search.category5) {
      params['category5'] = search.category5;
    }

    if(search.colorType){
      params['colorType'] = search.colorType;
    }

    if(search.seasonType){
      params['seasonTypes'] = search.seasonType;
    }

    if(search.patternType){
      params['patternType'] = search.patternType;
    }

    if(search.keywords.length > 0){
      params['styleKeywords'] = search.keywords.join(',');
    }

    if(search.gender){
      params['gender'] = search.gender;
    }

    if (search.startDate) {
      params['createdDateFrom'] = new Date(search.startDate.setHours(0, 0, 0, 0));
    }

    if (search.endDate) {
      params['createdDateTo'] = new Date(search.endDate.setHours(23, 59, 59, 59));
    }

    return axiosBtbInstance.get('api/new-style-recommends', {params}).then((res) => {
      const result : StyleRecommendationModel = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    }).catch((err) => {
      return err;
    })
  }
  
  async getStyleRecommendCount(gender){
    const params = {};

    if(gender) {
      params['gender'] = gender;
    }
    return axiosBtbInstance.get(`api/style-recommends/stat`, {params}).then((res) => {
      return res.data;
    }).catch((err) => {
      return err
    })
  }
  async deleteJenniePickRecommend(idList){
    return axiosBtbInstance.patch(`api/style-recommends/unused`, idList).then((res) => {
      return res.status
    }).catch((err)=>{
      return err
    })
  }

  async getStyleRecommend(id): Promise<StyleRecommend> {
        return axiosBtbInstance.get(`/api/style-recommends/${id}`).then(res => {
            return res.data;
        });
    }

    async postStyleRecommend(data: StyleRecommend): Promise<StyleRecommend> {
        return axiosBtbInstance.post(`/api/style-recommends`, data).then(res => {
            return res.data;
        });
    }
    async putStyleRecommend(data: StyleRecommend): Promise<StyleRecommend> {
        return axiosBtbInstance.put(`/api/style-recommends/${data.id}`, data).then(res => {
            return res.data;
        });
    }

    async deleteStyleRecommend(id, body): Promise<void> {
        return axiosBtbInstance.delete(`/api/style-recommends/${id}`, body).then(res => {
            console.log(res);
        });
    }

    async getStyleRecommendStatus(): Promise<StyleRecommendStatus> {
        return axiosBtbInstance.get(`/api/style-recommends/count-status`).then(res => {
            return res.data;
        });
    }
}
export const b2bStyleRecommendApi = new B2bStyleRecommendApi();

