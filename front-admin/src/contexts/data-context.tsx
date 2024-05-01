import React, {createContext, useContext, useEffect, useState} from 'react';
import {typeApi} from "../api/type-api";
import {brandApi} from "../api/brand-api";
import {handsomebrandApi} from "../handsome-api/brand-api";
import {useAuth} from "../hooks/use-auth";
import {productApi} from "../api/product-api";
import {handsomeTypeApi} from "../handsome-api/type-api";
import toast from "react-hot-toast";
import {userDressApi} from "../api/user-dress-api";
import {b2bPartnerMallApi} from "../b2b-partner-api/b2b-partner-mall-api";

const treeData = (items, parentLabel, ids, mapItem) => {
  items.map(item => {
    item.key = item.id;
    item.label = item.name;
    item.nodes = item.children;
    mapItem[item.id] = {
      id: item.id,
      name: item.name,
      path: (parentLabel == null) ? item.name : parentLabel + ' < ' + item.label,
      ids: (parentLabel == null) ? item.id : ids + '/' + item.id
    }
    item.parent = (parentLabel == null) ? item.label : parentLabel + ' < ' + item.label;
    item.ids = (parentLabel == null) ? item.id : ids + '/' + item.id;
    if (item.children && item.children.length > 0) {
      return treeData(item.children, item.parent, item.ids, mapItem);
    }
  })
  return items;
};

const mapData = (items, mapItem) => {
  items.map(item => {
    mapItem[item.id] = {
      ...item
    }
  })
  return mapItem;
};

const colorMapData = (items, mapItem) => {
  items.map(item => {
    mapItem[item.name] = {
      ...item
    }
  })
  return mapItem;
};

const colorRGB = () => {
  return {
    'WHITE': 'rgb(255, 255, 255)',
    'GREY': 'rgb(190, 190, 190)',
    'CHARCOAL': 'rgb(112, 112, 112)',
    'BLACK': 'rgb(0, 0, 0)',
    'IVORY': 'rgb(255, 255, 240)',
    'BEIGE': 'rgb(205, 180,140)',
    'SKY BLUE': 'rgb(159, 211, 255)',
    'BLUE': 'rgb(22, 1, 255)',
    'NAVY': 'rgb(6, 0, 140)',
    'BROWN': 'rgb(103, 51, 1)',
    'CAMEL': 'rgb(190, 126, 41)',
    'WINE': 'rgb(111, 0, 40)',
    'KHAKI': 'rgb(89,114, 72)',
    'LIGHT PINK': 'rgb(245, 219, 224)',
    'PINK': 'rgb(255, 153, 204)',
    'RED': 'rgb(255, 0, 2)',
    'ORANGE': 'rgb(252, 102, 0)',
    'SALMON': 'rgb(250,169,148)',
    'YELLOW': 'rgb(255, 241, 100)',
    'LAVENDER': 'rgb(214,191,254)',
    'PURPLE': 'rgb(151,1,203)',
    'MINT': 'rgb(162,248,202)',
    'LIGHT GREEN': 'rgb(167,216,64)',
    'GREEN': 'rgb(21,140,43)',
    'SILVER': 'linear-gradient(rgba(190,190,190), rgba(245,245,245), rgba(190,190,190))',
    'GOLD': 'linear-gradient(rgba(240,198,103), rgba(255,245,224), rgba(240,198,103))',
  }
}

const avatarHairColors = {
  DARK_BROWN:'다크브라운',
  BROWN:'브라운',
  ASH_BROWN:'애쉬 브라운',
  DECOLORIZATION:'탈색'
}
const assignStatus = {
  ASSIGNED:'배정됨',
  UNASSIGNED:'미배정',
  REQUESTED:'검수신청',
  REJECTED:'반려',
  COMPLETED:'승인완료',
  UNWORKABLE:'작업불가'
}

const assignStatusForSearch = {
  ASSIGNED:'배정됨',
  REQUESTED:'검수신청',
  REJECTED:'반려',
  COMPLETED:'승인완료',
  UNWORKABLE:'작업불가'
}



