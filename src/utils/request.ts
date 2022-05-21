import { message } from 'antd';
import { fetch as whatwgFetch } from 'whatwg-fetch';
import configs from '../configs';

type Fetch = typeof window.fetch;

const fetch = window.fetch || (whatwgFetch as Fetch);

function parseJSON(response: Response) {
  return response.json();
}

// 处理网络Code
function checkStatus(response) {
  const { status } = response;
  if (status === 401) {
    message.error(
      '登录态失效，请重新登录',
      1.5,
      () => (window.location.href = window.location.origin + '/login')
    );
  } else {
    return response;
  }
}

// 处理业务Code
function checkoutCode(response) {
  const { error, message: errMsg, data, status } = response || {};
  if (status === 'success') {
    return data;
  } else {
    message.error(`${errMsg}：${error}`);
    const resError = new Error(response.statusText) as Error & {
      response: Response;
    };
    resError.response = response;
    throw resError;
  }
}

function catchError(error) {
  console.log('catchError', error);
  // 统一request请求报错处理，弹toast等

  return Promise.reject(error);
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} api       将要请求的url // 将要请求的API，从config/api中得到具体url
 * @param  {object} [options] The options we want to pass to "fetch"，参考https://github.github.io/fetch/
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(api, options) {
  return fetch(api, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkoutCode)
    .catch(catchError);
}
