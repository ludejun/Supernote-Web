export const apiConfig: { [key: string]: string } = {
  // 登录
  verificationCode: '/v1/users/verification/code', // 生成验证码
  signup: '/v1/users/signup', // 注册
  sign: '/v1/users/signin', // 登陆
  //  qrCodeValid: '/portal/login/qrCodeValid', // PC页面二维码登录结果轮询接口
  //  logout: '/portal/login/logout', // PC页面登出接口

  // 笔记
  createNote: '/v1/notes', // 创建笔记
  getNote: '/v1/notes', // 获取笔记
  getUserNotes: '/v1/users/notes', // 获取用户笔记树
  uploadImg: '/v1/upload' // 上传图片
};
