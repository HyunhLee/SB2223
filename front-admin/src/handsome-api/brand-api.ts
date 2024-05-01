import axiosHandsomeInstance from "../plugins/axios-handsome-instance";
import { BrandsModel} from "../types/handsome-model/brand-model";

class HandsomeBrandApi {
  async getBrands(params): Promise<BrandsModel> {
    return axiosHandsomeInstance.get(`/api/brands`, {params}).then(res => {
      const result: BrandsModel = {
        lists: res.data.data
      }
      return result;
    });
    return null;
  }
}

export const handsomebrandApi = new HandsomeBrandApi();
