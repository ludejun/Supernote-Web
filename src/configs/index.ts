export type Env = 'local' | 'mock' | 'dev' | 'prod';

const configs = {
  version: '1.0.0', // 代码版本，一般会放在api请求中
  name: 'Supernote', // 用作localstorage的namespace等命名空间
  storage: 'local', // 持久缓存放着localStorage(取值local)，还是sessionStorage（取值session）
  htmlTitle: '正心谷Portal平台', // SPA应用html的title
  successCode: { key: 'errCode', value: '0000' }, // API请求的业务正常Code
  env: process.env.NODE_ENV,
  apiServer: {
    local: 'http://localhost:8000',
    dev: 'http://localhost:8000',
    prod: 'http://129.211.39.181:8800',
    mock: ''
  } as Record<Env, string>, // API请求各环境的Domain配置
  staticUrl: {
    local: '',
    dev: '',
    prod: 'http://129.211.39.181',
    mock: ''
  } as Record<Env, string>,
  mockWhiteList: [] // 后端Mock Server的白名单，在白名单中可走Mock服务器，不然还是走DEV服务器
};

export default configs;
