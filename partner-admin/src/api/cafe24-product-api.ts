import {Cafe24Products} from "../types/cafe24-product-model";
import axiosPartnerInstance from "../plugins/axios-partner-instance";

class Cafe24ProductApi {
    async getProduct(search): Promise<Cafe24Products> {
        const params = {};

        if (search.sort) {
            params['sort'] = search.sort;
        }
        if (search.order) {
            params['order'] = search.order;
        }
        if (search.offset) {
            params['offset'] = search.offset;
        }
        if (search.limit) {
            params['limit'] = search.limit;
        }
        if (search.product_name) {
            params['product_name'] = search.product_name;
        }
        if (search.category) {
            params['category'] = search.category;
        }
        if (search.display) {
            params['display'] = search.display;
        }
        if (search.sold_out) {
            params['sold_out'] = search.sold_out;
        }
        if (search.selling) {
            params['selling'] = search.selling;
        }

        if(search.sortType){
           params['sortType'] = search.sortType.toUpperCase();
        }

        let mallId = null;
        if (localStorage.getItem("mallId")) {
            mallId = localStorage.getItem("mallId");
        }

        return axiosPartnerInstance.get(`/api/cafe24/products/${mallId}`, {params}).then(res => {
            const result: Cafe24Products = {
                count: Number(res.headers['x-total-count']),
                lists: res.data.products
            }
            return result;
        }).catch(err => {
                return err
            }
        );
    }

    async getProductCount(categoryNo) {
        return axiosPartnerInstance.get(`/api/cafe24/products/count/${categoryNo}`).then(res => {
            return res;
        })
    }

    async getProductNo(productNo) {
        return axiosPartnerInstance.get(`/api/cafe24/product/${productNo}`).then(res => {
            return res.data.product;
        })
    }

    async getDiscount(productNo) {
        return axiosPartnerInstance.get(`/api/cafe24/product/${productNo}/discount-price`
        ).then(res => {
            return res.data;
        })
    }

    async getProductColorOptions(productNo){
        return axiosPartnerInstance.get(`/api/cafe24/products/${productNo}/variants`).then((res)=>{
            return res.data
        })

    }

  async getCafe24Colors(){
        const _mallId = localStorage.getItem('mallId');
    return axiosPartnerInstance.get(`/api/cafe24/products/${_mallId}/embed-variants`).then((res)=> {
        return res.data
    })
  }


}

export const cafe24ProductApi = new Cafe24ProductApi();