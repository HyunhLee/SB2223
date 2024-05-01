export interface StyleRecommends {
	count: number;
	lists: StyleRecommend[];
}

export interface StyleRecommend {
	id?: number;
	activated: boolean;
	imageUrlList: ImageUrlList[];
	items: Items[];
	lookBookImageUrl: string;
	lookBookImage: lookBookImage[];
	registerType: string;
	seasonTypes: string;
	tasteCode: string;
	tpoType: string;
	createdBy?: string;
	createdDate?: string;
	lastModifiedBy?: string;
	lastModifiedDate?: string;
	loaded?: boolean;
}

interface ImageUrlList {
	imageUrl: string;
	categoryId: number;
}

interface lookBookImage {
	imageUrl: string;
	categoryId: number;
}

interface Items {
	id?: number;
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
