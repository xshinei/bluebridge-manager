export function currentTimeStamp() {
  let date = new Date();
  let obj = {};

  obj.year = date.getFullYear();
  obj.month = date.getMonth();
  obj.day = date.getDay();
  obj.hour = date.getHours();
  obj.minute = date.getMinutes();
  obj.second = date.getSeconds();
  obj. milliSecond = date.getMilliseconds();

  let timeStr = '';
  for(let key in obj) {
    if(obj.hasOwnProperty(key)) {

      if(obj[key].toString().length === 1) {
        obj[key] = '0' + obj[key];
      }

      timeStr += obj[key];
    }
  }

  return timeStr;
}

/**
 * 将一个对象自身属性的键首字母大写
 * @param {Object} target
 * @return {Object} obj
 */
export function toFirstUpper(target) {
  if(typeof target === 'string') {
    return target.slice(0 , 1).toUpperCase() + target.slice(1);
  }
  else if(typeof target === 'object') {
    let obj = {};

    for(let key in target) {
      if(target.hasOwnProperty(key)) {
        let newKey = key.slice(0, 1).toUpperCase() + key.slice(1);
        obj[newKey] = target[key];
      }
    }

    return obj;
  }
}

export function toFirstLower(target) {
  if(typeof target === 'string') {
    return target.slice(0 , 1).toLowerCase() + target.slice(1);
  }
  else if(typeof target === 'object') {
    let obj = {};

    for(let key in target) {
      if(target.hasOwnProperty(key)) {
        let newKey = key.slice(0, 1).toLowerCase() + key.slice(1);
        obj[newKey] = target[key];
      }
    }

    return obj;
  }
}
