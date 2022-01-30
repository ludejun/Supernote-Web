const configs = {
  version: '1.0.0', // 代码版本，一般会放在api请求中
  name: 'Supernote', // 用作localstorage的namespace等命名空间
  storage: 'local', // 持久缓存放着localStorage(取值local)，还是sessionStorage（取值session）
  htmlTitle: '正心谷Portal平台', // SPA应用html的title
  successCode: { key: 'errCode', value: '0000' }, // API请求的业务正常Code
  env: process.env.NODE_ENV,
  apiServer: {
    local: '',
    dev: 'http://129.211.39.181:8800',
    sit: '',
    uat: '',
    prod: '',
    mock: ''
  }, // API请求各环境的Domain配置
  staticUrl: {
    local: '',
    dev: '',
    sit: '',
    uat: '',
    prod: '',
    mock: ''
  },
  mockWhiteList: [] // 后端Mock Server的白名单，在白名单中可走Mock服务器，不然还是走DEV服务器
};

module.exports = configs;
