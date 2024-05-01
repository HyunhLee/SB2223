import React, {createContext, useEffect, useState} from 'react';
import {typeApi} from "../api/type-api";
import {brandApi} from "../api/brand-api";
import {useAuth} from "../hooks/use-auth";

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
    'WHITE': 'rgb(255,255,255)',
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
  REQUESTED:'검수신청',
  REJECTED:'반려',
  COMPLETED:'승인완료',
  UNWORKABLE:'작업불가'
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

const assignPriority = {
  NORMAL:'일반',
  URGENCY:'긴급'
}

const retail = {
  Retail: 'O (일반상품)',
  Default: 'X (디폴트아이템)'
}

const assignRejectReason = {
  AVATAR:'아바타 피팅결과',
  SCREEN:'화면을 찍은 이미지 불가',
  ORIGINAL:'original mask',
  WARP:'warp mask'
}

const registrationType = {
  Manual: '파트너사 수동 등록',
  Automatic: '파트너사 자동 연동'
}

const displayStatus = {
  DisplayOn: '진열중',
  DisplayEnd: '진열중지',
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
  PRE_COMPLETE:'검수요청'
}

const Day = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
}

const myPageTabs = {
  ACCOUNT_INFO: '계정정보',
  BUSINESS_INFO: '사업자 정보',
  BRAND_INFO: '브랜드 정보',
}

const jennieFitRequestedStatus = {
  REQUESTED: '신청',
  UNREQUESTED: '미신청'
}

const jennieFitRequestType = {
  JennieFit: '제니FIT',
  Default: '일반상품'
}

const registrationStatus = {
  INPUT_WAIT: '정보 입력대기',
  INPUT_COMPLETED: '정보 입력완료',
  WORKING_ON: '검수중',
  REJECTED: '반려',
  COMPLETED: '승인',
}

const requestStatus = {
  InputWait: '입력대기',
  InputComplete: '입력완료',
  Inspection: '검수중',
  Rejected: '작업불가',
  Completed: '승인'
}

const soldoutStatus = {
  false: 'N',
  true: 'Y',
}

const applyStatus = {
  APPLY: '신청',
  APPLY_COMPLETED: '입점 승인',
  REJECTED: '반려',
}

const serviceStatus = {
  B2B: 'B2B',
  B2C: 'B2C',
}

const cafe24Display = {
  T: '진열중',
  F: '진열중지'
}

const cafe24Selling = {
  T: '판매중',
  F: '판매중지'
}

const cafe24SoldOut = {
  T: 'Y',
  F: 'N'
}

const cafe24SortType = {
  LINKED: '연동 상품',
  UNLINKED: '미연동 상품'
}


const b2bStatusList = {
  DisplayOn: 'DisplayOn',
  DisplayEnd: 'DisplayEnd',
  IsSoldOut: 'IsSoldOut',
}

const sortList = {
  Popular: '인기순',
  LowestPrice: '낮은가격순',
  HighestPrice: '높은가격순'
}

const faqType = {
  CAFE24: '카페24',
  PRODUCT: '상품',
  MARKETING: '마케팅',
  ETC: '기타'
}

const inquiryType = {
  PRODUCT : '상품',
  FITTING_ROOM : '피팅룸 서비스',
  SYSTEM_ERROR: '오류',
  FUNCTION_INQUIRY: '기능문의',
  SETTLEMENT: '정산',
  ETC: '기타',
}

const inquiryStatus = {
  OPEN: '답변대기',
  CLOSE: '답변완료'
}

const gender = {
  M: '남성',
  F: '여성'
}

const grade = {
  A: '상',
  B: '중',
  C: '하'
}

