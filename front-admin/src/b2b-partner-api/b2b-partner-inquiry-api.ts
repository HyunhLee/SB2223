import axiosBtbInstance from "../plugins/axios-btb-instance";
import moment from 'moment';
class B2bPartnerInquiryApi {
  async getPartnersInquiries(search){
    const params = {
      page: search.page,
      size: search.size,
    };

    if(search.startDate) {
      params['startDate'] = new Date(search.startDate.setHours(0, 0, 0, 0))
    }
    if(search.endDate) {
      params['endDate'] = new Date(search.endDate.setHours(23, 59, 59, 59))
    }
    if(search.type) {
      params['type'] = search.type;
    }
    if(search.status) {
      params['status'] = search.status;
    }

    if(search.contents){
      params['keyword'] = search.contents;
    }

    return axiosBtbInstance.get('api/inquiries', { params }).then((res) => {
      const result = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    })

  }

  async patchPartnersInquiries(data){
    return axiosBtbInstance.patch(`api/inquiries/${data.id}/admin`, data).then((res)=>{
      return res.status
    })
  }
}

export const b2bPartnerInquiryApi = new B2bPartnerInquiryApi();