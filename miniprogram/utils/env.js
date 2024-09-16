// 获取小程序账号的信息
const {miniProgram} =wx.getAccountInfoSync()

// 获取小程序当前开发环境
// develop开发版 trial 体验版 release正式版
const {envVersion}=miniProgram

let env={
  baseURL:'https://gmall-prod.atguigu.cn'
}

switch(envVersion){
  case 'develop':
    env.baseURL = 'https://gmall-prod.atguigu.cn'
    break

  case 'trial':
    env.baseURL = 'https://gmall-prod.atguigu.cn'
    break

  case 'release':
    env.baseURL = 'https://gmall-prod.atguigu.cn'
    break
}
export { env }