const aiAssignStatus = {
  ASSIGNED:'배정됨',
  REQUESTED:'검수신청',
  REJECTED:'반려',
  COMPLETED:'승인완료',
}

const avatarHairHasBangs = {
  true:'앞머리 있음',
  false:'앞머리 없음'
}

const avatarHairActivated = {
  true: '활성화',
  false: '비활성화'
}

const inspectionStatus = {
  PRE_COMPLETE:'1차 검수',
  REQUESTED:'검수요청',
  REJECTED:'반려',
  COMPLETED:'승인',
  NOT_APPLIED:'작업불가',
  IN_PROGRESS:'승인진행중',
  NOT_NECESSARY:'불필요'
}

const productInspectionStatus = {
  REQUESTED:'검수요청',
  COMPLETED:'승인',
  REJECTED:'반려',
}

const assignPriority = {
  NORMAL:'일반',
  URGENCY:'긴급'
}

const fittingOptions = {
  NORMAL : '수동등록',
  AI : 'AI 피팅'
}

const retail = {
  RETAIL:'O (일반상품)',
  DEFAULT:'X (디폴트아이템)'
}

const assignRejectReason = {
  AVATAR:'아바타 피팅결과',
  SCREEN:'화면을 찍은 이미지 불가',
  ORIGINAL:'original mask',
  WARP:'warp mask'
}

const registrationType = {
  // USER: 'USER',
  // AD: 'AD',
  // IR: 'IR'
  // MANUAL: '수동',
  // MANUAL_PARTNER: '파트너사이트',
  // AUTOMATIC: 'Cafe24, SellerHub 자동'

  MANUAL: '스타일봇 수동 등록',
  MANUAL_PARTNER: '파트너사 수동 등록',
  AUTOMATIC: '파트너사 자동 연동'
}

const displayStatus = {
  DISPLAY_ON: '진열중',
  DISPLAY_END: '진열중지',
  SOLD_OUT: '품절'
}

const soldoutDisplayStatus = {
  SOLD_OUT: 'Y',
  SALE: 'N'
}

const brandDisplayStatus = {
  ALL : '전체',
  DISPLAY_ON: '진열중',
  DISPLAY_END: '진열중지',
}

const season = {
  SPRING_LOW: 'SPRING_LOW',
  SPRING_HIGH: 'SPRING_HIGH',
  SUMMER_LOW: 'SUMMER_LOW',
  SUMMER_HIGH: 'SUMMER_HIGH',
  FALL_LOW: 'FALL_LOW',
  FALL_HIGH: 'FALL_HIGH',
  WINTER_LOW: 'WINTER_LOW',
  WINTER_HIGH: 'WINTER_HIGH',
}

const keywords = {
  LOVELY: '러블리',
  RETRO: '레트로',
  MANISH: '매니쉬',
  MODERN: '모던',
  SEXY: '섹시',
  SIMPLE_BASIC: '심플베이직',
  STREET: '스트릿',
  SPORTY: '스포티',
  AVANT_GARDE: '아방가르드',
  UNISEX: '유니섹스',
  CASUAL: '캐주얼',
  CONTEMPORARY: '컨템포러리',
  CLASSIC_LONG: '클래식',
  TOMBOY: '톰보이',
  PUNK: '펑크',
  FEMININE: '페미닌',
  FORMAL: '포멀',
  HIPPIE: '히피',
}

const b2bFemaleKeywords = {
  FEMININE: '페미닌',
  LOVELY: '러블리',
  SEXY: '섹시',
  MANNISH: '매니쉬',
  UNISEX: '유니섹스',
  CONTEMPORARY: '컨템포러리',
  MODERN: '모던',
  OFFICE: '오피스',
  SPORTY: '스포티',
  CASUAL: '캐주얼',
  VINTAGE: '빈티지',
  CLASSIC: '클래식',
  SIMPLE_BASIC: '심플베이직',
  UNIQUE: '유니크',
}

