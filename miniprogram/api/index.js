// 导入封装的网络请求工具 http.js
import http from '../utils/http.js'

/**
 * 通过并发请求获取首页的数据
 */
export const reqIndexData = () => {
  return Promise.all([
    http.get('/mall-api/index/findBanner'),
    http.get('/mall-api/index/findCategory1'),
    http.get('/mall-api/index/advertisement'),
    http.get('/mall-api/index/findListGoods'),
    http.get('/mall-api/index/findRecommendGoods')
  ]
    
  )
}