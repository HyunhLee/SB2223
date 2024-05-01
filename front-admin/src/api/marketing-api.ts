import {Def} from "../types/marketing-model/marketing-model";
import moment from "moment-timezone";
import axiosBtbInstance from "../plugins/axios-btb-instance";

class MarketingApi {
    async getClick(search): Promise<Def> {
        const params = {};

        if (search.mallId) {
            params['mallId'] = search.mallId;
        }
        if (search.brandId) {
            params['brandId'] = search.brandId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/products/click/aggregate', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getProduct(search) {
        const params = {};

        if (search.sort) {
            params['clickOrder'] = search.sort == 'desc';
        }
        if (search.page || search.page == 0) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.userId) {
            params['userId'] = search.userId;
        }
        if (search.productId) {
            params['productId'] = search.productId;
        }
        if (search.productNo) {
            params['productNo'] = search.productNo;
        }
        if (search.name) {
            params['productName'] = search.name;
        }
        if (search.mallId) {
            params['mallId'] = search.mallId;
        }
        if (search.categoryId) {
            params['categoryId'] = search.categoryId;
        }
        if (search.brandId) {
            params['brandId'] = search.brandId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get('/api/products/click/detail/aggregate', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getStyle(search): Promise<Def> {
        const params = {};

        if (search.mallId) {
            params['mallId'] = search.mallId;
        }
        if (search.brandId) {
            params['brandId'] = search.brandId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get('/api/user-style/aggregate', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getStyleProduct(search) {
        const params = {};

        if (search.sort && search.sort != 'i') {
            params['sort'] = search.sort;
        }
        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.userLogin) {
            params['userLogin'] = search.userLogin;
        }
        if (search.styleId) {
            params['styleId'] = search.styleId;
        }
        if (search.productId) {
            params['productId'] = search.productId;
        }
        if (search.productNo) {
            params['productNo'] = search.productNo;
        }
        if (search.productName) {
            params['productName'] = search.productName;
        }
        if (search.mallId) {
            params['mallId'] = search.mallId;
        }
        if (search.closetCategoryId) {
            params['closetCategoryId'] = search.closetCategoryId;
        }
        if (search.brandId) {
            params['brandId'] = search.brandId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get('/api/user-style/aggregate/detail', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getDetail(search): Promise<Def> {
        const params = {};

        if (search.mallId) {
            params['mallId'] = search.mallId;
        }
        if (search.brandId) {
            params['brandId'] = search.brandId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/products/detail-click-history/aggregate', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getDetailProduct(search) {
        const params = {};

        if (search.sort && search.sort != 'c') {
            params['sort'] = search.sort;
        }
        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.productId) {
            params['productId'] = search.productId;
        }
        if (search.productNo) {
            params['productNo'] = search.productNo;
        }
        if (search.productName) {
            params['productNameKo'] = search.productName;
        }
        if (search.mallId) {
            params['mallId'] = search.mallId;
        }
        if (search.categoryId) {
            params['categoryId'] = search.categoryId;
        }
        if (search.brandId) {
            params['brandId'] = search.brandId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get('/api/products/detail-click-history/aggregate/detail', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getCartAmountChartData(search) {
        const params = {};

        if (search.mallId) {
            params['mallId'] = search.mallId;
        }

        if (search.brandId) {
            params['brandId'] = search.brandId;
        }

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }

        if(search.endDate){
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get(`/api/cart/mall/${search.mallId}`, {params}).then((res) =>{
            return res.data
        }).catch((err) =>{
            console.log(err)
        })
    }

    async getCartAmountData(search) {
        const params = {};

        if(search.mallId){
            params['mallId'] = search.mallId;
        }
        if(search.brandId){
            params['brandId'] = search.brandId;
        }
        if (search.sort == 'LowestPrice') {
            params['sort'] = 'priceNormal,asc'
        }else if(search.sort == 'HighestPrice'){
            params['sort'] = 'priceNormal,desc'
        }else if(search.sort == 'Popular'){
            params['sort'] ='salesCount,desc'
        }
        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }

        if(search.productName){
            params['productName'] = search.productName;
        }

        if(search.productId){
            params['productId'] = search.productId;
        }

        if(search.productNo){
            params['productNo'] = search.productNo;
        }

        if(search.categoryId){
            params['closetCategoryId'] = search.categoryId;
        }

        if(search.minPrice){
            params['minPrice'] = search.minPrice;
        }

        if(search.maxPrice){
            params['maxPrice'] = search.maxPrice;
        }

        if(search.startDate){
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }

        if(search.endDate){
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }


        return axiosBtbInstance.get(`/api/cart/mall/${search.mallId}/detail`, {params}).then((res) =>{
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch((err) =>{
            return err;
        })

    }

    async getCartPurchaseChartData(search){
        const params = {};

        if(search.mallId){
            params['mallId'] = search.mallId;
        }

        if(search.brandId){
            params['brandId'] = search.brandId;
        }

        if(search.startDate){
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }

        if(search.endDate){
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get(`/api/batch-cart-sales/sum`, {params}).then((res) =>{
            return res.data
        }).catch((err) =>{
            console.log(err)
        })
    }

    async getCartPurchaseData(search) {
        const params = {};

        if(search.mallId){
            params['mallId'] = search.mallId;
        }
        if(search.brandId){
            params['brandId'] = search.brandId;
        }
        if (search.sort == 'LowestPrice') {
            params['sort'] = 'priceNormal,asc'
        }else if(search.sort == 'HighestPrice'){
            params['sort'] = 'priceNormal,desc'
        }else if(search.sort == 'Popular'){
            params['sort'] ='salesCount,desc'
        }
        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }

        if(search.productName){
            params['productName'] = search.productName;
        }

        if(search.productId){
            params['productId'] = search.productId;
        }

        if(search.productNo){
            params['productNo'] = search.productNo;
        }

        if(search.categoryId){
            params['categoryId'] = search.categoryId;
        }

        if(search.minPrice){
            params['minPrice'] = search.minPrice;
        }

        if(search.maxPrice){
            params['maxPrice'] = search.maxPrice;
        }

        if(search.startDate){
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD');
        }

        if(search.endDate){
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD');
        }

        return axiosBtbInstance.get(`/api/batch-cart-sales`, {params}).then((res) =>{
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };

            return result;
        }).catch((err) =>{
            return err;
        })
    }

    async getUser(search): Promise<Def> {
        const params = {};

        if(search.mallId){
            params['mallId'] = search.mallId;
        }
        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get(`/api/cafe24/user/mall/${search.mallId}/count`, {params}
        ).then(res => {
            const result = {
                // count: Number(res.headers['x-total-count']),
                count: res.data.length,
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getUserInfo(search) {
        const params = {};

        if(search.mallId){
            params['mallId'] = search.mallId;
        }
        if (search.page) {
            params['page'] = search.page;
        }
        if (search.size) {
            params['size'] = search.size;
        }
        if (search.userId) {
            params['userId'] = search.userId;
        }
        if (search.startDate) {
            const start = moment(search.startDate).hours(15).minutes(0).seconds(0);
            params['startDate'] = moment(start).subtract(1,'days').format();
        }
        if (search.endDate) {
            const end = moment(search.endDate).hours(15).minutes(0).seconds(0);
            params['endDate'] = moment(end).format();
        }

        return axiosBtbInstance.get(`/api/cafe24/user/mall/${search.mallId}`, {params}
        ).then(res => {
            const result = {
                // count: Number(res.headers['x-total-count']),
                count: res.data.length,
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getClickAll(search): Promise<Def> {
        const params = {};

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/products/click/malls/aggregate', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getStyleAll(search): Promise<Def> {
        const params = {};

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/user-style/aggregate/top3', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getDetailAll(search): Promise<Def> {
        const params = {};

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/products/detail-click-history/aggregate/all', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getCartAll(search): Promise<Def> {
        const params = {};

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/cart/aggregate/top3', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getSaleAll(search): Promise<Def> {
        const params = {};

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/batch-cart-sales/aggregate/top3', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }

    async getUserAll(search): Promise<Def> {
        const params = {};

        if (search.startDate) {
            params['startDate'] = moment(search.startDate).format('YYYY-MM-DD')
        }
        if (search.endDate) {
            params['endDate'] = moment(search.endDate).format('YYYY-MM-DD')
        }

        return axiosBtbInstance.get('/api/cafe24/user/aggregate', {params}
        ).then(res => {
            const result = {
                count: Number(res.headers['x-total-count']),
                lists: res.data
            };
            return result;
        }).catch(err => {
            return err;
        });
    }
}

export const marketingApi = new MarketingApi();