const b2bMaleKeywords = {
  MANNISH: '매니쉬',
  UNISEX: '유니섹스',
  CONTEMPORARY: '컨템포러리',
  MODERN: '모던',
  OFFICE: '오피스',
  SPORTY: '스포티',
  CASUAL: '캐주얼',
  VINTAGE: '빈티지',
  CLASSIC: '클래식',
  SIMPLE_BASIC: '심플베이직',
  UNIQUE: '유니크',
}

const productSeasonType = {
  SPRING: 'SPRING',
  SUMMER: 'SUMMER',
  FALL: 'FALL',
  WINTER: 'WINTER',

}

const userDressRegistrationType = {
  USER: '일반 유저',
  ADMIN: '스타일봇 내부직원',
  ADMIN_DD: '데이터 디자이너',
  AUTOMATIC: '개발팀 수동등록',
  AUTOMATIC_CLOSET: 'AUTOMATIC_CLOSET',
  AUTOMATIC_LEARNING: 'AUTOMATIC_LEARNING'
}

const fitRequestStatus = {
  REQUESTED:'작업요청',
  REJECTED:'반려',
  COMPLETED:'작업완료',
  NOT_APPLIED:'작업불가',
  IN_PROGRESS:'작업중',
  PRE_COMPLETE:'검수요청',
}

const handsomeJennieFitRequestStatus = {
  UNREQUESTED : '작업 미신청',
  REQUESTED : '작업 신청'
}

const handsomeJennieFitAssignStatus = {
  ALL : '전체',
  UNASSIGNED : '미배정',
  ASSIGNED : '배정',
  REQUESTED : '검수요청',
  REJECTED :'반려',
  COMPLETED : '검수완료',
  UNWORKABLE : '작업불가'
}

const handsomeBrandDisplayStatus = {
  ALL : '전체',
  DISPLAY_ON: '진열중',
  DISPLAY_END: '진열중지',
}


const handsomeStyleLiveLevel = {
  ALL : '전체',
  ONE : '1',
  TWO : '2',
}

//////////////////B2B/////////////////////
const btbUnworkableReason = {
  WrongLink : '잘못된 링크',
  WrongAngle : '의상정면 식별불가',
  Lace : '시스루/레이스 의상',
  WrongCategory: '잘못된 카테고리',
  Etc: '기타'
}

const btbUnworkableReasonDetail = {
  WrongLink : '해당 제품에 대한 상세 페이지 주소가 맞는지 확인해주세요.',
  WrongAngle : '머리카락 또는 기타 신체부위에 의해 가려지지 않은 정면사진을 찾을 수 없습니다.',
  Lace : '신체가 비치는 의상은 작업이 불가능합니다.',
  WrongCategory: '의상에 맞는 올바른 카테고리로 수정해주세요.',
  Etc: ''
}



const btbRegistrationType = {
  All : '전체',
  ManualPartner: '파트너사 수동 등록',
  Automatic: '파트너사 자동 연동'
}

const btbFitAssignPriority = {
  Normal:'일반',
  Urgency:'긴급'
}

const btbFitAssignStatus = {
  All : '전체',
  Assigned:'배정됨',
  Unassigned:'미배정',
  Requested:'검수신청',
  Rejected:'반려',
  Completed:'승인완료',
  Unworkable:'작업불가'
}


const btbFitInspectionStatus = {
  Requested:'검수신청',
  Rejected:'반려',
  Completed:'승인완료',
}

const btbFitStatusForReassign = {
  All : '전체',
  Assigned:'배정됨',
  Requested:'검수신청',
  Rejected:'반려',
}

const btbFitProductSearchAssignStatus = {
  Assigned:'배정됨',
  // Unassigned:'미배정',
  Requested:'검수신청',
  Rejected:'반려',
  Completed:'승인완료',
  // Unworkable:'작업불가'
}

const btbCompanyStatus = {
  SCHEDULED : '운영 예정',
  OPERATION : '운영중',
  EXPIRED : '만료',
  DUETOEXPIRE: '만기 예정',
}

const btbPlanType = {
  FREE: 'FREE',
  LIGHT: 'LIGHT',
  BUSINESS: 'BUSINESS',
  ENTERPRISE: 'ENTERPRISE',
}

