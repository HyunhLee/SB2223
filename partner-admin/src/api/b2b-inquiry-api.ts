import axiosPartnerInstance from "../plugins/axios-partner-instance";

class B2bInquiryApi {
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
    if (search.type) {
      params['type'] = search.type;
    }
    if (search.status) {
      params['status'] = search.status;
    }
    if (search.content) {
      params['keyword'] = search.content;
    }

    return axiosPartnerInstance.get('/api/inquiries/user', {params}).then((res) => {
      const result = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    })
  }

  async postPartnersInquiries(data){
    return axiosPartnerInstance.post('api/inquiries', data,{headers: {
        "Content-Type": "multipart/form-data",
      }}).then((res) => {
      return res.status
    })
  }

  async patchPartnersInquiries(data, id){
    return axiosPartnerInstance.patch(`api/inquiries/${id}/user`, data , {headers: {
        "Content-Type": "multipart/form-data",
      }}).then((res) => {
      return res.status
    })

  }

  async deletePartnersInquiries(id){
    return axiosPartnerInstance.patch(`api/inquiries/${id}/inactivated`).then((res) => {
      return res.status
    })
  }
}

export const b2bInquiryApi = new B2bInquiryApi();