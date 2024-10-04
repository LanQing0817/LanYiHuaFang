import {
  reqOrderAddress,
  reqOrderInfo,
  reqBuyNowGoods
} from '@/api/orderpay'
import { formatTime } from '../../../../../utils/formatTime.js'
const app = getApp()
Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '选择送达日期', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    orderAddress: {}, //收货地址
    orderInfo: {}, // 订单商品详情
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    // 使用 new Date 将时间戳转换成 JS 中的日期对象
    const time = formatTime(new Date(event.detail))

    // 将转换以后的时间赋值给送到时间
    this.setData({
      show: false,
      deliveryDate: time
    })
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index'
    })
  },
  // 获取收货地址
  async getAddress() {

    // 如果 globalData 存在收货地址，取出收货地址
    if (app.globalData.address.id) {
      this.setData({
        orderAddress: app.globalData.address
      })

      // 在赋值以后需要将收货地址清空
      app.globalData.address = {}

      return
    }

    // 如果 globalData 中不存在收货地址，获取收货地址渲染即可
    const {
      data: orderAddress
    } = await reqOrderAddress()

    this.setData({
      orderAddress
    })
  },
  // 获取订单详情
  async getOrderInfo() {
    const {
      goodsId,
      blessing
    } = this.data
    //判断是否存在商品id
    // 如果存在调用立即购买商品详情的接口
    //不存在调用获取订单详情数据接口
    const {
      data: orderInfo
    } = goodsId ? await reqBuyNowGoods({
      goodsId,
      blessing
    }) : await reqOrderInfo()

    // 判断是否存在祝福语
    // 如果需要购买多个商品，挑选第一个填写了祝福语的商品进行赋值
    const orderGoods = orderInfo.cartVoList.find((item) => item.blessing !== '')

    this.setData({
      orderInfo,
      blessing: orderGoods && orderGoods.blessing
    })
  },
  // 页面展示时触发的钩子函数
  onShow() {
    this.getAddress()
    // 获取订单结算页面的商品信息
    this.getOrderInfo()
  },
  // 接收立即购买传递的参数
  onLoad(options) {
    this.setData({
      ...options
    })
  },
})