import axiosInstance from "../plugins/axios-instance";
import {UserDressAssignments, UserDresses} from "../types/user-dress-model";

class UserDressApi {
  async getUserDresses(search): Promise<UserDresses> {
    const params = {
      size: search.size,
      page: search.page,
    }
    if (search.registerType) {
      params['registerType.in'] = search.registerType;
    }
    if (search.inspectionStatus) {
      params['inspectionStatus.equals'] = search.inspectionStatus;
    }
    if (search.inspectionStatusIn) {
      params['inspectionStatus.in'] = search.inspectionStatusIn;
    }
    if (search.registrationType) {
      params['registrationType.in'] = search.registrationType;
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
    if (search.id) {
      params['id.equals'] = search.id;
    }
    if (search.userId) {
      params['userId.equals'] = search.userId;
    }
    if (search.startDate) {
      params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
    }
    if (search.endDate) {
      params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
    }
    if (search.categoryId) {
      params['categoryId.equals'] = search.categoryId;
    }
    return axiosInstance.get(`/services/member/api/user-dresses`, {params}).then(res => {
      const result: UserDresses = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    });
  }

  async getUserDressAssignments(search): Promise<UserDressAssignments> {
    const params = {
      size: search.size,
      page: search.page,
    }
    if (search.id) {
      params['id.equals'] = search.id;
    }
    if (search.categoryId) {
      params['categoryId.equals'] = search.categoryId;
    }
    if (search.startDate) {
      params['createdDate.greaterThanOrEqual'] = new Date(search.startDate.setHours(0, 0, 0 ,0));
    }
    if (search.endDate) {
      params['createdDate.lessThanOrEqual'] = new Date(search.endDate.setHours(23, 59, 59 ,59));
    }
    if (search.registrationType) {
      params['registrationType.equals'] = search.registrationType;
    }
    return axiosInstance.get(`/services/member/api/user-dresses/assignment`, {params}).then(res => {
      const result: UserDressAssignments = {
        count: Number(res.headers['x-total-count']),
        lists: res.data
      }
      return result;
    });
  }

  async patchUserDress(data): Promise<any> {
    return axiosInstance.patch(`/services/member/api/user-dresses`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      }
    }).then(res => {
      return res.data;
    });
  }

  async imageProcessingSimple(id, formData): Promise<any> {
    return axiosInstance.post(`/services/member/api/user-dresses/${id}/image-processing/simple`, formData, {
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

  async imageProcessing(id, formData): Promise<any> {
    return axiosInstance.post(`/services/member/api/user-dresses/${id}/image-processing`, formData, {
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

  async getUserBucket() {
    return axiosInstance.get('/services/member/api/user-dresses/bucket').then(res => {
      return res.data;
    }).catch((err) => {
      console.log(err)
    })
  }
}

export const userDressApi = new UserDressApi();
