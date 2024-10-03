import Schema from 'async-validator'
import {
  reqAddAddress,reqAddressInfo,reqUpdateAddress 
} from './/../../../../../api/address'
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
  // 新增或修改地址
  async saveAddrssForm(event) {
    // 组织参数 (完整地址、是否设置为默认地址)
    const {
      provinceName,
      cityName,
      districtName,
      address,
      isDefault
    } = this.data

    // 最终需要发送的请求参数
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0
    }
    // 调用方法对最终的请求参数进行验证
    const {
      valid
    } = await this.validateAddress(params)

    // 如果验证没有通过，不继续执行后续的逻辑
    if (!valid) return
    // 发送请求，保存收货地址
    const res = this.addressId ?
      await reqUpdateAddress(params) :
      await reqAddAddress(params)

    if (res.code === 200) {
      // 提示用户更新状态
      wx.toast({
        title: this.addressId ? '编辑收货地址成功' : '新增收货地址成功'
      })

      // 返回到收货地址列表页面
      wx.navigateBack()
    }
  },
  // 回显收货地址的逻辑
  async showAddressInfo(id) {
    // 判断是否存在 id，如果不存在 id，return 不执行后续的逻辑
    if (!id) return

    // 如果存在 id，将 id 挂载到 this 页面实例上
    this.addressId = id

    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: '更新收货地址'
    })

    // 调用方法获取收货地址详细信息
    const {
      data
    } = await reqAddressInfo(this.addressId)
    // 将获取的数据进行赋值
    this.setData(data)
  },
  // 验证新增收货地址请求参数
  // 形参 params 是需要验证的数据
  validateAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    // 创建验证规则，验证规则是一个对象
    // 每一项是一个验证规则，验证规则属性需要和验证的数据进行同名
    const rules = {
      name: [{
          required: true,
          message: '请输入收货人姓名'
        },
        {
          pattern: nameRegExp,
          message: '收货人姓名不合法'
        }
      ],
      phone: [{
          required: true,
          message: '请输入收货人手机号'
        },
        {
          pattern: phoneReg,
          message: '手机号不合法'
        }
      ],
      provinceName: {
        required: true,
        message: '请选择收货人所在地区'
      },
      address: {
        required: true,
        message: '请输入详细地址'
      }
    }

    // 创建验证实例，并传入验证规则
    const validator = new Schema(rules)

    // 调用实例方法对数据进行验证
    // 注意：我们希望将验证结果通过 Promsie 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors, fields) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({
            title: errors[0].message
          })

          resolve({
            valid: false
          })
        } else {
          resolve({
            valid: true
          })
        }
      })
    })
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
  },
  onLoad(options) {
    // 回显收货地址的逻辑
    this.showAddressInfo(options.id)
  }
})