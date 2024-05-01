import axiosInstance from "../plugins/axios-instance";
import {StyleTasteMapModel} from "../types/style-taste-map-model";

class StyleTasteMapApi {

  async postStyleTasteMapRecommend(data): Promise<StyleTasteMapModel> {
    return axiosInstance.post(`/services/product/api/style-taste-maps/recommend`, data).then(res => {
      return res.data;
    });
  }
}

export const styleTasteMapApi = new StyleTasteMapApi();
