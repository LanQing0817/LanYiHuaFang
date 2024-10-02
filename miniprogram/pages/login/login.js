import {
  reqLogin,reqUserInfo
} from '../../api/user'
import {
  userStore
} from '../../stores/userStore.js'
import {
  ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {setStorage} from '../../utils/storage'

ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token','userInfo'],
    actions: ['setToken','setUserInfo']
  },
  methods: {
    // 点击登录
    login() {
      console.log('点击登陆--------------')
      // 调用wx.login获取用户信息
      wx.login({
        success: async ({
          code
        }) => {
          if (code) {
            // 调用接口，传入code进行登录
            const {data} = await reqLogin(code)
            // 登陆成功以后，需要将token存储到本地
            setStorage('token', data.token)
            //将数据存储到store对象中
            this.setToken(data.token)
            // 获取用户信息
           this.getUserInfo()
            // 返回上一级页面
           wx.navigateBack() 
          } else {
            // 登陆失败后给用户进行提示
            toast({
              title: '授权失败，请稍后再试~~~'
            })
          }
        }
      }) 
    },
    // 获取用户信息
    async getUserInfo() {
      const { data } = await reqUserInfo()
      // 将用户信息存储到本地
      setStorage('userInfo', data)
      // 将用户信息存储到 Store
+     this.setUserInfo(data)
    }
  }

})