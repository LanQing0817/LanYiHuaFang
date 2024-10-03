Page({
  // 页面的初始数据
  data: {
    name: '', // 收货人
    phone: '', // 手机号
    provinceName: '', // 省
    provinceCode: '', // 省 编码
    cityName: '', // 市
    cityCode: '', // 市 编码
    districtName: '', // 区
    districtCode: '', // 区 编码
    address: '', // 详细地址
    fullAddress: '', // 完整地址 (省 + 市 + 区 + 详细地址)
    isDefault: 0 // 设置默认地址，是否默认地址 → 0：否  1：是
  },

  // 保存收货地址
  saveAddrssForm(event) {
    // 解构出省市区以及是否是默认地址
    const {
      provinceName,
      cityName,
      districtName,
      address,
      isDefault
    } = this.data
    // 拼接完整地址
    const fullAddress = provinceName + cityName + districtName + address
    // 合并接口请求参数
    const params = {
      ...this.data,
      fullAddress,
      isDefault: isDefault ? 1 : 0
    }
    console.log(params)
  },

  // 省市区选择
  onAddressChange(event) {
    console.log(event)
    const [provinceCode, cityCode, districtCode] = event.detail.code
    const [provinceName, cityName, districtName] = event.detail.value
    // 存储省市区对应的编码
    this.setData({
      provinceCode,
      provinceName,
      cityCode,
      cityName,
      districtName,
      districtCode
    })
  },
  // 地理定位
  async onLocation() {
    // 调用 getSetting 方法获取用户所有的授权信息
    // 返回的 authSetting 包含小程序已向小程序申请过的权限已经授权结果(true、false)
    const {
      authSetting
    } = await wx.getSetting()
    console.log(authSetting)

    // scope.userLocation 是否已经授权获取地理位置的信息
    // 如果之前没有申请过返回 undefined，需要调用 getLocation
    // 如果之前同意了授权，返回 true，需要调用 getLocation
    // 如果之前拒绝了授权，返回 false，需要用户手动进行授权
    // 等于 true，或者不等于 undefined，说明需要进行授权
    // const isAuth =
    //   authSetting['scope.userLocation'] ||
    //   authSetting['scope.userLocation'] === undefined

    // 为了避免冗余的条件判断，使用 !! 把代码进行优化
    const isAuth = !!authSetting['scope.userLocation']

    if (!isAuth) {
      // 弹窗询问用户是否进行授权
      const modalRes = await wx.modal({
        title: '授权提示',
        content: '需要需要您的地理位置信息，请确认授权'
      })

      // 如果用户点击了取消，说明用户拒绝了授权，给用户提示
      if (!modalRes) return wx.toast({
        title: '您拒绝了授权'
      })

      // 如果用户点击了确定，调用 wx.openSetting 打开微信客户端小程序授权页面
      // 并返回授权以后的结果
      const {
        authSetting
      } = await wx.openSetting()

      // 如果用户没有更新授权信息，提示没有更新授权
      if (!authSetting['scope.userLocation'])
        return wx.toast({
          title: '授权失败！'
        })

      try {
        // 如果用户更新授权信息，则调用 getLocation 获取用户地理位置信息
        const locationRes = await wx.getLocation()
        // 打印地理位置信息
        console.log(locationRes)
      } catch (err) {
        console.log(err)
      }
    } else {
      try {
        // 如果是第一次调用 getLocation 或者之前授权过
        // 直接调用 getLocation 获取用户信息即可
        const locationRes = await wx.getLocation()
        console.log(locationRes)
      } catch (error) {
        wx.toast({
          title: '您拒绝授权获取地址位置'
        })
      }
    }
  }
})