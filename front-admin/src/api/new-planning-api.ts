import {NewPlanningModels} from "../types/home-app-model/new-planning-model";
import axiosInstance from "../plugins/axios-instance";

class NewPlanningApi {
    async getExhibitionList(search): Promise<NewPlanningModels> {
        const params = {
            size: search.size,
            page: search.page
        };

        if (search.id) {
            params['id.equals'] = search.id;
        }
        if (search.title) {
            params['title.contains'] = search.title;
        }
        if (!search.displayStatus && search.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
        }
        if (!search.displayStatus && search.expireDate) {
            params['createdDate.lessThanOrEqual'] = new Date(search.expireDate.setHours(23, 59, 59, 59));
        }
        if (search.activated) {
            params['activated.equals'] = search.activated;
        }
        if (search.displayStatus === 'Display_End'){
            if (search.startDate) {
                params['expireDate.greaterThanOrEqual'] =  new Date(search.startDate);
            }
        }
        if (search.displayStatus === 'Display_Wait'){
            if (search.expireDate) {
                params['expireDate.lessThanOrEqual'] = new Date(search.expireDate);
            }
        }
        if(search.displayStatus === 'Display_On'){
            params['startDate.lessThanOrEqual'] = new Date();
            params['expireDate.greaterThan'] = new Date();
        }else if(search.displayStatus === 'Display_Wait'){
            params['startDate.greaterThan'] = new Date(search.startDate);
        }else if(search.displayStatus === 'Display_End'){
            params['expireDate.lessThanOrEqual'] = new Date(search.expireDate);
        }

        return axiosInstance.get('/services/product/api/exhibitions', {params}).then(res => {
            const result: NewPlanningModels = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }

    async postNewPlanning(data) {
        return axiosInstance.post('/services/product/api/exhibition', data).then(res => {
            return res.data;
        })
    }

    async putNewPlanning(data) {
        return axiosInstance.put('/services/product/api/exhibition', data).then(res => {
            return res.data;
        })
    }

    async patchNewPlanning(data) {
        return axiosInstance.patch('/services/product/api/exhibitions', data).then(res => {
            return res.data;
        })
    }

    async deleteNewPlanning(data) {
        return axiosInstance.patch('/services/product/api/exhibitions/activated', data).then(res => {
            return res.data;
        })
    }
}

export const newPlanningApi = new NewPlanningApi();