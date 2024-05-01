import axiosInstance from "../plugins/axios-instance";
import {BrandCategoryModel, BrandModel, BrandsModel} from "../types/brand-model";
import axiosBtbInstance from "../plugins/axios-btb-instance";

class BrandApi {
    async getBrandsList(search): Promise<BrandsModel> {
        const params = {
            size: search.size,
            page: search.page,
        }

        if (search.brandName) {
            params['nameEn.equals'] = search.brandName;
        }

        if (search.activated != null) {
            params['activated.equals'] = search.activated;
        }

        if (search.startDate) {
            params['startDate.greaterThanOrEqual'] = new Date(search.startDate);
        }

        if (search.endDate) {
            params['endDate.lessThanOrEqual'] = new Date(search.endDate);
        }

        if (search.keywords) {
            params['keywordId.in'] = search.keywords;
        }

        return axiosInstance.get(`/services/product/api/brands/admin`, {params}).then(res => {
            const result: BrandsModel = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return result;
        });
    }

    async getSearchBrands(search): Promise<BrandsModel> {
        const params = {
            size: search.size,
            page: search.page,
        }

        if (search.brandName) {
            params['nameEn.contains'] = search.brandName;
        }

        if (search.activated) {
            params['activated.equals'] = search.activated;
        }

        if (search.keywords) {
            params['keywordId.in'] = search.keywords;
        }

        return axiosInstance.get(`/services/product/api/brands/admin`, {params}).then(res =>  {
            const brandResult: BrandsModel = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            }
            return brandResult;
        });
    }
    // @ts-ignore
    async postNewBrand(data: BrandModel): Promise<number> {
        const params = {
            nameKo: data.nameKo,
            nameEn: data.nameEn,
            keywordIds: data.keywords,
            bannerImageUrl: data.bannerImageUrl,
            logoImageUrl: data.logoImageUrl,
            thumbnailImageUrl: data.thumbnailImageUrl,
        }
        return axiosInstance.post(`/services/product/api/brands/admin`, params).then(res => {
            return res.status;
        });
    }

    async putBrand(data: BrandModel, id: number): Promise<{ code: number; data: any }> {
        const params = {
            id: data.id,
            nameKo: data.nameKo,
            nameEn: data.nameEn,
            keywordIds: data.keywords,
            bannerImageUrl: data.bannerImageUrl,
            logoImageUrl: data.logoImageUrl,
            thumbnailImageUrl: data.thumbnailImageUrl,
        }

        return axiosInstance.put(`/services/product/api/brands/admin/${id}`, params).then(res => {
            const result = {data: res.data, code: res.status}
            console.log(result)
            return result;
        });
    }

    async getBrandCategory(params): Promise<BrandCategoryModel[]> {
        return axiosInstance.get(`/services/product/api/brand-categories`, {params}).then(res => {
            return res.data;
        });
    }

    async changeActiveStatus(list) {
        return axiosInstance.put(`/services/product/api/brands/admin/activate`, list).then((res) => {
            if (res.status == 200) {
                if (res.data.failId != null) {
                    return `${res.data.failMessage}`;
                } else {
                    return `선택하신 브랜드가 진열중 처리되었습니다.`
                }
            } else if (res.status == 500) {
                return '처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.'

            }
        })
    }

    async changeInactiveStatus(list) {
        return axiosInstance.put(`/services/product/api/brands/admin/inactivate`, list).then((res) => {
            if (res.status == 200) {
                if (res.data.failId != null) {
                    return `${res.data.failMessage}`;
                } else {
                    return `선택하신 브랜드가 진열중지 처리되었습니다.`
                }
            } else if (res.status == 500) {
                return '처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.'

            }
        })
    }

    //home 개편관련 브랜드 순서 업데이트 api
    async getBrandUpdateList() : Promise<any> {
        return axiosInstance.get(`/services/product/api/brands/new/all`,).then((res) => {
            return res.data
        })
    }

    async putBrandUpdateList(data) : Promise<number>{
        return axiosInstance.put(`/services/product/api/brands/new`, data).then((res)=>{
            console.log('put brand update list', res)
            return res.status
        })
    }

    async getMallBrands(mallId) {
        const params = { mallId: mallId}
        return axiosBtbInstance.get(`api/mall/brand/names`, {params}).then((res) =>{
            return res
        })
    }
}

export const brandApi = new BrandApi();
