import axiosHandsomeInstance from "../plugins/axios-handsome-instance";
import {
  HandsomeJennieFitUserModel,
} from "../types/handsome-model/handsome-jennie-fit-worker-model";

class JennieFitWorkerApi {
  async getJennieFitWorkers(): Promise<HandsomeJennieFitUserModel[]> {
    return axiosHandsomeInstance.get(`/api/users/workers`, ).then(res => {
      return res.data.data;
    });
  }
}

export const jennieFitWorkerApi = new JennieFitWorkerApi();
