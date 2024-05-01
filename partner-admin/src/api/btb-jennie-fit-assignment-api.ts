import axiosProductInstance from "../plugins/axios-product-instance";

class BtbJennieFitAssignmentApi {
    async postJennieFit(data) {
        return axiosProductInstance.post(`api/jennie-fit-assignments`, data).then(res => {
            return res.status
        }).catch((err)=>{
            console.log(err)
        });
    }
}

export const btbJennieFitAssignmentApi = new BtbJennieFitAssignmentApi();