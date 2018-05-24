export default {
  setItem(item, val) {
    if(typeof val === 'object' && Object.prototype.toString.call(val) === '[object Object]') {
      val = JSON.stringify(val);
    }

    window.localStorage.setItem(item, val);
  },
  getItem(item) {
    let val = '';

    try {
      val = window.localStorage.getItem(item);

      return JSON.parse(val);
    }
    catch (err) {
      return window.localStorage.getItem(item)
    }
  },
  removeItem(item) {
    window.localStorage.removeItem(item);
  },
  clear() {
    window.localStorage.clear();
  }
};
