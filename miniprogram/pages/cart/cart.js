import {
  ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {
  userStore
} from '@/stores/userStore'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllCart
} from '@/api/cart'

const computedBehavior = require('miniprogram-computed').behavior

ComponentWithStore({
  storeBindings: {
    store: userStore,
    fields: ['token']
  },
  behaviors: [computedBehavior],
  computed: {
    // 判断是否全选
    // computed 函数中不能访问 this ，只有 data 对象可供访问
    // 这个函数的返回值会被设置到 this.data.selectAllStatus 字段中
    selectAllStatus(data) {
      return (
        data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
      )
    }
  },
  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  // 组件的方法列表
  methods: {
    // 处理页面的展示
    async showTipGetList() {
      const {
        token
      } = this.data
      // 1.如果没有登录，购物车列表，展示文案：您尚未登陆，点击登陆获取更多权益
      if (!token) {
        this.setData({
          emptyDes: '您尚未登陆，点击登陆获取更多权益',
          cartList: []
        })
        return
      }
      // 获取商品列表数据
      const {
        data: cartList,
        code
      } = await reqCartList()
      if (code === 200) {
        // 2.如果用户登陆，购物车列表为空，展示文案；还没有添加商品，快去添加吧
        this.setData({
          cartList,
          emptyDes: cartList === 0 && '还没有添加商品，快去添加吧'
        })
      }
    },
    // 切换商品的选中状态
    async updateChecked(event) {
      // 获取最新的选中状态
      const {
        detail
      } = event
      // 获取商品的索引和 id
      const {
        id,
        index
      } = event.target.dataset
      // 将最新的状态格式化成后端所需要的数据格式
      const isChecked = detail ? 1 : 0

      // 调用接口，传入参数，更新商品的状态
      const res = await reqUpdateChecked(id, isChecked)

      // 如果数据更新成功，需要将本地的数据一同改变
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },
    onShow() {
      console.log('购物车onshow-----')
      this.showTipGetList()
    },
    async changeAllStatus(event) {
      // 获取全选和全不选的状态
      const isChecked = event.detail ? 1 : 0
      // 调用接口，更新服务器中商品的状态
      const res = await reqCheckAllCart(isChecked)

      // 如果更新成功，需要将本地的数据一同改变
      if (res.code === 200) {
        // 将数据进行拷贝
        const newCart = JSON.parse(JSON.stringify(this.data.cartList))
        // 将数据进行更改
        newCart.forEach((item) => (item.isChecked = isChecked))

        // 进行赋值
        this.setData({
          cartList: newCart
        })
      }
    }
  },

})