import _ from 'lodash';
import moment from "moment";

export const getDataContextValue = (data, context, key, returnKey): string => {
  if (data[context]) {
    if (data[context][key]) {
      if (returnKey) {
        return data[context][key][returnKey];
      }
      return data[context][key];
    }
  }
  return '';
};

export const getDataContextValueByKey = (dataContext, key) => {
  if (key) {
    return dataContext.ASSIGN_STATUS[key];
  }
  return '';
}

export const sortByTaste = (tastes) => {
  return _.sortBy(tastes, (taste) => {
    switch (taste) {
      case 'F':
      case 'D':
        return 0;
      case 'C':
      case 'O':
        return 1;
      case 'U':
      case 'B':
        return 2;
      case 'T':
      case 'M':
        return 3;
    }
    return 9999;
  })
}

export const sortBySeason = (seasons) => {
  return _.sortBy(seasons, (season) => {
    switch (season) {
      case 'SPRING':
        return 0;
      case 'SUMMER':
        return 1;
      case 'FALL':
        return 2;
      case 'WINTER':
        return 3;
    }
    return 9999;
  })
}

export const getDay = (date) => {
  return moment(date).format('YY-MM-DD')
}

export const getDate = (date) => {
  if (date) {
    return moment(date).format('YY-MM-DD HH:mm')
  }
  return '';
}

export const getNumberComma = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const stateDay = (date) => {
  const dDay = moment(date);
  const todayTime = new Date();
  // @ts-ignore
  const result = dDay - todayTime;
  return Math.floor(result / (1000*60*60*24));
}

export const formatBytes = (bytes, decimals = 2) =>{
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const fileName = (name) => {
  if(name.length > 30){
    return [...name].slice(0,30).join("") + '...'
  }else{
    return name
  }
};
export const renderKeyword = (name) => {
  switch (name) {
    case '페미닌':
      return 'FEMININE';
    case '러블리':
      return 'LOVELY';
    case '섹시':
      return 'SEXY';
    case '매니쉬':
      return 'MANNISH';
    case '유니섹스':
      return 'UNISEX';
    case '아메카지':
      return 'AMEKAJI';
    case '컨템포러리':
      return 'CONTEMPORARY';
    case '모던':
      return 'MODERN';
    case '오피스':
      return 'OFFICE';
    case '스트릿':
      return 'STREET';
    case '스포티':
      return 'SPORTY';
    case '캐주얼':
      return 'CASUAL';
    case '빈티지':
      return 'VINTAGE';
    case '클래식':
      return 'CLASSIC';
    case '심플베이직':
      return 'SIMPLE_BASIC';
    case '유니크':
      return 'UNIQUE';
    case '레트로':
      return 'RETRO';
    case '아방가르드':
      return 'AVANT_GARDE';
    case '톰보이':
      return 'TOMBOY';
    case '펑크':
      return 'PUNK';
    case '포멀':
      return 'FORMAL';
    case '히피':
      return 'HIPPIE';
  }
  return '';
}