const sortList = {
  Popular : '인기순',
  LowestPrice: '낮은가격순',
  HighestPrice: '높은가격순',
}

const btbInquiryType = {
  PRODUCT : '상품',
  FITTING_ROOM : '피팅룸 서비스',
  SYSTEM_ERROR: '오류',
  FUNCTION_INQUIRY: '기능문의',
  SETTLEMENT : '정산',
  ETC : '기타',
}

const btbInquiryStatus = {
  OPEN : '답변대기',
  CLOSE : '답변완료'
  }

const faqType = {
  CAFE24: '카페24',
  PRODUCT: '상품',
  MARKETING: '마케팅',
  ETC: '기타'

}


const btbDefaultProductSeasonType = {
  SPRING: '봄',
  SUMMER: '여름',
  FALL: '가을',
  WINTER: '겨울',

}


const defaultValue = () => {
  return {
    CATEGORY: [],
    CATEGORY_MAP: {},
    FEMALE_CATEGORY: [],
    FEMALE_CATEGORY_MAP: {},
    MALE_CATEGORY: [],
    MALE_CATEGORY_MAP: {},
    COLOR: [],
    COLOR_MAP: {},
    PATTERN: [],
    PATTERN_MAP: {},
    TPO: [],
    TPO_MAP: {},
    STYLE: [],
    BRAND: [],
    BRAND_COUNT: {},
    BRAND_MAP: {},
    JENNIE_PRODUCT_BRAND: [],
    JENNIE_PRODUCT_BRAND_COUNT: {},
    JENNIE_PRODUCT_BRAND_MAP: {},
    HANDSOME_CATEGORY: [],
    HANDSOME_CATEGORY_MAP: {},
    HANDSOME_BRAND: [],
    HANDSOME_BRAND_MAP: {},
    JENNIEFIT: [],
    JENNIEFIT_MAP: {},
    JENNIEFIT_AI: [],
    JENNIEFIT_AI_MAP: {},
    BUCKET_URL_BRAND: [],
    BUCKET_URL_PRODUCT_MASK: [],
    BUCKET_URL_MAGAZINE: [],
    BUCKET_URL_EXHIBITION: [],
    BUCKET_URL_POPUP: [],
    BUCKET_URL_USER_MASK:[],
    B2B_MALL_BRANDS: [],
    B2B_MALL_BRANDS_MAP: {},
    B2B_MALE_MALL_BRANDS: [],
    B2B_MALE_MALL_BRANDS_MAP: {},
    B2B_FEMALE_MALL_BRANDS: [],
    B2B_FEMALE_MALL_BRANDS_MAP: {},
    CATEGORY_GROUP: [],
    MALL_BRAND:[],
    MALL: [],
    BUCKET_URL_MDPICK : [],
    AI_ASSIGN_STATUS: aiAssignStatus,
    ASSIGN_STATUS: assignStatus,
    ASSIGN_STATUS_FOR_SEARCH: assignStatusForSearch,
    PRODUCT_INSPECTION_STATUS : productInspectionStatus,
    INSPECTION_STATUS: inspectionStatus,
    ASSIGN_PRIORITY: assignPriority,
    ASSIGN_REJECT_REASON: assignRejectReason,
    REGISTRATION_TYPE: registrationType,
    SEASON: season,
    RETAIL: retail,
    FITTING_OPTIONS : fittingOptions,
    KEYWORDS : keywords,
    B2BKEYWORDS: b2bFemaleKeywords,
    B2BMALEKEYWORDS: b2bMaleKeywords,
    DISPLAY_STATUS: displayStatus,
    SOLD_OUT_STATUS : soldoutDisplayStatus,
    BRAND_DISPLAY_STATUS : brandDisplayStatus,
    USER_DRESS_REGISTRATION_TYPE: userDressRegistrationType,
    FIT_REQUEST_STATUS: fitRequestStatus,
    JENNIE_FIT_ASSIGN : handsomeJennieFitAssignStatus,
    JENNIE_FIT_REQUEST : handsomeJennieFitRequestStatus,
    HANDSOME_DISPLAY_STATUS : handsomeBrandDisplayStatus,
    PRODUCT_SEASON_TYPE : productSeasonType,
    AVATAR_HAIR_COLORS : avatarHairColors,
    AVATAR_HAIR_HAS_BANG : avatarHairHasBangs,
    AVATAR_HAIR_ACTIVATED : avatarHairActivated,
    HANDSOME_STYLE_LIVE_LEVEL : handsomeStyleLiveLevel,
    BTB_REGISTRATION_TYPE : btbRegistrationType,
    BTB_ASSIGN_PRIORITY : btbFitAssignPriority,
    BTB_ASSIGN_STATUS : btbFitAssignStatus,
    BTB_INSPECTION_STATUS : btbFitInspectionStatus,
    BTB_FIT_STATUS_REASSIGN : btbFitStatusForReassign,
    BTB_FIT_PRODUCT_STATUS : btbFitProductSearchAssignStatus,
    BTB_COMPANY_STATUS:btbCompanyStatus,
    BTB_PLAN_TYPE : btbPlanType,
    SORT_LIST : sortList,
    BTB_INQUIRY_TYPE: btbInquiryType,
    BTB_INQUIRY_STATUS:btbInquiryStatus,
    FAQ_TYPE: faqType,
    BTB_UNWORKABLE_REASON: btbUnworkableReason,
    BTB_UNWORKABLE_REASON_DETAIL: btbUnworkableReasonDetail,
    BTB_DEFAULT_PRODUCT_SEASON:btbDefaultProductSeasonType
  }
}

