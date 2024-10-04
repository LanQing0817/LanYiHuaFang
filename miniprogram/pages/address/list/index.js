import {
  reqAddressList,
  reqDelAddress
} from '@/api/address'

const app = getApp()

Page({
  // 页面的初始数据
  data: {
    addressList: [1, 2, 3]
  },

  // 去编辑页面
  toEdit() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/add/index'
    })
  },
  // 切换收货地址
  changeAddress(event) {
    // 判断是否是从订单结算页面进入
    if (this.flag !== '1') return

    // 获取到点击的收货地址 id
    const addressId = event.currentTarget.dataset.id
    // 从收货地址列表中获取到获取到点击的收货地址详细信息
    const address = this.data.addressList.find((item) => item.id === addressId)

    // 如果获取成功，将数据存储到 globalData 中
    if (address) {
      app.globalData.address = address
      wx.navigateBack()
    }
  },
  onLoad(options) {
    this.flag = options.flag
  }
})