import axiosHandsomeInstance from "../plugins/axios-handsome-instance";

class HandsomeTypeApi {
  async getHandsomeCategories() : Promise<any> {
    return axiosHandsomeInstance.get(`/api/products/category/depths`)
        .then(res => {
          return res.data
        })
        .catch(err => console.log(err));
  }
}

export const handsomeTypeApi = new HandsomeTypeApi();