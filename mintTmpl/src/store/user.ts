import { defineStore } from 'pinia';
// import router from '@/router';
import UaParser, { IResult as UaResult } from 'ua-parser-js';

export interface UserState {
  userInfo: UserInfo;
  ua: UaResult;
}

export interface UserInfo {
  id: string;
  token: string;
  name: string;
  avatar?: string;
  roles?: string[];
}

const defaultUserInfo = {
  id: '',
  token: '',
  name: '',
  avatar: '',
  roles: [],
};

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserState => ({
    userInfo: { ...defaultUserInfo },
    ua: new UaParser().getResult(),
  }),
  actions: {
    setUserInfo(payload: UserInfo) {
      this.userInfo = payload;
    },
    resetUserInfo() {
      this.userInfo = { ...defaultUserInfo };
    },
    async getUserInfo() {
      if (!this.userInfo.id) {
        // 异步调用查询用户信息接口
      }
    },
    async login() {
      // router.push({ path: '/' });
    },
    async logout() {
      // 调用退出登陆接口
      // this.resetUserInfo();
      // router.push({ name: 'Login' });
    },
    async verification(token: string) {
      // 调用 token 验证接口
      return Promise.resolve(token);
    },
  },
});
