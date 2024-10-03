import {reqGoodsList} from '../../../../../api/good'

Page({
  data: {
    goodsList: [], // 商品列表数据
    total:0,//数据总条数
    isFinish: false, // 判断数据是否加载完毕
    // 接口请求参数
    requestData:{
      page:1,//页码
      limit:10,//每页请求多少条数据
      category1Id:'',//一级分类id
      category2Id:''//二级分类id
    },
  },
  // 获取商品列表的数据
  async getGoodsList(){
    const {data}=await reqGoodsList(this.data.requestData)
    console.log('获取商品列表的数据',data)
    // 将返回的数据赋值给data中的变量
    this.setData({
      goodsList:data.records,
      total:data.total
    })
  },
  onLoad(options){
    console.log('商品列表----onLoad方法')
    Object.assign(this.data.requestData,options)
    // 获取商品列表数据
    this.getGoodsList()
  }
})
