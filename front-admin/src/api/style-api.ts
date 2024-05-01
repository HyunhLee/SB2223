import axiosInstance from "../plugins/axios-instance";
import {Customer} from "../types/customer";
import {StyleRecommend, StyleRecommends, StyleRecommendStatus} from "../types/style";
import moment from "moment";

class StyleApi {
  async getStyleRecommends(search): Promise<StyleRecommends> {
    const params = {
      size: search.size,
      page: search.page,
    }
    if (search.registerType) {
      params['registerType.in'] = search.registerType;
    }
    if (search.tpoType) {
      params['tpoType.equals'] = search.tpoType;
    }
    if (search.id) {
      params['id.equals'] = search.id;
    }
    if (search.tasteCode) {
      params['tasteCode.contains'] = search.tasteCode;
    }
    if (search.startDate) {
      params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
    }
    if (search.endDate) {
      params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
    }
    if (search.category1) {
      params['category1.equals'] = search.category1;
    }
    if (search.category2) {
      params['category2.equals'] = search.category2;
    }
    if (search.category3) {
      params['category3.equals'] = search.category3;
    }
    if (search.category4) {
      params['category4.equals'] = search.category4;
    }
    if (search.category5) {
      params['category5.equals'] = search.category5;
    }
    if (search.colorType) {
      params['colorType.equals'] = search.colorType;
    }
    if (search.patternType) {
      params['patternType.equals'] = search.patternType;
    }
    if (search.seasonTypes) {
      params['seasonTypes.contains'] = search.seasonTypes;
    }

    return axiosInstance.get(`/services/product/api/style-recommends`, {params}).then(res => {
      const result: StyleRecommends = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    });
  }

  async getStyleRecommend(id): Promise<StyleRecommend> {
    return axiosInstance.get(`/services/product/api/style-recommends/${id}`).then(res => {
      return res.data;
    });
  }

  async postStyleRecommend(data: StyleRecommend): Promise<StyleRecommend> {
    return axiosInstance.post(`/services/product/api/style-recommends`, data).then(res => {
      return res.data;
    });
  }

  async putStyleRecommend(data: StyleRecommend): Promise<StyleRecommend> {
    return axiosInstance.put(`/services/product/api/style-recommends/${data.id}`, data).then(res => {
      return res.data;
    });
  }

  async deleteStyleRecommend(id, body): Promise<void> {
    return axiosInstance.delete(`/services/product/api/style-recommends/${id}`, body).then(res => {
      console.log(res);
    });
  }

  async getStyleRecommendStatus(): Promise<StyleRecommendStatus> {
    return axiosInstance.get(`/services/product/api/style-recommends/count-status`).then(res => {
      return res.data;
    });
  }
}

export const styleApi = new StyleApi();
