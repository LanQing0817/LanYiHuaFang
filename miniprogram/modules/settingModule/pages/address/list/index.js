import {
  reqAddressList, reqDelAddress
} from '../../../../../api/address'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [] //收货地址列表
  },
  // 获取收货地址
  async getAddressList() {
    const {
      data: addressList
    } = await reqAddressList()
    this.setData({
      addressList
    })
  },
  // 去编辑页面
  toEdit(event) {
    const {id}=event.target.dataset
    console.log('id----',id)
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  // 删除收货地址
  async delAddress(e){
    const {id} = e.target.dataset
    await reqDelAddress(id)
    this.getAddressList()
  },
  onLoad() {
    this.getAddressList()
  }
})