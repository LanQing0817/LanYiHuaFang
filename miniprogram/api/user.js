import http from '../utils/http'

/**
 * @description 授权登录
 * @param {*} code 临时登录凭证code
 * @returns Promise
 */
export const reqLogin = (code) => {
  return http.get(`/mall-api/weixin/wxLogin/${code}`)
}

/**
 * @description 获取用户信息
 * @returns Promise
 */
export const reqUserInfo = () => {
  return http.get(`/mall-api/weixin/getuserInfo`)
}