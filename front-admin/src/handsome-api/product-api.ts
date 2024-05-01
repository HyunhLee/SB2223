import axiosHandsomeInstance from "../plugins/axios-handsome-instance";
import {
  HandsomeProductDetailModel,
  HandsomeProducts
} from "../types/handsome-model/handsome-product-model";


class ProductApi {
  async getProducts(search): Promise<HandsomeProducts> {
    const params = {
      page: search.page,
      size: search.size,
    }

    if (search.id) {
      params['id'] = search.id;
    }
    if (search.jennieFitAssignStatus) {
      params['jennieFitAssignStatus'] = search.jennieFitAssignStatus;
    }

    if (search.number) {
      params['number'] = search.number;
    }

    if (search.displayStatus) {
      params['productDisplayStatus'] = search.displayStatus;
    }

    if(search.grade){
      params['grade'] = search.grade;
    }

    return axiosHandsomeInstance.get(`/api/products/all`,{params}).then(res => {
      const result: HandsomeProducts = {
        count: res.data.data.totalCount,
        lists: res.data.data.content
      }
      return result;
    });
  }

  async getProduct(id): Promise<HandsomeProductDetailModel> {
    return axiosHandsomeInstance.get(`/api/products/${id}`).then(res => {
      console.log(res.data)
      return res.data.data;
    });
  }

  async putDisplayStatus(data) {
    return axiosHandsomeInstance.put(`/api/products/display-status`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      return res.data;
    });
  }

  async putSoldOutStatus(data){
    return axiosHandsomeInstance.put(`/api/products/sold-out`, data, {
      headers: {
        'Content-Type' : 'application/json',
      }
    }).then(res => {
      return res.data;
    })
  }

  async deleteProduct(data): Promise<void> {
    return axiosHandsomeInstance.put(`/api/products/un-activated`, data, {
      headers: {
        'Content-Type' : 'application/json',
      }
    }).then(res => {
      return res.data;
    })
  }

  async imageProcessing(id, formData): Promise<any> {
    return axiosHandsomeInstance.post(`/services/product/api/products/${id}/image-processing/preview`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(res => {
      return res;
    }).catch(reason => {
      console.log('imageProcessing err', reason);
      return reason;
    });
  }
}

export const productApi = new ProductApi();
