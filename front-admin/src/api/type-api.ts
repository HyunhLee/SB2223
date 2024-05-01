import axiosInstance from "../plugins/axios-instance";
import axios from "axios";
import axiosBtbInstance from "../plugins/axios-btb-instance";

class TypeApi {
  async getCategoryTypes(type: string): Promise<any> {
    return axiosInstance.get(`/services/product/api/categories/types/${type}`).then(res => {
      return res.data
    }).catch(error => {

    });
  }

  async getB2BCategoryTypes(gender): Promise<any> {
    return axiosBtbInstance.get(`api/categories/${gender}`).then(res => {
      return res.data
    }).catch(error => {

    });
  }

  async getStyleKeywords(type: string): Promise<any> {
    return axiosInstance.get(`/services/product/api/categories/types/${type}/list`).then(res => {
      return res.data
    }).catch(error => {
      console.log(error)
    });
  }

  async postRusselTest(): Promise<void> {
    return axios.post(`http://10.0.111.116:8080/v2/admin/image/create-preview`, null, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.data
    }).catch(error => {

    });
  }

  async getGroupCategories () {
    return axiosBtbInstance.get(`api/products/categoryGroups`).then((res) =>{
      return res
    }).catch((err) =>{
      console.log(err)
    })
  }

  async getMall () {
    return axiosBtbInstance.get(`api/malls`).then((res) =>{
      return res
    }).catch((err) =>{
      console.log(err)
    })
  }
}

export const typeApi = new TypeApi();
