import axios from 'axios';
import LocalStorage from '../api/local-storage';
import router from '../router';

// axios.defaults.baseURL = process.env.API_ROOT;

/**
 *  请求拦截
 */
axios.interceptors.request.use(config => {
  if (LocalStorage.getItem('token')) {
    config.headers.Authorization = LocalStorage.getItem('token');
  }

  return config;
}, err => {
  return Promise.reject(err);
});

/**
 *  响应拦截
 */
axios.interceptors.response.use(res => {
  if (res.data.status === 401) {
    LocalStorage.clear();
    alert('信息过期，请重新登录!');
    res.data.status = 0;
    res.data.result = 401;

    router.replace({
      path: '/',
      //登录成功后跳入浏览的当前页面
      query: {redirect: router.currentRoute.fullPath}
    });
  }

  return res;
}, err => {
  router.replace({
    path: '/',
    //登录成功后跳入浏览的当前页面
    query: {redirect: router.currentRoute.fullPath}
  });

  return Promise.reject(err);
});
