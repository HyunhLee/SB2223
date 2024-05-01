export interface StyleRecommends {
	count: number;
	lists: StyleRecommend[];
}

export interface StyleRecommend {
	id?: number;
	activated: boolean;
	imageUrlList: ImageUrlList[];
	items: Items[];
	registerType: string;
	seasonTypes: string;
	createdBy?: string;
	createdDate?: string;
	lastModifiedBy?: string;
	lastModifiedDate?: string;
	loaded?: boolean;
	gender: string;
}

interface ImageUrlList {
	productColorId: number;
	imageUrl: string;
	categoryId: number;
	categoryType: string;
	imageOrder: number;
	putOnImageUrl: string;
}

interface Items {
	id?: number;
	productColorId: number;
	fitOrder?: number;
	category1: number;
	category2: number;
	category3: number;
	category4: number;
	category5: number;
	colorType: string;
	patternType: string;
	key?: string;
}

export interface StyleRecommendStatus {
	winterLow: number
	feminine: number
	dandy: number
	springHigh: number
	office: number
	winterHigh: number
	fallHigh: number
	total: number
	traditional: number
	modern: number
	springLow: number
	summerLow: number
	casual: number
	unique: number
	fallLow: number
	basic: number
	summerHigh: number
}

export interface StyleRecommendationModel {
	count: number;
	lists: StyleRecommendation[];
}

export interface StyleRecommendation{
	id: number;
	categoryName : string;
	createdDate: Date;
	items: [];
	brandKeywords: [];
	lookBookImageUrl: string;
	styleId: number;
	companyName: string;
	brandName: string;
	seasonType: string;
	imageUrlList: [];
	styleKeyword: string;

}

export interface StyleRecommendationSearch{
	id: number;
	categories : number[];
	categoryId :  string;
	categoryName : string;
	femaleCategoryName: string;
	maleCategoryName: string;
	maleCategoryId : string;
	femaleCategoryId: string;
	colorType: string;
	patternType: string;
	styleId: number;
	startDate: any;
	endDate: any;
	mallId: any[];
	brandId:  any[];
	styleKeyword: string;
	registerType: string;
	seasonType: string;
	size: number;
	page: number;
	keywords: any[];
	seasonTypesList: any;
	styleKeywordsList: any[];
	gender : string;

	category1?: number;
	category2?:  number;
	category3?:  number;
	category4?: number;
	category5?:  number;

}

export const defaultSearch = () => {
	return {
		id: null,
		page: 0,
		size: 10,
		categories: [],
		categoryId : '',
		femaleCategoryId : '',
		maleCategoryId : '',
		categoryName: '',
		femaleCategoryName: '',
		maleCategoryName: '',
		registerType: '',
		seasonType: '',
		seasonTypesList: [],
		colorType: '',
		patternType: '',
		styleId: null,
		startDate: null,
		endDate: null,
		mallId: [],
		brandId: [],
		styleKeyword: '',
		styleKeywordsList: [],
		keywords: [],
		gender: ''
	}
}