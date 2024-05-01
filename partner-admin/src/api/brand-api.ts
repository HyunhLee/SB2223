import axiosPartnerInstance from "../plugins/axios-partner-instance";

class BrandApi {
  async getMallBrands(mallId) {
    const params = { mallId: mallId}
    return axiosPartnerInstance.get(`api/mall/brand/names`, {params}).then((res) =>{
      console.log(res)
      return res
    })
  }
}


export const brandApi = new BrandApi();
