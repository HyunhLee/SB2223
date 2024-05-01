import axiosInstance from "../plugins/axios-instance";
import {Customer} from "../types/customer";

class CustomerApi {
  async getAccounts(params): Promise<Array<Customer>> {
    return axiosInstance.get(`/services/member/api/customers`, {params}).then(res => {
      return res.data
    }).catch(error => {

    });
  }
}

export const customerApi = new CustomerApi();
