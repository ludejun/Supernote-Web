import { getUserInfo } from '../utils/userInfo';
import { apiConfig } from './apiUrl';
import configs from './index';

// 真实环境请求的url
export function apiURL(type: string) {
  if (apiConfig[type] && apiConfig[type].length > 0) {
    if (configs.mockWhiteList.indexOf(apiConfig[type]) >= 0) {
      return `${configs.apiServer.mock}${apiConfig[type]}`; // Mock服务器代理
    }
    return `${configs.apiServer[process.env.NODE_ENV]}${apiConfig[type]}`;
  }
  throw new Error('该api匹配不到url，请检查api名称或apiConfig配置');
}

export interface ApiOptions {
  method: 'GET' | 'POST';
  headers: Record<string, string>;
  credentials?: RequestCredentials;
  body?: string | FormData;
}

// 基本的Get请求options封装
export function ajaxGetOptions(header: Record<string, string> = {}): ApiOptions {
  const { token = '' } = getUserInfo() || {};
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
      'supernote-client': `supernote-web; source=pc; version=${configs.version}`,
      ...header
    }
  };
}

// 基本的Post请求options封装
export function ajaxPostOptions(
  data: Record<string, unknown>,
  header: Record<string, string> = {}
): ApiOptions {
  const { token = '' } = getUserInfo() || {};
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
      'supernote-client': `supernote-web; source=pc; version=${configs.version}`,
      ...header
    },
    // credentials: 'include',
    body: JSON.stringify(data)
  };
}

// form表单请求Post的options封装
export function ajaxFormPostOptions(formData, header = {}): ApiOptions {
  const { token = '' } = getUserInfo() || {};
  return {
    method: 'POST',
    headers: {
      ...header,
      Authorization: token ? `Bearer ${token}` : undefined,
      'supernote-client': `supernote-web; source=pc; version=${configs.version}`
    },
    // credentials: 'include',
    body: formData
  };
}
