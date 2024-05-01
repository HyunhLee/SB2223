import { Products, ProductModel } from "src/types/product-model";
import axiosInstance from "../plugins/axios-instance";
import {useState} from "react";
import {JennieFitWorkers} from "../types/jennie-fit-worker-model";

class JennieFitWorkerApi {
  async getJennieFitWorkers(search): Promise<JennieFitWorkers> {
    const params = {}
    if (search.activated) {
      params['activated'] = search.activated;
    }
    if (search.workType) {
      params['workType'] = search.workType;
    }

    return axiosInstance.get(`/services/product/api/jennie-fit-workers`, {params}).then(res => {
      const result: JennieFitWorkers = {
        lists: res.data,
        count: (res.headers['x-total-count'] !== undefined) ? Number(res.headers['x-total-count']) : 0,
      }
      return result;
    });
  }
}

export const jennieFitWorkerApi = new JennieFitWorkerApi();