const defaultValue = () => {
  return {
    CATEGORY: [],
    CATEGORY_MAP: {},
    FEMALE_CATEGORY: [],
    FEMAlE_CATEGORY_MAP: {},
    MALE_CATEGORY: [],
    MALE_CATEGORY_MAP: {},
    COLOR: [],
    COLOR_MAP: {},
    PATTERN: [],
    PATTERN_MAP: {},
    BRAND: [],
    BRAND_MAP: {},
    JENNIEFIT: [],
    JENNIEFIT_MAP: {},
    CATEGORY_GROUP: [],
    MALL_BRAND: [],
    MALL_NAME: '',
    DAY: Day,
    SOLD_OUT: soldoutStatus,
    MY_PAGE_TABS: myPageTabs,
    JENNIE_FIT_REQUESTED_STATUS: jennieFitRequestedStatus,
    JENNIE_FIT_REQUEST_TYPE: jennieFitRequestType,
    REGISTRATION_STATUS: registrationStatus,
    REQUEST_STATUS: requestStatus,
    ASSIGN_STATUS: assignStatus,
    INSPECTION_STATUS: inspectionStatus,
    ASSIGN_PRIORITY: assignPriority,
    ASSIGN_REJECT_REASON: assignRejectReason,
    REGISTRATION_TYPE: registrationType,
    SEASON: season,
    RETAIL: retail,
    GENDER: gender,
    GRADE: grade,
    DISPLAY_STATUS: displayStatus,
    USER_DRESS_REGISTRATION_TYPE: userDressRegistrationType,
    FIT_REQUEST_STATUS: fitRequestStatus,
    PRODUCT_SEASON_TYPE: productSeasonType,
    APPLY_STATUS: applyStatus,
    SERVICE_STATUS: serviceStatus,
    CAFE24_DISPLAY: cafe24Display,
    CAFE24_SELLING: cafe24Selling,
    CAFE24_SOLD_OUT: cafe24SoldOut,
    CAFE24_SORT_TYPE: cafe24SortType,
    BTB_STATUS_LIST: b2bStatusList,
    SORT_LIST : sortList,
    FAQ_TYPE: faqType,
    INQUIRY_TYPE :inquiryType,
    INQUIRY_STATUS :inquiryStatus
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

  const getFemaleCategories = async () => {
    const femaleCategories = await typeApi.getProductCategories('F');

    const mapItem = {};
    const treeItems = treeData(femaleCategories, null, null, mapItem);
    setDataContext(Object.assign(dataContext, {'FEMALE_CATEGORY': treeItems}));
    setDataContext(Object.assign(dataContext, {'FEMALE_CATEGORY_MAP': mapItem}));

  }

  const getMaleCategories = async () => {
    const maleCategories = await typeApi.getProductCategories('M');

    const mapItem = {};
    const treeItems = treeData(maleCategories, null, null, mapItem);
    setDataContext(Object.assign(dataContext, {'MALE_CATEGORY': treeItems}));
    setDataContext(Object.assign(dataContext, {'MALE_CATEGORY_MAP': mapItem}));

  }

  const getGroupCategories = async () =>{
    const result = await typeApi.getGroupCategories();
    if(!result){
      return;
    }

    setDataContext(Object.assign(dataContext, {CATEGORY_GROUP : result.data}))
  }

  const getMallBrand = async () => {
    const mallId = localStorage.getItem('mallId');
    const result = await brandApi.getMallBrands(mallId);
    if (!result) {
      return;
    }
    setDataContext(Object.assign(dataContext, {MALL_BRAND: result.data}))
  }

  const getMallName = async () => {
    const result = localStorage.getItem('mallName');
    if (!result) {
      return;
    }
    setDataContext(Object.assign(dataContext, {MALL_NAME: result}))
  }

  useEffect(() => {
    (async () => {
      if (auth.isAuthenticated) {
        await getTypes('PRODUCT');
        await getMaleCategories();
        await getFemaleCategories();
        await getTypes('PATTERN');
        await getTypes('COLOR');
        await getTypes('JENNIEFIT');
        await getGroupCategories();
        await getMallBrand();
        await getMallName();
      }
    })()
  }, [auth.isAuthenticated]);

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  )
}