export const DataContext = createContext(defaultValue());

export const DataProvider =  ({ children }) => {

  const [dataContext, setDataContext] = useState(defaultValue());

  const auth = useAuth();

  const getTypes = async (type: string) => {
    const items = await typeApi.getCategoryTypes(type);
    if (!items) {
      return;
    }
    const mapItem = {};
    if (type === 'PRODUCT') {
      // 데이터 가공
      const treeItems = treeData(items, null, null, mapItem);
      setDataContext(Object.assign(dataContext, {'CATEGORY': treeItems}));
      setDataContext(Object.assign(dataContext, {'CATEGORY_MAP': mapItem}));
    } else if (type === 'COLOR') {
      const color = colorRGB();
      items.forEach(item => {
        item.rgb = (color[item.name]) ? color[item.name] : '255, 255, 255'
      })
      colorMapData(items, mapItem);
      setDataContext(Object.assign(dataContext, {[type]: items}));
      setDataContext(Object.assign(dataContext, {[type + '_MAP']: mapItem}));
    } else {
      mapData(items, mapItem);
      setDataContext(Object.assign(dataContext, {[type]: items}));
      setDataContext(Object.assign(dataContext, {[type + '_MAP']: mapItem}));
    }
  };

  const getKeywordList = async (type: string) => {
    const items = await typeApi.getStyleKeywords(type);
    if(!items){
      return;
    }
    const mapItem = {};
    if(type ==='STYLE'){
      mapData(items, mapItem);
      setDataContext(Object.assign(dataContext, {[type]: items}));
      setDataContext(Object.assign(dataContext, {[type + '_MAP']: mapItem}));
    }
  }

  const getFemaleCategories = async () => {
    const femaleCategories = await typeApi.getB2BCategoryTypes('F');

    const mapItem = {};
    const treeItems = treeData(femaleCategories, null, null, mapItem);
    setDataContext(Object.assign(dataContext, {'FEMALE_CATEGORY': treeItems}));
    setDataContext(Object.assign(dataContext, {'FEMALE_CATEGORY_MAP': mapItem}));

  }

  const getMaleCategories = async () => {
    const maleCategories = await typeApi.getB2BCategoryTypes('M');

    const mapItem = {};
    const treeItems = treeData(maleCategories, null, null, mapItem);
    setDataContext(Object.assign(dataContext, {'MALE_CATEGORY': treeItems}));
    setDataContext(Object.assign(dataContext, {'MALE_CATEGORY_MAP': mapItem}));

  }

  const getBrands = async () => {
    const result = await brandApi.getSearchBrands({size: 1000, page: 0});
    if (!result) {
      return;
    }
    const mapItem = {};
    mapData(result.lists, mapItem);
    setDataContext(Object.assign(dataContext, {BRAND: result.lists}));
    setDataContext(Object.assign(dataContext, {BRAND_COUNT: result.count}));
    setDataContext(Object.assign(dataContext, {BRAND_MAP: mapItem}));
  };

  const getHandsomeCategories = async () => {
    const handsomeAccessToken = window.localStorage.getItem('handsomeAccessToken')
    if(handsomeAccessToken){
      const result = await handsomeTypeApi.getHandsomeCategories();
      if(result.code == 200){
        const mapItem = {};
        const treeItems = treeData(result.data, null, null, mapItem);
        setDataContext(Object.assign(dataContext, {'HANDSOME_CATEGORY': treeItems}));
        setDataContext(Object.assign(dataContext, {'HANDSOME_CATEGORY_MAP': mapItem}));
      }else{
        return  toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
      }
    }else{
      return;
    }
  }

  const getHandsomeBrands = async () => {
    const handsomeAccessToken = window.localStorage.getItem('handsomeAccessToken')
    if(handsomeAccessToken){
      const result = await handsomebrandApi.getBrands({size: 10000, page: 0});
      if (!result) {
        return;
      }
      const mapItem = {};
      mapData(result.lists, mapItem);
      setDataContext(Object.assign(dataContext, {HANDSOME_BRAND: result.lists}));
      setDataContext(Object.assign(dataContext, {HANDSOME_BRAND_MAP: mapItem}));
    }
  };

  const getBucket = async () => {
    const result = await productApi.getProductBucket();
    if (!result) {
      return;
    }
    setDataContext(Object.assign(dataContext, {BUCKET_URL_BRAND: result.BUCKET_URL_BRAND}));
    setDataContext(Object.assign(dataContext, {BUCKET_URL_PRODUCT_MASK: result.BUCKET_URL_PRODUCT_MASK}));
    setDataContext(Object.assign(dataContext, {BUCKET_URL_MAGAZINE: result.BUCKET_URL_MAGAZINE}));
    setDataContext(Object.assign(dataContext, {BUCKET_URL_EXHIBITION: result.BUCKET_URL_EXHIBITION}));
    setDataContext(Object.assign(dataContext, {BUCKET_URL_POPUP: result.BUCKET_URL_POPUP}));
    setDataContext(Object.assign(dataContext, {BUCKET_URL_MDPICK: result.BUCKET_URL_MDPICK}));

    const response = await userDressApi.getUserBucket();
    if(!response){
      return;
    }
    setDataContext(Object.assign(dataContext, {BUCKET_URL_USER_MASK: response.BUCKET_URL_USER_MASK}))
  };

  const getB2bMall = async () => {
    const result = await b2bPartnerMallApi.getB2bMalls('');
    if(!result) {
      return;
    }
    const mapItem = {};
    mapData(result, mapItem);
    setDataContext(Object.assign(dataContext, {B2B_MALL_BRANDS: result}));
    setDataContext(Object.assign(dataContext, {B2B_MALL_BRANDS_MAP: mapItem}));
  }

  const getB2bMaleMall = async () => {
    const result = await b2bPartnerMallApi.getB2bMalls('M');
    if(!result) {
      return;
    }
    const mapItem = {};
    mapData(result, mapItem);
    setDataContext(Object.assign(dataContext, {B2B_MALE_MALL_BRANDS: result}));
    setDataContext(Object.assign(dataContext, {B2B_MALE_MALL_BRANDS_MAP: mapItem}));
  }

  const getB2bFemaleMall = async () => {
    const result = await b2bPartnerMallApi.getB2bMalls('F');
    if(!result) {
      return;
    }
    const mapItem = {};
    mapData(result, mapItem);
    setDataContext(Object.assign(dataContext, {B2B_FEMALE_MALL_BRANDS: result}));
    setDataContext(Object.assign(dataContext, {B2B_FEMALE_MALL_BRANDS_MAP: mapItem}));
  }

  const getGroupCategories = async () =>{
    const result = await typeApi.getGroupCategories();
    if(!result){
      return;
    }

    setDataContext(Object.assign(dataContext, {CATEGORY_GROUP : result.data}))
  }

  const getMall = async () =>{
    const result = await typeApi.getMall();
    if(!result){
      return;
    }
    setDataContext(Object.assign(dataContext, {MALL: result.data}))
  }

  const getMallBrand = async () =>{
    // const mallId = localStorage.getItem('mallId');
    const mallId = dataContext.MALL[0].mall.id;
    const result = await brandApi.getMallBrands(mallId);
    if(!result){
      return;
    }
    setDataContext(Object.assign(dataContext, {MALL_BRAND: result.data}))
  }

  useEffect(() => {
    (async () => {
      if (auth.isAuthenticated) {
        await getBrands();
      }
    })()
  }, [auth.register])

  useEffect(() => {
    (async () => {
      if (auth.isAuthenticated) {
        await getTypes('PRODUCT');
        await getMaleCategories();
        await getFemaleCategories();
        await getTypes('PATTERN');
        await getTypes('COLOR');
        await getTypes('TPO');
        await getTypes('JENNIEFIT');
        await getTypes('JENNIEFIT_AI');
        await getBucket();
        await getKeywordList('STYLE');
        await getHandsomeBrands();
        await getHandsomeCategories();
        await getB2bMall();
        await getB2bMaleMall();
        await getB2bFemaleMall();
        await getGroupCategories();
        await getMall();
        await getMallBrand();
      }
    })()
  }, [auth.isAuthenticated]);

  return (
      <DataContext.Provider value={dataContext}>
        {children}
      </DataContext.Provider>
  )
}

