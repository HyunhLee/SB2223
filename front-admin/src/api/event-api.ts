import axiosInstance from "../plugins/axios-instance";
import {EventSearch} from "../types/event";
import toast from "react-hot-toast";

class EventPopupApi {
    async getEventPopup(search): Promise<EventSearch> {
        const params = {
            size: search.size,
            page: search.page,
            sort: 'startDate,desc'
        }
        if (search.id) {
            params['id.equals'] = search.id;
        }
        if (search.title) {
            params['title.contains'] = search.title;
        }

        if (search.displayStatus == 'all' || search.displayStatus === '전시종료'){
            if (search.startDate && search.displayStatus !== '전시중') {
                params['expireDate.greaterThanOrEqual'] =  new Date(search.startDate);
            }
        }

        if (search.displayStatus == 'all' || search.displayStatus === '전시예정'){
            if (search.expireDate) {
                params['expireDate.lessThanOrEqual'] = new Date(search.expireDate);
            }
        }

        if(search.displayStatus === '전시중'){
            params['startDate.lessThanOrEqual'] = new Date();
            params['expireDate.greaterThan'] = new Date();
        }else if(search.displayStatus === '전시예정'){
            params['startDate.greaterThan'] = new Date(search.startDate);
        }else if(search.displayStatus === '전시종료'){
            params['expireDate.lessThanOrEqual'] = new Date(search.expireDate);
        }

        return axiosInstance.get(`/services/product/api/popups`, {params}).then(res => {
            const result: EventSearch = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }

    async postEventPopup(data) {
        return axiosInstance.post(`/services/product/api/popups`, data).then(res => {
            return res.status
        }).catch(err => {
            if(err.response.status == 400){
                toast.error(err.response.data.title);
            }

        });
    }

    async patchEventPopup(data){
        return axiosInstance.patch(`/services/product/api/popups/${data.id}`, data).then(res => {
           return res.status
        }).catch(err => {
            if(err.response.status == 400){
                toast.error(err.response.data.title);
            }
        });
    }

    async deleteEventPopup(id) {
        return axiosInstance.delete(`/services/product/api/popups/${id}`).then((res) =>{
            return res.status
        }).catch(err => {
            console.log(err)
        })
    }

}


export const eventPopupApi = new EventPopupApi();