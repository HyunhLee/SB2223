import axiosInstance from "../plugins/axios-instance";
import {
  JennieFitAssigmentUserDressModel,
  JennieFitAssignments,
  JennieFitStatus
} from "../types/jennie-fit-assignment-model";
import moment from "moment";

class JennieFitUserAssignmentApi {

  async getJennieFitAssignmentsWithUserDress(search): Promise<JennieFitAssignments> {
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
      params['workStartDay.greaterThanOrEqual'] = moment(search.startDate).format('YYYY-MM-DD');
    }
    if (search.endDate) {
      params['workStartDay.lessThanOrEqual'] = moment(search.endDate).format('YYYY-MM-DD');
    }
    if (search.userDressCreatedStartDate) {
      params['userDressCreatedDate.greaterThanOrEqual'] = new Date(search.userDressCreatedStartDate.setHours(0, 0, 0 ,0));
    }
    if (search.userDressCreatedEndDate) {
      params['userDressCreatedDate.lessThanOrEqual'] = new Date(search.userDressCreatedEndDate.setHours(23, 59, 59 ,59));
    }
    if (search.registerType) {
      params['registerType.in'] = search.registerType;
    }
    if (search.registrationType) {
      params['registrationType.equals'] = search.registrationType;
    }
    if (search.tpoType) {
      params['tpoType.equals'] = search.tpoType;
    }
    if (search.id) {
      params['id.equals'] = search.id;
    }
    if (search.userDressId) {
      params['userDressId.equals'] = search.userDressId;
    }
    if (search.categoryId) {
      params['categoryId.equals'] = search.categoryId;
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
    if (search.categoryConcat) {
      params['categoryConcat.equals'] = search.categoryConcat;
    }
    if (search.isAi && search.extraOption != '') {
      params['isAi.equals'] = search.isAi;
    }
    if(search.isAi != null) {
      params['isAi.equals'] = search.isAi;
    }
    if (search.maskless && search.extraOption != '') {
      params['maskless.equals'] = search.maskless;
    }
    if (search.sort) {
      params['sort'] = search.sort;
    }

    return axiosInstance.get(`/services/member/api/jennie-fit-assignments/list`, {params}).then(res => {
      const result: JennieFitAssignments = {
        count: (res.headers['x-total-count'] !== undefined) ? Number(res.headers['x-total-count']) : 0,
        lists: res.data
      }
      return result;
    });
  }

  async getJennieFitAssignmentsStatus(search): Promise<JennieFitStatus[]> {
    const workDayFrom = moment(search.workDayFrom).format('YYYYMMDD');
    const workDayTo = moment(search.workDayTo).format('YYYYMMDD');
    let url = `/services/member/api/jennie-fit-assignments/status/${workDayFrom}/${workDayTo}`
    if (search.workerId) {
      url = `${url}/${search.workerId}`
    } else {
      url = `${url}/0`
    }
    return axiosInstance.get(url, null).then(res => {
      return res.data;
    });
  }

  async getJennieFitAssignment(id): Promise<JennieFitAssigmentUserDressModel> {
    return axiosInstance.get(`/services/member/api/jennie-fit-assignments/${id}`).then(res => {
      return res.data;
    });
  }

  async postJennieFitAssignment(data): Promise<number> {
    return axiosInstance.post(`/services/member/api/jennie-fit-assignments`, data).then(res => {
      return res.status;
    });
  }

  async postJennieFitReassign(data): Promise<number> {
    return axiosInstance.post(`/services/member/api/jennie-fit-assignments/reassign`, data).then(res => {
      return res.status;
    });
  }

  async patchWorkStatus(data, status) {
    return axiosInstance.patch(`/services/member/api/jennie-fit-assignments/work-status/${status}`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      }
    }).then(res => {
      return res.status;
    });
  }

  async patchUserDresses(id, data) {
    return axiosInstance.patch(`/services/member/api/user-dresses/${id}`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      }
    }).then(res => {
      return res.status;
    });
  }
}

export const jennieFitUserAssignmentApi = new JennieFitUserAssignmentApi();