export const GetClosetCategoryId =  (categoryIds:number[]) => {
  let closetCategoryId = 0;

  if (categoryIds[0]==1) { // OUTER
    // @ts-ignore
    if (categoryIds[1] == 11) // VEST
      closetCategoryId = 1002;
    else
      closetCategoryId = 1001;
  } else if (categoryIds[0]==4) { // DRESS
    closetCategoryId = 1003;
  } else if (categoryIds[0]==3) { // TOP
    closetCategoryId = 1004;
  } else if (categoryIds[0]==2) {
    // @ts-ignore
    if(categoryIds[1]==13) { // PANTS
      closetCategoryId = 1005;
    } else { // @ts-ignore
      if(categoryIds[1]==14) { // SKIRT
        closetCategoryId = 1006;
      }
    }
  } else if (categoryIds[0]==5) { // ACC
    // @ts-ignore
    if (categoryIds[1]==21) closetCategoryId = 1009; // BAG
    else { // @ts-ignore
      if (categoryIds[1]==22) closetCategoryId = 1008; // SHOES
      else closetCategoryId = 1007;
    }
  }
  return closetCategoryId;
}

export const renderDescription = (description) => {
  switch (description) {
    case 'RJCT01':
      return '옷걸이, 마네킹, 착용샷';
    case 'RJCT03':
      return '접혀짐, 뒤틀려짐'
    case 'RJCT11':
      return '잘린 이미지'
    case 'RJCT12':
      return '흔들린 이미지'
    case 'RJCT10':
      return '화면을 찍은 이미지'
    case 'RJCT05':
      return '단추,지퍼'
    case 'RJCT13':
      return '후드'
    case 'RJCT14':
      return '소매 접힘'
    case 'RJCT06':
      return '끈'
    case 'RJCT04':
      return '택, 라벨'
    case 'RJCT02':
      return '본판 훼손'
    case 'RJCT09':
      return '옷의 앞면 재촬영'
    case 'RJCT15':
      return 'acc'
    case 'RJCT08':
      return '중복'
    case 'RJCT07':
      return '기타'
    default :
      return '기타'
  }
}

