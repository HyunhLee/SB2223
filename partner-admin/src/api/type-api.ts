import axiosInstance from "../plugins/axios-instance";
import axiosProductInstance from "../plugins/axios-product-instance";
import axiosPartnerInstance from "../plugins/axios-partner-instance";

class TypeApi {
    async getCategoryTypes(type: string): Promise<any> {
        return axiosInstance.get(`/services/product/api/categories/types/${type}`).then(res => {
            return res.data
        }).catch(error => {

        });
    }

    async getGroupCategories() {
        return axiosProductInstance.get(`api/products/categoryGroups`).then((res) => {
            return res
        }).catch((err) => {
            console.log(err)
    })
  }

  //color
  async postColorType(data) {
    return axiosPartnerInstance.post('api/mall-colors/multi', data).then((res) => {
      return res.status
    }).catch((err) => {
      console.log(err);
    })
  }

  async getColorType(){
    const _mallId = localStorage.getItem('mallId');
    return axiosPartnerInstance.get(`api/mall-colors/malls/${_mallId}`).then((res) => {
      return res.data;
    }).catch((err) => {
      console.log(err);
    })
  }

  async deleteColorType(id){
    return axiosPartnerInstance.delete(`api/mall-colors/${id}`).then((res) =>{
      return res.status
    }).catch((err) => {
      console.log(err)
    })
  }

  async modifyColorType(data){
    return axiosPartnerInstance.patch(`/api/mall-colors/${data.id}`, data).then((res) => {
      return res.status
    }).catch((err) => {
      console.log(err)
    })
  }

  async getProductCategories (gender){
    return axiosPartnerInstance.get(`/api/categories/${gender}`).then((res) => {
      return res.data
    }).catch((err) => {
      console.log(err)
    })
  }

}

export const typeApi = new TypeApi();
