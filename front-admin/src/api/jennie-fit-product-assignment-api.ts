import axiosInstance from "../plugins/axios-instance";
import {JennieFitAssignments, JennieFitStatus} from "../types/jennie-fit-assignment-model";
import moment from "moment";

class JennieFitProductAssignmentApi {

  async getJennieFitAssignmentsWithProduct(search): Promise<JennieFitAssignments> {
    const params = {};

    if (search.size != null) {
      params['size'] = search.size;
    }
    if (search.page != null) {
      params['page'] = search.page;
    }
    if (search.sizes != null) {
      params['size'] = search.sizes;
    }
    if (search.pages != null) {
      params['page'] = search.pages;
    }
    if (search.priorityType) {
      params['priorityType.equals'] = search.priorityType;
    }
    if (search.startDate) {
      params['workStartDay.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
    }
    if (search.endDate) {
      params['workStartDay.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
    }

    if (search.productCreatedStartDate) {
      params['productCreatedDate.greaterThanOrEqual'] =  new Date(search.productCreatedStartDate.setHours(0, 0, 0 ,0));
    }
    if (search.productCreatedEndDate) {
      params['productCreatedDate.lessThanOrEqual'] = new Date(search.productCreatedEndDate.setHours(23, 59, 59 ,59));
    }

    if (search.id) {
      params['id.equals'] = search.id;
    }
    if (search.productId) {
      params['productId.equals'] = search.productId;
    }
    if (search.categoryId) {
      params['categoryId.equals'] = search.categoryId;
    }
    if (search.registrationType) {
      params['registrationType.equals'] = search.registrationType;
    }
    if (search.workerId) {
      params['workerId.equals'] = search.workerId;
    }
    if (search.status) {
      params['status.equals'] = search.status;
    }
    if (search.statusIn) {
      params['status.in'] = search.statusIn;
    }
    if (search.brandId) {
      params['brandId.equals'] = search.brandId;
    }
    if (search.productName) {
      params['productName.contains'] = search.productName;
    }
    if (search.isAi && search.extraOption != '') {
      params['isAi.equals'] = search.isAi;
    }
    if (search.sort) {
      params['sort'] = search.sort;
    }
    if(search.isAi != null) {
      params['isAi.equals'] = search.isAi;
    }
    return axiosInstance.get(`/services/product/api/jennie-fit-assignments/list`, {params}).then(res => {
      const result: JennieFitAssignments = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    });
  }

  async getJennieFitAssignmentsStatus(search): Promise<JennieFitStatus[]> {
    const workDayFrom = moment(search.workDayFrom).format('YYYYMMDD');
    const workDayTo = moment(search.workDayTo).format('YYYYMMDD');
    let url = `/services/product/api/jennie-fit-assignments/status/${workDayFrom}/${workDayTo}`
    if (search.workerId) {
      url = `${url}/${search.workerId}`
    } else {
      url = `${url}/0`
    }
    return axiosInstance.get(url, null).then(res => {
      return res.data;
    });
  }

  async postJennieFitAssignment(data): Promise<number> {
    return axiosInstance.post(`/services/product/api/jennie-fit-assignments`, data).then(res => {
      return res.status;
    });
  }

  async postJennieFitReassign(data): Promise<number> {
    return axiosInstance.post(`/services/product/api/jennie-fit-assignments/reassign`, data).then(res => {
      return res.status;
    });
  }

  async postWorkStatus(data, status) {
    return axiosInstance.post(`/services/product/api/jennie-fit-assignments/status/${status}`, data).then(res => {
      return res.status;
    });
  }

  async patchWorkStatus(data, status) {
    return axiosInstance.patch(`/services/product/api/jennie-fit-assignments/work-status/${status}`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      }
    }).then(res => {
      return res.status;
    });
  }

  async postVton(data) {
    return axiosInstance.post('/services/product/api/jennie-fit-assignments/vton', {...data}).then(res => {
      return res;
    })
  }

  async postSeg(data) {
    return axiosInstance.post('/services/product/api/jennie-fit-assignments/seg', {...data}).then(res => {
      return res;
    })
  }
}

export const jennieFitProductAssignmentApi = new JennieFitProductAssignmentApi();
