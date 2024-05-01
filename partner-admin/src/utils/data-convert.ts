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

export const getMonth = (data) => {
  if(data){
    const res = moment(data).month() + 1
    return res;
  }
}
export const getNumberComma = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


export const strCheck = (str, type) => {
  const _reg = {
    email:/\S+@\S+\.\S+/,
    pw: /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{7,10}$/,
    mobile: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
  }

  if(type === 'email'){
    return _reg.email.test(str);
  }else if(type === 'pw'){
    return _reg.pw.test(str);
  }else if(type === 'mobile'){
    return _reg.mobile.test(str);
  }else{
    return false;
  }
}
