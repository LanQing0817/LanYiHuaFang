import {
  reqGoodsInfo
} from '../../../../../api/good'
import {reqAddCart} from '@/api/cart'
import {
  userBehavior
} from '@/behaviors/userBehavior'
import {
  reqCartList
} from '@/api/cart'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: '', //是否立即购买
    allCount: '', //购物车商品总数量
  },
  // 获取商品的想起
  async getGoodsInfo() {
    const {
      data: goodsInfo
    } = await reqGoodsInfo(this.goodsId)
    // 将商品详情数据赋值给data中的变量
    this.setData({
      goodsInfo
    })
  },
  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },
  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },
  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({
      show: false
    })
  },
  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    // 将最新的购买数量同步到data
    this.setData({
      count: Number(event.detail)
    })
  },
  // 弹框的确定按钮
  async handleSubmit() {
    console.log('handleSubmit----')
    // 解构获取数据
    const {
      token,
      count,
      blessing,
      buyNow
    } = this.data
    const goodsId = this.goodsId

    // 如果没有 token ，让用户新登录
    if (!this.data.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    // 验证购买数量的正则
    const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
    // 使用正则验证
    const res = reg.test(count)

    // 如果验证没有通过，直接返回，不执行后续的逻辑
    if (!res) return


    // 加入购物车
    if (buyNow === 0) {
      // 加入购物车
      const res = await reqAddCart({
        goodsId,
        count,
        blessing
      })

      if (res.code === 200) {

        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          mask: false
        })
        //购物车购买数量合计
        this.getCartCount()
        this.setData({
          show: false
        })

      }
    } else {
      // 立即购买
      wx.navigateTo({
        url: `/pages/order/detail/index?goodsId=${goodsId}&blessing=${blessing}`
      })
    }
  },
  // 计算购买数量
  async getCartCount() {
    if (!this.data.token) return
    // 获取购物的商品
    const res = await reqCartList()
    if (res.data.length !== 0) {
      // 购物车商品累加
      let allCount = 0
      // 获取购物车商品数量
      res.data.forEach((item) => {
        allCount += item.count
      })
      // 将购物车购买数量赋值
      this.setData({
        // 展示的数据要求是字符串
        allCount: (allCount > 99 ? '99+' : allCount) + ''
      })
    }
  },
  // 生命周期函数-监听页面加载
  onLoad(options) {
    // 将商品id挂载到页面实例上
    this.goodsId = options.goodsId ? options.goodsId : ''
    // 获取商品详情的数据
    this.getGoodsInfo()
    // 计算购买数量
    this.getCartCount()
  },
  // 预览商品图片
  previewImg() {
    console.log("")
    wx.previewImage({
      urls: this.data.goodsInfo.detailList,
    })
  }
})