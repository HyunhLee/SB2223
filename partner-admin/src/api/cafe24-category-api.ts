import {Cafe24Categories} from "../types/cafe24-category-model";
import axiosProductInstance from "../plugins/axios-product-instance";
import axiosPartnerInstance from "../plugins/axios-partner-instance";

class Cafe24CategoryApi {
    async getCategories(count): Promise<Cafe24Categories> {
        const params = {};
        if (count) {
            params['limit'] = count;
        }
        return axiosPartnerInstance.get('/api/cafe24/categories', {params}).then(res => {
            const result: Cafe24Categories = {
                count: Number(res.headers['x-total-count']),
                lists: res.data.categories
            }
            return result;
        }).catch(err => {
            return err
        })
    }

    async getCategoriesCount() {
        return axiosPartnerInstance.get('/api/cafe24/categories/count').then(res => {
            return res.data.count;
        }).catch(err => {
            return err
        })
    }

    async mappingCategories(data) {
        let params = {
            type: "Retail",
            registrationType: "Automatic",
            mallId: localStorage.getItem('mallId'),
            ...data,
        }


        return axiosProductInstance.post(`api/products`, params)
          .then((res) => {
              return res.status
          })
          .catch((err) => console.log(err))
    }

}

export const cafe24CategoryApi = new Cafe24CategoryApi();