import {
  reqOrderAddress
} from '@/api/orderpay'

Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '选择送达日期', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    orderAddress: {} //收货地址
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    this.setData({
      show: false
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

  // 页面展示时触发的钩子函数
  onShow() {
    this.getAddress()
  }
})