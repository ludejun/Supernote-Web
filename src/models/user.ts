import { UserInfo } from '../utils/userInfo';
export const user = {
  state: {
    isAuth: false,
    codeLoading: false,
    signupLoading: false,
    loginLoading: false,
    userInfo: {} as UserInfo,
    code: ''
  }, // initial state
  reducers: {
    // 发送验证码
    verificationCode(
      state: Record<string, unknown>,
      payload: {
        loading: boolean;
        status: string;
        data: {
          code: string;
        };
      }
    ) {
      return {
        ...state,
        codeLoading: payload.loading,
        ...(payload.status === 'success' ? { code: payload.data.code } : null)
      };
    },
    // 注册
    signup(
      state: Record<string, unknown>,
      payload: {
        loading: boolean;
        status: string;
        data: {
          token: string;
          user: {
            id: string;
            name: string;
            avatar_url?: string;
          };
        };
      }
    ) {
      return {
        ...state,
        signupLoading: payload.loading,
        ...(payload.status === 'success' ? { userInfo: payload.data } : null)
      };
    },
    // 登录
    login(
      state: Record<string, unknown>,
      payload: {
        loading: boolean;
        status: string;
        data: {
          token: string;
          user: {
            id: string;
            name: string;
          };
        };
      }
    ) {
      return {
        ...state,
        loginLoading: payload.loading,
        ...(payload.status === 'success' ? { userInfo: payload.data } : null)
      };
    }
  }
};
