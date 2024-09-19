// 导入observable函数用于创建可观察对象
// 导入action修改store中的可观察状态
import {observable,action} from 'mobx-miniprogram'
import {getStorage} from '../utils/storage'

// 创建store对象，存储应用的状态
export const userStore=observable({
  // 创建可观察状态token
  token:getStorage('token')||'',
  // 对token进行修改
  setToken:action(function (token){
    this.token=token
  })
})