export const renderBrandKeyword = (name) => {
  switch (name) {
    case 'LOVELY':
      return '러블리';
    case 'RETRO':
      return '레트로'
    case 'MANISH':
      return '매니쉬'
    case 'MANNISH':
      return '매니쉬'
    case 'MODERN':
      return '모던'
    case 'SEXY':
      return '섹시'
    case 'SIMPLE_BASIC':
      return '심플베이직'
    case 'STREET':
      return '스트릿'
    case 'SPORTY':
      return '스포티'
    case 'AVANT_GARDE':
      return '아방가르드'
    case 'UNISEX':
      return '유니섹스';
    case 'CASUAL':
      return '캐주얼'
    case 'CONTEMPORARY':
      return '컨템포러리'
    case 'CLASSIC_LONG':
      return '클래식'
    case 'TOMBOY':
      return '톰보이'
    case 'PUNK':
      return '펑크'
    case 'FEMININE':
      return '페미닌'
    case 'FORMAL':
      return '포멀'
    case 'HIPPIE':
      return '히피'
    case 'AMEKAJI':
      return '아메카지';
    case 'OFFICE':
      return '오피스';
    case 'VINTAGE':
      return '빈티지';
    case 'CLASSIC':
      return '클래식';
    case 'UNIQUE':
      return '유니크';
  }
  return '';
}

