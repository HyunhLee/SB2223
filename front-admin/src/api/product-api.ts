import {ProductModel, Products} from "src/types/product-model";
import axiosInstance from "../plugins/axios-instance";

class ProductApi {
  async getProducts(search): Promise<Products> {
    const params = {
      size: search.size,
      page: search.page,
    }

    if (search.categoryId) {
      params['categoryId.equals'] = search.categoryId;
    }
    if (search.colorType) {
      params['colorType.equals'] = search.colorType;
    }
    if (search.colorTypes) {
      params['colorType.in'] = search.colorTypes.split(',');
    }
    if (search.patternType) {
      params['patternType.equals'] = search.patternType;
    }
    if (search.patternTypes) {
      params['patternType.in'] = search.patternTypes.split(',');
    }
    if (search.brandId) {
      params['brandId.equals'] = search.brandId;
    }
    if (search.brandName) {
      params['brandName.equals'] = search.brandName;
    }
    if (search.nameKo) {
      params['nameKo.contains'] = search.nameKo;
    }
    if (search.registrationType) {
      params['registrationType.equals'] = search.registrationType;
    }
    if (search.displayStatus) {
      params['displayStatus.in'] = search.displayStatus;
    }
    if (search.startDate) {
      params['createdDate.greaterThanOrEqual'] = new Date(search.startDate);
    }
    if (search.endDate) {
      params['createdDate.lessThanOrEqual'] = new Date(search.endDate);
    }
    if (search.fitRequestStatus) {
      params['fitRequestStatus.equals'] = search.fitRequestStatus;
    }
    if (search.seasonTypes) {
      params['seasonTypes.contains'] = search.seasonTypes;
    }
    if (search.id) {
      params['id.equals'] = search.id;
    }

    return axiosInstance.get(`/services/product/api/products`, {params}).then(res => {
      const result: Products = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    });
  }
  async getProduct(id): Promise<ProductModel> {
    return axiosInstance.get(`/services/product/api/products/${id}`).then(res => {

      if(res.data.styleKeywords == null || res.data.styleKeywords == "" || res.data.styleKeywords == "null")   {
        res.data.styleKeywordsList = []
      } else {
        res.data.styleKeywordsList = res.data.styleKeywords.split(',')
      }
      return res.data;
    });
  }

  async postProduct(data: ProductModel): Promise<ProductModel> {
    return axiosInstance.post(`/services/product/api/product`, data)
        .then(res => {
      return res.data;
    });
  }

  async uploadFile(dir, file): Promise<string> {
    const productModel = {
      id: 0,
      type: "",
      nameKo: "",
      nameEn: "",
      detailSiteUrl: "",
      price: 0,
      mainImageUrl: "",
      putOnImageUrl: "",
      ghostImageUrl: null,
      fitRefImageUrl: null,
      imageUrlList: [],
      searchWord: null,
      styleKeywords: null,
      seasonTypes: null,
      colorType: null,
      patternType: null,
      necklineType: null,
      silhouetteType: null,
      sleeveType: null,
      lengthType: null,
      displayStatus: null,
      registrationType: "",
      fitRequestStatus: "",
      inspectionStatus: "",
      retail: true,
      verified: true,
      activated: true,
      createdBy: "",
      createdDate: "",
      lastModifiedBy: null,
      lastModifiedDate: null,
      brandId: 0,
      categoryIds: []
    };

    return axiosInstance.post(`/api/products`, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(res => {
      console.log(res.data);
      return res.data.imageUrl;
    }).catch(err => console.log(err))
  }

  async putProduct(data: ProductModel): Promise<ProductModel> {
    return axiosInstance.put(`/services/product/api/products/${data.id}`, data).then(res => {
      return res.data;
    });
  }

  async patchProduct(id, data) {
    return axiosInstance.patch(`/services/product/api/products/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      return res.status;
    });
  }

  async patchDisplayStatus(displayStatus, data) {
    return axiosInstance.patch(`/services/product/api/products/displayStatus/${displayStatus}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      return res.status;
    });
  }


  async deleteProduct(id, body): Promise<void> {
    return axiosInstance.patch(`/services/product/api/products/${id}`, body).then(res => {
      console.log(res);
    });
  }

  async imageProcessing(id, formData): Promise<any> {
    return axiosInstance.post(`/services/product/api/products/${id}/image-processing/preview`, formData, {
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

  async uploadImage(formData): Promise<any> {
    return axiosInstance.post('/api/upload-image', formData, {headers: {
      "Content-Type": "multipart/form-data",
      }}
    ).then(res => {
      return res;
    }).catch(reason => {
      console.log('imageUpload err', reason);
      return reason;
    })
  }

  async uploadImageList(formData): Promise<any> {
    return axiosInstance.post('/api/image-list/upload-image', formData, {headers: {
        "Content-Type": "multipart/form-data",
      }}
    ).then(res => {
      return res;
    }).catch(reason => {
      console.log('imageUpload err', reason);
      return reason;
    })
  }

  async changeImageList(id, formData): Promise<any> {
    return axiosInstance.post(`/services/product/api/products/${id}/image-list`, formData, {headers: {
        "Content-Type": "multipart/form-data",
      }}
    ).then(res => {
      return res;
    }).catch(reason => {
      console.log('changeImageList err', reason);
      return reason;
    })
  }

  async deleteImage(data): Promise<any> {
    const params = {
      imageUrl : data.imageUrl
    }
    return axiosInstance.get('/api/delete-image', {params}
    ).then(res => {
      return res;
    }).catch(reason => {
      console.log('imageDelete err', reason);
      return reason;
    })
  }

  async postImageResizing(formdata): Promise<any> {
    return axiosInstance.post('/api/list-image/upload-image', formdata, {headers: {
        "Content-Type": "multipart/form-data",
      }}
    ).then(res => {
      return res;
    }).catch(reason => {
      console.log('imageResize err', reason);
      return reason;
    })
  }

  async getProductBucket(): Promise<any> {
    return axiosInstance.get('/services/product/api/products/bucket').then(res => {
      return res.data;
    }).catch(err => {
      console.log(err)
    });
  }
}

export const productApi = new ProductApi();
