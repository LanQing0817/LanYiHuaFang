import {
  reqGoodsList
} from '../../../../../api/good'

Page({
  data: {
    goodsList: [], // 商品列表数据
    total: 0, //数据总条数
    isFinish: false, // 判断数据是否加载完毕
    // 接口请求参数
    requestData: {
      page: 1, //页码
      limit: 10, //每页请求多少条数据
      category1Id: '', //一级分类id
      category2Id: '' //二级分类id
    },
    isLoading: false, // 判断数据是否记载完毕
  },
  // 获取商品列表的数据
  async getGoodsList() {
    // 数据真正请求中
    this.data.isLoading = true
    const {
      data
    } = await reqGoodsList(this.data.requestData)
    // 数据加载完毕
    this.data.isLoading = false
    // 将返回的数据赋值给data中的变量
    this.setData({
      goodsList: [...this.data.goodsList, ...data.records],
      total: data.total
    })
  },
  // 监听页面的上拉操作
  onReachBottom() {
    // 从data中解构数据
    const {
      total,
      goodsList,
      requestData
    } = this.data
    let {
      page
    } = this.data.requestData

    // 判断数据是否加载完毕,如果isLoading等于true
    // 说明数据还没有加载完毕，不加载下一页数据
    if (this.data.isLoading) return
    if (total === goodsList.length) {
      this.setData({
        isFinish: true
      })
      return
    }

    // 页码加1
    this.setData({
      requestData: {
        ...this.data.requestData,
        page: page + 1
      }
    })
    // 重新发送请求
    this.getGoodsList()
  },
  onLoad(options) {
    console.log('商品列表----onLoad方法')
    Object.assign(this.data.requestData, options)
    // 获取商品列表数据
    this.getGoodsList()
  },
  // 监听页面的下拉刷新
  onPullDownRefresh() {
    // 将数据进行重置
    this.setData({
      goodsList: [],
      total: 0,
      isFinish: false,
      requestData: {
        ...this.data.requestData,
        page: 1
      }
    })

    // 重新获取列表数据
    this.getGoodsList()
  }
})