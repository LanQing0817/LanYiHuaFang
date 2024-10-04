import {
  reqOrderAddress,
  reqOrderInfo,
  reqBuyNowGoods,
  reqSubmitOrder,
  reqPreBuyInfo
} from '@/api/orderpay'
import Schema from 'async-validator'
import {
  formatTime
} from '../../../../../utils/formatTime.js'
const app = getApp()
Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '选择送达日期', // 期望送达日期
    blessing: '', // 祝福语
    show: false, // 期望送达日期弹框
    orderAddress: {}, //收货地址
    orderInfo: {}, // 订单商品详情
    minDate: new Date().getTime(),
    currentDate: new Date().getTime()
  },
  async submitOrder() {
    // 从 data 中结构数据
    const {
      buyName,
      buyPhone,
      deliveryDate,
      blessing,
      orderInfo,
      orderAddress
    } = this.data

    // 组织请求参数
    const params = {
      buyName,
      buyPhone,
      deliveryDate,
      remarks: blessing,
      cartList: orderInfo.cartVoList,
      userAddressId: orderAddress.id
    }
    console.log("params----", params)
    // 对请求参数进项验证
    const {
      valid
    } = await this.validatorPerson(params)

    // 打印验证结果
    console.log(valid)

    // 如果验证失败，直接 return，不执行后续的逻辑处理
    if (!valid) return

    // 调用接口，创建平台订单
    console.log("params----", params)
    const res = await reqSubmitOrder(params)
    console.log('res----', res)
    // 在平台订单创建成功以后，将订单编号挂载到页面实例上
    if (res.code === 200) {
      // 将订单编号挂载到页面实例上
      this.orderNo = res.data
      this.advancePay()
    }
  },
  // 获取预付单信息、支付参数
  // 获取预付单信息、支付参数
  async advancePay() {
    console.log('advancePay---')
    try {
      const payParams = await reqPreBuyInfo(this.orderNo)
      console.log('payParams----',payParams)
      if (payParams.code === 200) {
        //payParams.data 就是获取的支付参数
        //调用  wx.requestPayment 发起微信支付
        const payInfo = await wx.requestPayment(payParams.data)
        console.log('支付信息',payInfo)
        // 获取支付结果
        if (payInfo.errMsg === 'requestPayment:ok') {
          // 查询订单的支付状态
          const payStatus = await reqPayStatus(this.orderNo)

          if (payStatus.code === 200) {
            wx.redirectTo({
              url: '/pages/order/list/index',
              success: () => {
                wx.toast({
                  title: '支付成功',
                  icon: 'success'
                })
              }
            })
          }
        }

      }
    } catch (error) {
      console.log(error)
      wx.toast({
        title: '支付失败，请联系客服',
        icon: 'error'
      })
    }
  },
  // 对新增收货地址请求参数进行验证
  validatorPerson(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'

    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'

    // 创建验证规则
    const rules = {
      userAddressId: [{
        required: true,
        message: '请选择收货地址'
      }],
      buyName: [{
          required: true,
          message: '请输入收货人姓名'
        },
        {
          pattern: nameRegExp,
          message: '收货人姓名不合法'
        }
      ],
      buyPhone: [{
          required: true,
          message: '请输入收货人手机号'
        },
        {
          pattern: phoneReg,
          message: '收货人手机号不合法'
        }
      ],
      deliveryDate: {
        required: true,
        message: '请选择送达时间'
      }
    }

    // 传入验证规则进行实例化
    const validator = new Schema(rules)

    // 调用实例方法对请求参数进行验证
    // 注意：我们希望将验证结果通过 Promise 的形式返回给函数的调用者
    return new Promise((resolve) => {
      validator.validate(params, (errors) => {
        if (errors) {
          // 如果验证失败，需要给用户进行提示
          wx.toast({
            title: errors[0].message
          })
          // 如果属性值是 false，说明验证失败
          resolve({
            valid: false
          })
        } else {
          // 如果属性值是 true，说明验证成功
          resolve({
            valid: true
          })
        }
      })
    })
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