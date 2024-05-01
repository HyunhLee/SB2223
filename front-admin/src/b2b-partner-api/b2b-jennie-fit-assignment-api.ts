import axiosBtbInstance from "../plugins/axios-btb-instance";
import moment from "moment";
import {BtbJennieFitWorkerModel, BtbJennieFitWorkersWorks} from "../types/b2b-partner-model/b2b-jennie-fit-worker-model";
import {
    AssignProductModel,
    BtbAssignmentModel,
    BtbJennieFitAssignments
} from "../types/b2b-partner-model/b2b-jennie-fit-assignment-model";


class BtbJennieFitAssignmentApi {
    async getJennieFitUnAssignedProducts(data) {
        const params = {
            page: data.page,
            size: data.size,
        }
        if (data.productId) {
            params['productId.equals'] = data.productId;
        }
        if (data.productName) {
            params['productName.contains'] = data.productName;
        }
        if (data.categoryIds) {
            params['categoryId.equals'] = data.categoryIds;
        }
        if (data.maleCategoryIds) {
            params['categoryId.equals'] = data.maleCategoryIds;
        }
        if (data.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(data.startDate.setHours(0, 0, 0,0));
        }
        if (data.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(data.endDate.setHours(23, 59, 59 ,59));
        }

        if (data.registrationType) {
            params['registrationType.equals'] = data.registrationType;
        }

        if(data.jennieFitAssignmentStatus){
            params['jennieFitAssignmentStatus.in'] = data.jennieFitAssignmentStatus;
        }

        if (data.sort) {
            params['sort'] = data.sort;
        }

        return axiosBtbInstance.get(`/api/jennie-fit-assignments/unassigned`, {params}).then((res) => {
            const result: BtbJennieFitAssignments = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        })
    }

    async getJennieFitReAssignedProducts(data) : Promise<BtbJennieFitAssignments>{
        const params = {
            page: data.page,
            size: data.size,
        }
        if (data.productId) {
            params['productId.equals'] = data.productId;
        }
        if (data.productName) {
            params['productName.contains'] = data.productName;
        }
        if (data.categoryIds) {
            params['categoryId.equals'] = data.categoryIds;
        }
        if (data.maleCategoryIds) {
            params['categoryId.equals'] = data.maleCategoryIds;
        }
        if (data.startDate) {
            params['createdDate.greaterThanOrEqual'] = new Date(data.startDate.setHours(0, 0, 0,0));
        }
        if (data.endDate) {
            params['createdDate.lessThanOrEqual'] = new Date(data.endDate.setHours(23, 59, 59 ,59));
        }

        if (data.jennieFitAssignmentStatus) {
            params['jennieFitAssignmentStatus.equals'] = data.jennieFitAssignmentStatus;
        }

        if (data.assignmentMultiStatus) {
            params['jennieFitAssignmentStatus.in'] = data.assignmentMultiStatus;
        }
        if (data.registrationType) {
            params['registrationType.equals'] = data.registrationType;
        }
        if (data.workerId) {
            params['workerId.equals'] = data.workerId;
        }
        if (data.priorityType) {
            params['priorityType.equals'] = data.priorityType;
        }

        if (data.sort) {
            params['sort'] = data.sort;
        }

        return axiosBtbInstance.get(`/api/jennie-fit-assignments/assigned`, {params}).then((res) => {
            console.log(res, 'product list for reassign')
            const result: BtbJennieFitAssignments = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        })
    }

    async getJennieFitAssignmentWorkers(data): Promise<BtbJennieFitWorkersWorks[]> {
        const workDayFrom = moment(data.workDayFrom).format('YYYYMMDD');
        const workDayTo = moment(data.workDayTo).format('YYYYMMDD');
        let url = `/api/jennie-fit-assignments/summary/${workDayFrom}/${workDayTo}`
        if (data.workerId) {
            url = `${url}/${data.workerId}`
        } else {
            url = `${url}/0`
        }
        return axiosBtbInstance.get(url, null).then(res => {
            return res.data;
        })
    }

async getJennieFitAssignmentWorkerList(data) : Promise<BtbJennieFitWorkerModel[]>{
        const params = {}

        if (data.workType) {
            params['workType'] = data.workType;
        }

        return axiosBtbInstance.get(`/api/jennie-fit-workers`, {params})
            .then((res) => {
                return res.data
            })
    }

