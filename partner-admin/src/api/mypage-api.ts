import {
    AccountDetail,
    BrandBusinessDetail, BrandDetail,
    defaultBrandDetail,
    defaultBusinessDetail
} from "../types/account-model";
import axiosPartnerInstance from "../plugins/axios-partner-instance";

class MypageApi {
    //마이페이지 계정정보 가져오기
    async getAccountInfo(data): Promise<AccountDetail> {
        return axiosPartnerInstance.get(`/api/user/profile`).then((res) => {
            return res.data;
        }).catch((err) => {
            return err;
        });

    }


    async getB2bPlanInfo(data){
        const params = {};
        if(data) {
            params['mallId'] = data
        }
        return axiosPartnerInstance.get(`/api/mall`, {params}).then((res) => {
            return res.data
        }).catch((err) => {
            console.log(err)
        })
    }







    //마이페이지 사업자 정보 가져오기
    async getBusinessInfo(params): Promise<BrandBusinessDetail> {
        //로그인한 사람의 아이디를 보내서 정보 받아오기
        // return axiosInstance.get(``, {params}).then((res) => {
        //     console.log(res)
        // })
        return defaultBusinessDetail;
    }

    //마이페이지 브랜드정보 가져오기
    async getBrandInfo(params) : Promise<BrandDetail> {
        //로그인한 사람의 계정아이디? mall아이디를 보내서 정보 받아오기 ??
        // return axiosInstance.get(``, {params}).then((res) => {
        //     console.log(res)
        // })

        //default brandInfo
        return defaultBrandDetail
    }

    //마이페이지 브랜드 정보 수정
    async putBrandInfo(params) : Promise<BrandDetail>{
        console.log('저장!')
        return;
    }

    async postNewPassword(params){
        let result = 200
        console.log('비밀번호 새로 저장')
        return result;
    }

}


export const mypageApi = new MypageApi();