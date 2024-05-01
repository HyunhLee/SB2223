import axiosHandsomeInstance from "../plugins/axios-handsome-instance";
import {
  HandsomeJennieFitAssignmentModel,
  HandsomeJennieFitAssignments,
  HandsomeJennieFitStatus,
} from "../types/handsome-model/handsome-jennie-fit-assignment-model";
import axios from "axios";
import {endPointConfig} from "../config";

class JennieFitProductAssignmentApi {

  async getJennieFitAssignmentsWithProduct(search): Promise<HandsomeJennieFitAssignments> {
    const params = {};

    if (search.page != null) {
      params['page'] = search.page;
    }
    if (search.size != null) {
      params['size'] = search.size;
    }
    if (search.sort) {
      params['sort'] = search.sort;
    }
    if (search.status) {
      params['status'] = search.status;
    }
    return axiosHandsomeInstance.get(`/api/jennie-fit-assignments/${search.workerId}`, {params}).then(res => {
      const result: HandsomeJennieFitAssignments = {
        count: res.data.data.totalPage,
        lists: res.data.data.content
      }
      return result;
    });
  }

  async getJennieFitAssignmentsItem(search): Promise<HandsomeJennieFitAssignmentModel> {
    return axiosHandsomeInstance.get(`/api/jennie-fit-assignments/detail/${search}`).then(res => {
      return res.data.data;
    });
  }

  async getJennieFitAssignmentsUrgency(search): Promise<HandsomeJennieFitAssignments> {
    const params = {};

    if (search.size != null) {
      params['size'] = search.size;
    }
    if (search.page != null) {
      params['page'] = search.page;
    }
    if (search.jennieFitAssignStatus != "") {
      params['jennieFitAssignStatus'] = search.jennieFitAssignStatus;
    }

    if(search.id != null){
      params['id'] = search.id;
    }

    if(search.number){
      params['number'] = search.number;
    }


    return axiosHandsomeInstance.get('/api/jennie-fit-assignments/inspections/urgency', {params}).then(res => {
      const result: HandsomeJennieFitAssignments = {
        count: res.data.data.totalCount,
        lists: res.data.data.content
      }
      return result;
    });
  }

  async getJennieFitAssignmentsNormal(search): Promise<HandsomeJennieFitAssignments> {
    const params = {};

    if (search.size != null) {
      params['size'] = search.size;
    }
    if (search.page != null) {
      params['page'] = search.page;
    }
    if (search.jennieFitAssignStatus != "") {
      params['jennieFitAssignStatus'] = search.jennieFitAssignStatus;
    }

    if(search.id != null){
      params['id'] = search.id;
    }

    if(search.number){
      params['number'] = search.number;
    }
    return axiosHandsomeInstance.get('/api/jennie-fit-assignments/inspections/normal', {params}).then(res => {
      const result: HandsomeJennieFitAssignments = {
        count: res.data.data.totalCount,
        lists: res.data.data.content
      }
      return result;
    });
  }

  async getJennieFitAssignmentsStatus(): Promise<HandsomeJennieFitStatus[]> {
    let url = `/api/jennie-fit-assignments/summary`
    return axiosHandsomeInstance.get(url).then(res => {
      return res.data.data;
    });
  }

  async getJennieFitUnAssignProduct(data): Promise<HandsomeJennieFitAssignments> {
    const params = {
      page: data.page,
      size: data.size,
      productId: data.productId,
      brandId: data.brandId
    }

    if(data.number){
      params['number'] = data.number
    }
    return axiosHandsomeInstance.get(`/api/jennie-fit-assignments/unassigned`, {params}).then(res => {
      const result: HandsomeJennieFitAssignments = {
        count: res.data.data.totalCount,
        lists: res.data.data.content
      }
      return result;
    });
  }

  async getJennieFitAssignProduct(data): Promise<HandsomeJennieFitAssignments> {
    const params = {
      page: data.page,
      size: data.size,
      productId: data.productId,
      brandId: data.brandId,
      number: data.number
    }
    return axiosHandsomeInstance.get(`/api/jennie-fit-assignments/assigned`, {params}).then(res => {
      const result: HandsomeJennieFitAssignments = {
        count: res.data.data.totalCount,
        lists: res.data.data.content
      }
      return result;
    });
  }

  async getJennieFitAssignProductWithWorker(data): Promise<any> {
    const params = {
      page: data.page,
      size: data.size,
      workerId : data.workerId
    }
    console.log('prarms --> ', params)
    return axiosHandsomeInstance.get(`/api/jennie-fit-assignments/${data.workerId}`, {params}).then(res => {
      return res.data.data;
    });
  }

  async postJennieFitReassign(worker, data): Promise<number> {
    return axiosHandsomeInstance.post(`/api/jennie-fit-assignments/re-assign/${worker}`, data).then(res => {
      return res.status;
    });
  }

  async postJennieFitAssignment(worker, data): Promise<number> {
    return axiosHandsomeInstance.post(`/api/jennie-fit-assignments/assign/${worker}`, data).then(res => {
      return res.data.code;
    });
  }


  async postWorkStatusUnworkable(data) {
    return axiosHandsomeInstance.post('/api/jennie-fit-assignments/un-workable', data).then(res => {
      return res.status;
    });
  }

  async postWorkStatusRequested(data) {
    return axiosHandsomeInstance.post('/api/jennie-fit-assignments/requested', data).then(res => {
      return res.status;
    });
  }

  async putItemStatusApproval(data) {
    return axiosHandsomeInstance.put('/api/jennie-fit-assignments/status/approval', data).then(res => {
      return res.status;
    });
  }

  async putItemStatus(data) {
    return axiosHandsomeInstance.put('/api/jennie-fit-assignments/status/reject', data).then(res => {
      return res.status;
    });
  }

  async patchWorkStatus(data, status) {
    return axiosHandsomeInstance.patch(`/services/product/api/jennie-fit-assignments/work-status/${status}`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      }
    }).then(res => {
      return res.status;
    });
  }

  async getJennieFitPreviewImageUrl(putOnImageUrl): Promise<string> {
    const params = {};
    params['putOnImageUrl'] = putOnImageUrl

    return axiosHandsomeInstance.get(`/api/products/preview-image`, {params}).then(res => {
      console.log('imageProcessing res', res.data.data.putOnPreviewImageUrl);
      return res.data.data.putOnPreviewImageUrl;
    }).catch(reason => {
      console.log('imageProcessing err', reason);
      return '';
    });
  }

  async downloadThumbnailImage(productId): Promise<any> {
    const headers = {
      'accessToken': window.localStorage.getItem('handsomeAccessToken'),
      'Accept': '*/*'
    }
    return axios({
      url: `${endPointConfig.styleBotHandsome}/api/products/${productId}/file/main-image`,
      method: 'GET',
      responseType: 'blob',
      headers: headers
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Thumbnail.jpg`)
      document.body.appendChild(link)
      link.click()
    })
  }
}

export const jennieFitProductAssignmentApi = new JennieFitProductAssignmentApi();