    async getJennieFitAssignmentWorkersWorkList(data) : Promise<BtbAssignmentModel[]>{
        const params = {
            size: data.size,
            page: data.page
        }
        if (data.workDayFrom) {
            params['workStartDay.greaterThanOrEqual'] = new Date(data.workDayFrom.setHours(0, 0, 0,0));
        }
        if (data.workDayTo) {
            params['workStartDay.lessThanOrEqual'] = new Date(data.workDayTo.setHours(23, 59, 59 ,59));
        }
        if (data.jennieFitAssignmentStatus === 'Unworkable') {
            params['jennieFitAssignmentStatus.notIn'] = 'Unworkable'
        }
        if (data.jennieFitAssignmentStatus !== 'Unworkable') {
            params['jennieFitAssignmentStatus.in'] = data.jennieFitAssignmentStatus
        }
        if (data.id) {
            params['id.equals'] = data.id;
        }
        if (data.productId) {
            params['productId.equals'] = data.productId;
        }
        if (data.categoryIds) {
            params['categoryId.equals'] = data.categoryIds;
        }
        if (data.maleCategoryIds) {
            params['categoryId.equals'] = data.maleCategoryIds;
        }
        if (data.assignmentMultiStatus) {
            params['jennieFitAssignmentStatus.in'] = data.assignmentMultiStatus;
        }
        if (data.registrationType) {
            params['registrationType.equals'] = data.registrationType;
        }
        if (data.workerId) {
            params['workerId.equals'] = data.workerId;
        }
        if (data.priorityType) {
            params['priorityType.equals'] = data.priorityType;
        }
        if (data.sort) {
            params['sort'] = data.sort;
        }

        return axiosBtbInstance.get(`/api/jennie-fit-assignments`, {params}).then((res) => {
            console.log(res, 'product data')
            return res.data
        })
    }

    async getJennieFitInspectionList(data){
        const params = {
            page: data.page,
            size: data.size,
        }
        if (data.id) {
            params['id.equals'] = data.id;
        }
        if (data.productId) {
            params['productId.equals'] = data.productId;
        }
        if (data.categoryIds) {
            params['categoryId.equals'] = data.categoryIds;
        }
        if (data.maleCategoryIds) {
            params['categoryId.equals'] = data.maleCategoryIds;
        }
        if (data.startDate) {
            params['workStartDay.greaterThanOrEqual'] = new Date(data.startDate.setHours(0, 0, 0,0));
        }
        if (data.endDate) {
            params['workStartDay.lessThanOrEqual'] = new Date(data.endDate.setHours(23, 59, 59 ,59));
        }
        if (data.jennieFitAssignmentStatus) {
            params['jennieFitAssignmentStatus.equals'] = data.jennieFitAssignmentStatus;
        }
        if (data.brandId) {
            params['brandId.equals'] = data.brandId;
        }
        if (data.brandName) {
            params['brandName.equals'] = data.brandName;
        }

        if (data.registrationType) {
            params['registrationType.equals'] = data.registrationType;
        }
        if (data.workerId) {
            params['workerId.equals'] = data.workerId;
        }
        if (data.priorityType) {
            params['priorityType.equals'] = data.priorityType;
        }
        if (data.sort) {
            params['sort'] = data.sort;
        }

        return axiosBtbInstance.get(`/api/jennie-fit-assignments`, {params}).then((res) => {
          const result: BtbJennieFitAssignments = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        })
}

    async putJennieFitAssignmentRequest(data) {
        const params = {
            ...data
        }

        return axiosBtbInstance.put(`/api/jennie-fit-assignments/request/${data.id}`, params).then((res) => {
            return res
        })
    }

    async putJennieFitAssignmentUnWorkable(data) {
        const params = {
            ...data
        }

        return axiosBtbInstance.put(`/api/jennie-fit-assignments/unworkable/${data.id}`, params).then((res) => {
            return res.status
        })
    }

    async patchJennieFitInspectionStatus(data){
        const params = {
            ...data
        }
        return axiosBtbInstance.patch(`/api/jennie-fit-assignments/inspection`, params).then((res) => {
            return res.status
        })
    }

    async patchJennieFitAssignment(data): Promise<AssignProductModel> {
        return axiosBtbInstance.patch(`/api/jennie-fit-assignments/assign`, data).then(res => {
            return res.data;
        });
    }

    async patchJennieFitReassign(data): Promise<AssignProductModel> {
        return axiosBtbInstance.patch(`/api/jennie-fit-assignments/reassign`, data).then(res => {
            return res.data;
        });

    }
}

export const btbJennieFitProductAssignmentApi = new BtbJennieFitAssignmentApi();
