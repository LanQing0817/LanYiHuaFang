import {
  reqIndexData
} from '../../api/index'
Page({
  // 初始化数据
  data: {
    bannerList: [], // 轮播图数据
    categoryList: [], // 分类数据
    activeList: [], // 活动广告
    hotList: [], // 人气推荐
    guessList: [], // 猜你喜欢
    loading: true, // 数据是否在加载完毕
  },
  // 获取首页数据
  async getIndexData() {
    const res = await reqIndexData()
    console.log('首页数据----', res)
    // 在获取数据以后，对数据进行赋值
    this.setData({
      bannerList: res[0].data, // 轮播图数据
      categoryList: res[1].data, // 分类数据
      activeList: res[2].data, // 活动广告
      hotList: res[3].data, // 人气推荐
      guessList: res[4].data, // 猜你喜欢
      loading:false
    })
    console.log('res', res)
  },
  onLoad() {
    this.getIndexData()
  }
})