export const renderColor = (name) => {
  switch (name) {
    case 'WHITE':
      return '화이트,흰색';
    case 'GREY':
      return '그레이,회색'
    case 'CHARCOAL':
      return '차콜'
    case 'BLACK':
      return '블랙,검정,검정색'
    case 'IVORY':
      return '아이보리'
    case 'BEIGE':
      return '베이지'
    case 'SKY BLUE':
      return '스카이블루,하늘색'
    case 'BLUE':
      return '블루,파란색'
    case 'NAVY':
      return '네이비,남색'
    case 'BROWN':
      return '브라운,갈색'
    case 'CAMEL':
      return '카멜'
    case 'WINE':
      return '와인'
    case 'KHAKI':
      return '카키,올리브색'
    case 'LIGHT PINK':
      return '연핑크'
    case 'PINK':
      return '핑크,분홍색'
    case 'RED':
      return '레드,빨강색'
    case 'ORANGE':
      return '오렌지,주황색'
    case 'SALMON':
      return '코랄,코랄색'
    case 'YELLOW':
      return '옐로우,노랑색'
    case 'LAVENDER':
      return '라벤더,연보라'
    case 'PURPLE':
      return '퍼플,보라,보라색'
    case 'MINT':
      return '민트'
    case 'LIGHT GREEN':
      return '라이트그린,연두색'
    case 'GREEN':
      return '그린,초록색'
    case 'SILVER':
      return '실버,은색'
    case 'GOLD':
      return '골드,금색'
  }
  return '';
}

export const JennieFitAiThirdItems = (category) => {
  const dataContext = useContext(DataContext);
  return dataContext.JENNIEFIT_AI.filter(item => {
    if (category != null) {
      if (category.length > 1 && category[0].trim() != 'ACC' && category[1].trim() != 'T-SHIRT') {
        return item.name.includes(`${category[0].trim()}_${category[1].trim()}`);
      } else if(category.length > 1 && category[1].trim() == 'T-SHIRT') {
        return item.name.includes(`${category[0].trim()}_${category[1].trim().replace('-', '')}`);
      } else {
        return item.name.includes(category[0].trim())
      }
    }
    return true;
  }).map(item => item.name.split('_')[2])
}

export const JennieFitAiForthItems = (category) => {
  const dataContext = useContext(DataContext);
  return dataContext.JENNIEFIT_AI.filter(item => {
    if (category != null) {
      if (category.length > 1 && category[0].trim() != 'ACC' && category[1].trim() != 'T-SHIRT') {
        return item.name.includes(`${category[0].trim()}_${category[1].trim()}`);
      } else if(category.length > 1 && category[1].trim() == 'T-SHIRT') {
        return item.name.includes(`${category[0].trim()}_${category[1].trim().replace('-', '')}`);
      } else {
        return item.name.includes(category[0].trim())
      }
    }
    return true;
  }).map(item => item.name.split('_')[3])
}